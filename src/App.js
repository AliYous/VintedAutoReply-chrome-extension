import "./App.css";

function App() {
  const handleClick = () => {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      msg: "startAutoSend",
    });
  };
  return (
    <div className="App">
      <button onClick={handleClick}>Start</button>
    </div>
  );
}

export default App;
