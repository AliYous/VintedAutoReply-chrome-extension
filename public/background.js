/* eslint-disable no-undef */
// Globals

chrome.runtime.onMessage.addListener(async function (request) {
  if (request.msg == "startAutoSend") {
    runSendMessageToAllFavers();
  }
});

const runSendMessageToAllFavers = () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    () => {
      chrome.tabs.executeScript({
        file: "scripts/sendMessageToAllFavers/index.js",
      });
    }
  );
};
