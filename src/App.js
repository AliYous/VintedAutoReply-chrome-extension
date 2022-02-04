/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [messageContent, setMessageContent] = useState("");
  const [deleteEachConvo, setDeleteEachConvo] = useState(true);
  const [sendingMessages, setSendingMessages] = useState(false);

  useEffect(
    () =>
      chrome.storage.local.get(
        ["messageContent", "deleteEachConvo"],
        (items) => {
          setMessageContent(items.messageContent);
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleClick = () => {
    chrome.storage.local.set({ messageContent: messageContent }, () => {
      setSendingMessages(true);
      chrome.runtime.sendMessage({
        msg: "startAutoSend",
      });
    });
  };

  const handleChange = (event) => {
    setMessageContent(event.target.value);
  };

  const handleDeleteConvCheckboxClick = () => {
    chrome.storage.local.set({ deleteEachConvo: !deleteEachConvo }, () => {
      setDeleteEachConvo(!deleteEachConvo);
    });
  };

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    setSendingMessages(false);
  });

  return (
    <div>
      <input
        label="Contenu du message"
        onChange={handleChange}
        value={messageContent}
        className="input"
      />
      <input
        type="checkbox"
        id="deleteEachConvo"
        name="Delete conversations after sending message"
        checked={deleteEachConvo}
        onClick={handleDeleteConvCheckboxClick}
      />
      <button
        className="startSendButton"
        onClick={handleClick}
        disabled={!messageContent && messageContent.length < 10}
      >
        {sendingMessages ? (
          <span className="buttonText">Loading....</span>
        ) : (
          <span className="buttonText">Start Sending</span>
        )}
      </button>
    </div>
  );
}

export default App;
