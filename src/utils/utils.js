import { useGlobal } from "../context/GlobalContext";

export const useUtilities = () => {
  const { chatDisplayRef, inputRef, setMessages, currentTime, setCurrentTime, setInput } = useGlobal();

  // Code to scroll .chat-display to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }, 150);
  };

  // Update current time
  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
  };

  // Focus the input field
  const focusInput = () => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 50);
  };

  // Render chatbot response
  const renderMessageOnScreen = (responseJson, sender = "BOT" | "USER") => {
    scrollToBottom();
    updateTime();

    let text = responseJson;
    switch (sender) {
      case "BOT":
        text = responseJson;
        break;
      default:
        text = JSON.stringify(responseJson);
        break;
    }

    setMessages((prevMessages) => [...prevMessages, { text: text, sender: sender, time: currentTime }]);

    setInput("");
    focusInput();
  };

  return {
    scrollToBottom,
    updateTime,
    focusInput,
    renderMessageOnScreen,
  };
};
