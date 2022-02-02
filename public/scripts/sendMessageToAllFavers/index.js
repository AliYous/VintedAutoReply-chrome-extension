/* eslint-disable no-undef */
// Sends a message to anyone who faved one of user's products

const fetchAllNotifications = async () => {
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
};

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

const extractNotifSenderUserId = (notification) => {
  const { body } = notification;
  const bodyUrl = body.match(/\bhttps?:\/\/\S+/gi)[0];
  const notifSenderId = bodyUrl.replace(/\D/g, ""); // filter recipient id from url
  return parseInt(notifSenderId);
};

const getMsgThreadId = async ({ itemId, msgRecipientId }) => {
  const res = await fetch(
    `https://www.vinted.fr/items/${itemId}/want_it/new?offering_id=${msgRecipientId}`
  );
  const inboxUrl = res.url;
  const threadId = inboxUrl.replace(/\D/g, "");
  return threadId;
};

const sendMessageByQuery = async ({
  currentUserId,
  msgThreadId,
  messageContent = "Hey salut tu as fav mon article, tu es intéressé ?",
  csrf_token,
}) => {
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
};

const deleteMessageThreadId = async ({
  currentUserId,
  msgThreadId,
  csrf_token,
}) => {
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
};

function getStorageValuePromise(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, resolve());
  });
}

const saveToStoragePromise = async (key, value) => {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
};
// -------------------------------------------

const sendMessageToAllFavers = async () => {
  const allNotifications = await fetchAllNotifications();

  // let lastNotificationHandled = await getStorageValuePromise(
  //   "lastNotificationHandled"
  // );

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
        // });

        // await deleteMessageThreadId({
        //   currentUserId: currentUserId,
        //   msgThreadId: msgThreadId,
        //   csrf_token: csrf_token,
        // });

        await saveToStoragePromise("lastNotificationHandled", notif.id);
      });
    }
  } else {
    console.log(
      "No notifications were found or all notifications have already been handled"
    );
  }
};

sendMessageToAllFavers();
