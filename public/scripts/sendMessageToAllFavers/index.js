/* eslint-disable no-undef */
/* eslint-disable no-undef */
// Sends a message to anyone who faved one of user's products

async function fetchAllNotifications() {
  // returns all notifications that involve favorites
  try {
    const notificationsUrl = `https://www.vinted.fr/api/v2/notifications`;
    const stream = await fetch(notificationsUrl);
    const jsonData = await stream.json();
    const allNotifications = jsonData.notifications;
    // Extract recipient user id from notification.body (regex)
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
  messageContent = "Hey salut tu as fav mon article, tu es intéressé ?",
  csrf_token,
}) {
  fetch(
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
      return data;
    });
}

async function deleteMessageThreadId({
  currentUserId,
  msgThreadId,
  csrf_token,
}) {
  fetch(
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
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    }
  )
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      return data;
    });
}

function getStorageValuePromise(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, resolve());
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
}) {
  console.log(lastNotificationHandled);
  console.log(messageContent);
  let tempLastNotifHandledId = lastNotificationHandled;
  const allNotifications = await fetchAllNotifications();

  let favNotifications = allNotifications.filter((notif) =>
    notif.link.includes("want_it")
  );

  let unreadFavNotifications = favNotifications.filter((notif) => !notif.read);

  if (unreadFavNotifications.length > 0) {
    unreadFavNotifications = unreadFavNotifications.map((notif) => ({
      ...notif,
      senderUserId: extractNotifSenderUserId(notif),
    }));
    const currentUserId = unreadFavNotifications[0].user_id;

    const csrf_token = document.head.querySelector("[name=csrf-token]").content;
    if (csrf_token) {
      await asyncForEach(unreadFavNotifications, async (notif) => {
        const msgThreadId = await getMsgThreadId({
          itemId: notif.subject_id,
          msgRecipientId: notif.senderUserId,
        });

        // await sendMessageByQuery({
        //   currentUserId: currentUserId,
        //   msgThreadId: msgThreadId,
        //   csrf_token: csrf_token,
        // messageContent: messageContent,
        // });

        // await deleteMessageThreadId({
        //   currentUserId: currentUserId,
        //   msgThreadId: msgThreadId,
        //   csrf_token: csrf_token,
        // });

        tempLastNotifHandledId = notif.id;
      });
      await saveToStoragePromise(
        "lastNotificationHandled",
        tempLastNotifHandledId
      );
    }
  } else {
    await saveToStoragePromise("lastNotificationHandled", 454768590);
    console.log(
      "No notifications were found or all notifications have already been handled"
    );
  }
}

chrome.storage.local.get(
  ["lastNotificationHandled", "messageContent"],
  function (items) {
    sendMessageToAllFavers({
      lastNotificationHandled: items.lastNotificationHandled,
      messageContent: items.messageContent,
    });
  }
);
