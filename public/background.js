/* eslint-disable eqeqeq */
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

// Check whether new version is installed and sets the necessary localStorage variables
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    console.log("This is a first install!");
    chrome.storage.local.set({ deleteEachConvo: false });
    chrome.storage.local.set({ lastNotificationHandled: null });
    chrome.storage.local.set({ messageContent: "" });
  } else if (details.reason == "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    console.log(
      "Updated from " + details.previousVersion + " to " + thisVersion + "!"
    );
  }
});
