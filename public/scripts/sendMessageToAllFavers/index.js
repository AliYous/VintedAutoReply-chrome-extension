/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-undef */

async function sendMessageToAllFavers({
  lastNotificationHandled,
  messageContent,
  deleteEachConvo,
}) {
  const allNotifications = await globalThis.fetchAllNotifications();

  if (!allNotifications) {
    return null;
  }

  let favNotifications = allNotifications.filter((notif) =>
    notif.link.includes("want_it")
  );

  if (!favNotifications || favNotifications.length === 0) {
    console.log("no fav notifications were found");
    return null;
  }

  if (lastNotificationHandled) {
    const indexOfLastHandledNotif = favNotifications.findIndex(
      (notif) => notif.id === lastNotificationHandled
    );

    if (indexOfLastHandledNotif !== -1) {
      favNotifications = favNotifications.slice(0, indexOfLastHandledNotif);
    }
  }

  if (!favNotifications || favNotifications.length === 0) {
    console.log("All Notifications have already been handled");
    return null;
  }

  favNotifications = favNotifications.map((notif) => ({
    ...notif,
    senderUserId: globalThis.extractNotifSenderUserId(notif),
  }));

  const currentUserId = favNotifications[0].user_id;

  const csrf_token = document.head.querySelector("[name=csrf-token]").content;

  const userProducts = await globalThis.getUserSellingProducts({
    currentUserId: currentUserId,
    csrf_token: csrf_token,
  });

  if (csrf_token) {
    let tempLastNotifHandledId;

    await globalThis.asyncForEach(favNotifications, async (notif) => {
      // Continue only if product is not reserved
      if (userProducts && userProducts.length > 0) {
        const isProductReserved = globalThis.checkIsProductReserved({
          productId: notif.subject_id,
          productsList: userProducts,
        });
        if (isProductReserved) {
          console.log("product is reserved");
          return;
        }
      }

      const msgThreadId = await globalThis.getMsgThreadId({
        itemId: notif.subject_id,
        msgRecipientId: notif.senderUserId,
      });

      const conversationHasMessages =
        await globalThis.checkConversationHasMessages({
          currentUserId: currentUserId,
          msgThreadId: msgThreadId,
          csrf_token: csrf_token,
        });

      // Do not send message if the conv was already started
      if (conversationHasMessages) {
        console.log("Conversation skipped - already has messages");
        return;
      }

      await globalThis.sendMessageByQuery({
        currentUserId: currentUserId,
        msgThreadId: msgThreadId,
        csrf_token: csrf_token,
        messageContent: messageContent,
      });

      if (deleteEachConvo) {
        await globalThis.deleteMessageThreadId({
          currentUserId: currentUserId,
          msgThreadId: msgThreadId,
          csrf_token: csrf_token,
        });
      }
      tempLastNotifHandledId = notif.id;
    });
    await globalThis.saveToStoragePromise(
      "lastNotificationHandled",
      tempLastNotifHandledId
    );
    return null;
  }
}

chrome.storage.local.get(
  ["lastNotificationHandled", "messageContent", "deleteEachConvo"],
  async (items) => {
    try {
      await sendMessageToAllFavers({
        lastNotificationHandled: items.lastNotificationHandled,
        messageContent: items.messageContent,
        deleteEachConvo: items.deleteEachConvo,
      });
      chrome.runtime.sendMessage({
        msg: "autoSendExecutedSuccess",
      });
    } catch (err) {
      console.log(err);
    }
  }
);
