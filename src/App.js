/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messageContent, setMessageContent] = useState("");

  useEffect(
    () =>
      chrome.storage.local.get(
        ["lastNotificationHandled", "messageContent"],
        function (items) {
          setMessageContent(items.messageContent);
        }
      ),
    []
  );

  const handleClick = () => {
    chrome.storage.local.set({ messageContent: messageContent }, () => {
      chrome.runtime.sendMessage({
        msg: "startAutoSend",
      });
    });
  };

  const handleChange = (event) => {
    setMessageContent(event.target.value);
  };
  return (
    <div>
      <input
        label="Contenu du message"
        onChange={handleChange}
        value={messageContent}
        className="input"
      />
      <button
        className="startSendButton"
        onClick={handleClick}
        disabled={!messageContent && messageContent.length < 10}
      >
        <span className="buttonText">Start Sending</span>
      </button>
    </div>
  );
}

export default App;
