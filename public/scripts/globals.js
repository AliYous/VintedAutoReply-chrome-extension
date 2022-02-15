// eslint-disable-next-line no-undef
globalThis.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// eslint-disable-next-line no-undef
globalThis.randomTimeout = async function (min, max) {
  let num = Math.random() * (max - min) + min;
  let ms = Math.round(num);
  return new Promise((res) => setTimeout(res, ms));
};

// eslint-disable-next-line no-undef
globalThis.saveToStoragePromise = async function (key, value) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ [key]: value }, resolve);
  });
};

// eslint-disable-next-line no-undef
globalThis.fetchAllNotifications = async function () {
  try {
    const notificationsUrl = `https://www.vinted.fr/api/v2/notifications`;
    const stream = await fetch(notificationsUrl);
    const jsonData = await stream.json();
    const allNotifications = jsonData.notifications;
    return allNotifications;
  } catch (e) {
    console.log(e);
  }
};

// eslint-disable-next-line no-undef
globalThis.extractNotifSenderUserId = function (notification) {
  const { body } = notification;
  const bodyUrl = body.match(/\bhttps?:\/\/\S+/gi)[0];
  const notifSenderId = bodyUrl.replace(/\D/g, ""); // filter recipient id from url
  return parseInt(notifSenderId);
};

// eslint-disable-next-line no-undef
globalThis.getMsgThreadId = async function ({ itemId, msgRecipientId }) {
  const res = await fetch(
    `https://www.vinted.fr/items/${itemId}/want_it/new?offering_id=${msgRecipientId}`
  );
  const inboxUrl = res.url;
  const threadId = inboxUrl.replace(/\D/g, "");
  return threadId;
};

// eslint-disable-next-line no-undef
globalThis.sendMessageByQuery = async function ({
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
};

// eslint-disable-next-line no-undef
globalThis.deleteMessageThreadId = async function ({
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
};
