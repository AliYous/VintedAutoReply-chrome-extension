/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-undef */

async function fetchAllNotifications() {
  try {
    const notificationsUrl = `https://www.vinted.fr/api/v2/notifications`;
    const stream = await fetch(notificationsUrl);
    const jsonData = await stream.json();
    const allNotifications = jsonData.notifications;
    return allNotifications;
  } catch (e) {
    console.log(e);
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function extractNotifSenderUserId(notification) {
  const { body } = notification;
  const bodyUrl = body.match(/\bhttps?:\/\/\S+/gi)[0];
  const notifSenderId = bodyUrl.replace(/\D/g, ""); // filter recipient id from url
  return parseInt(notifSenderId);
}

async function getMsgThreadId({ itemId, msgRecipientId }) {
  const res = await fetch(
    `https://www.vinted.fr/items/${itemId}/want_it/new?offering_id=${msgRecipientId}`
  );
  const inboxUrl = res.url;
  const threadId = inboxUrl.replace(/\D/g, "");
  return threadId;
}

async function sendMessageByQuery({
  currentUserId,
  msgThreadId,
  messageContent,
  csrf_token,
}) {
  await fetch(
    `https://www.vinted.fr/api/v2/users/${currentUserId}/msg_threads/${msgThreadId}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "fr",
        "content-type": "application/json",
        "sec-ch-ua": '"Chromium";v="96", "Opera";v="82", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": `${csrf_token}`,
      },
      referrer: `https://www.vinted.fr/inbox/${msgThreadId}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"body":"${messageContent}","photo_temp_uuids":null}`,
      method: "PUT",
      mode: "cors",
      credentials: "include",
    }
  )
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      console.log("Sent message");
      return data;
    })
    .catch((err) => {
      console.log("error when sending message", err);
    });
}

async function deleteMessageThreadId({
  currentUserId,
  msgThreadId,
  csrf_token,
}) {
  await fetch(
    `https://www.vinted.fr/api/v2/users/${currentUserId}/msg_threads/${msgThreadId}`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "fr",
        "content-type": "application/json",
        "sec-ch-ua": '"Chromium";v="96", "Opera";v="82", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": `${csrf_token}`,
      },
      referrer: `https://www.vinted.fr/inbox/${msgThreadId}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    }
  )
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      console.log("Deleted conversation");
      return data;
    })
    .catch((err) => {
      console.log("Error when deleting message", err);
    });
}

async function saveToStoragePromise(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}
// -------------------------------------------

async function sendMessageToAllFavers({
  lastNotificationHandled,
  messageContent,
  deleteEachConvo,
}) {
  const allNotifications = await fetchAllNotifications();
  console.log("deleteEachConvo");
  console.log(deleteEachConvo);

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
    senderUserId: extractNotifSenderUserId(notif),
  }));

  const currentUserId = unreadFavNotifications[0].user_id;

  const csrf_token = document.head.querySelector("[name=csrf-token]").content;
  if (csrf_token) {
    let tempLastNotifHandledId;
    await asyncForEach(unreadFavNotifications, async (notif) => {
      const msgThreadId = await getMsgThreadId({
        itemId: notif.subject_id,
        msgRecipientId: notif.senderUserId,
      });

      await sendMessageByQuery({
        currentUserId: currentUserId,
        msgThreadId: msgThreadId,
        csrf_token: csrf_token,
        messageContent: messageContent,
      });

      if (deleteEachConvo) {
        await deleteMessageThreadId({
          currentUserId: currentUserId,
          msgThreadId: msgThreadId,
          csrf_token: csrf_token,
        });
      }

      tempLastNotifHandledId = notif.id;
    });
    await saveToStoragePromise(
      "lastNotificationHandled",
      tempLastNotifHandledId
    );
    return null;
  }
  //   else {
  //   console.log(
  //     "No notifications were found or all notifications have already been handled"
  //   );
  // }
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
