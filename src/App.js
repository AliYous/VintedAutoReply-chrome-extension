import { useState } from "react";
import "./App.css";

function App() {
  const [messageContent, setMessageContent] = useState("");
  const handleClick = () => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      msg: "startAutoSend",
    });
  };

  const handleChange = (event) => {
    setMessageContent(event.target.value);
  };
  return (
    <div className="App">
      <div className="header">
        <span className="headerText">Vinted Auto Responder</span>
      </div>
      <div className="body">
        <div className="inputContainer">
          <input
            label="Contenu du message"
            onChange={handleChange}
            value={messageContent}
            className="input"
          />
        </div>
        <button className="startSendButton" onClick={handleClick}>
          <span className="buttonText">Start Sending</span>
        </button>
      </div>
    </div>
  );
}

export default App;
