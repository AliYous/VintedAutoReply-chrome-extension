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

  let unreadFavNotifications = favNotifications?.filter(
    (notif) => !notif.is_read
  );

  if (!unreadFavNotifications || unreadFavNotifications.length === 0) {
    console.log("no unread notifications");
    return null;
  }

  if (lastNotificationHandled) {
    const indexOfLastHandledNotif = unreadFavNotifications.findIndex(
      (notif) => notif.id === lastNotificationHandled
    );

    if (indexOfLastHandledNotif !== -1) {
      unreadFavNotifications = unreadFavNotifications.slice(
        0,
        indexOfLastHandledNotif
      );
    }
  }

  if (!unreadFavNotifications || unreadFavNotifications.length === 0) {
    console.log("All Notifications have already been handled");
    return null;
  }

  unreadFavNotifications = unreadFavNotifications.map((notif) => ({
    ...notif,
    senderUserId: globalThis.extractNotifSenderUserId(notif),
  }));

  const currentUserId = unreadFavNotifications[0].user_id;

  const csrf_token = document.head.querySelector("[name=csrf-token]").content;

  const userProducts = await globalThis.getUserSellingProducts({
    currentUserId: currentUserId,
    csrf_token: csrf_token,
  });

  if (csrf_token) {
    let tempLastNotifHandledId;

    await globalThis.asyncForEach(unreadFavNotifications, async (notif) => {
      // Continue only if product is not reserved
      if (userProducts && userProducts.length > 0) {
        const isProductReserved = globalThis.checkIsProductReserved({
          productId: notif.subject_id,
          productsList: userProducts,
        });
        if (isProductReserved) {
          return;
        }
      }

      const msgThreadId = await globalThis.getMsgThreadId({
        itemId: notif.subject_id,
        msgRecipientId: notif.senderUserId,
      });

      await globalThis.randomTimeout(400, 900);
      const conversationHasMessages =
        await globalThis.checkConversationHasMessages({
          currentUserId: currentUserId,
          msgThreadId: msgThreadId,
          csrf_token: csrf_token,
        });

      // Do not send message if the conv was already started
      if (conversationHasMessages) {
        return;
      }

      await globalThis.sendMessageByQuery({
        currentUserId: currentUserId,
        msgThreadId: msgThreadId,
        csrf_token: csrf_token,
        messageContent: messageContent,
      });

      if (deleteEachConvo) {
        await globalThis.randomTimeout(1300, 2500);
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
