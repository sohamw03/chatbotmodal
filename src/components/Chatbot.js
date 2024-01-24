import { useEffect, useRef, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import { login } from "../functions/login";
import close_icon from "../assets/close_icon.svg";
import new_chat_icon from "../assets/new_chat_icon.svg";
import send_icon from "../assets/send_icon.svg";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";

export default function Chatbot() {
  // Set states
  const [IsAnimationRenderedOnce, setIsAnimationRenderedOnce] = useState(false);
  const [MsgLoading, setMsgLoading] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [InputAllowed, setInputAllowed] = useState(true);
  const [Input, setInput] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );
  const [loginToken, setLoginToken] = useState("");

  // Navigate
  const navigate = useNavigate();

  // Set References
  const chatDisplayRef = useRef(null);

  // Utility functions
  const scrollToBottom = () => {
    // Code to scroll .chat-display to bottom
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

  // Handle user input
  const handleUserInput = (event) => {
    event.preventDefault();
    scrollToBottom();

    setIsAnimationRenderedOnce(false);
    const text = Input;
    updateTime();
    if (text.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: text, sender: "User", time: currentTime }]);

      // ENSURE THIS IS ON FOR PRODUCTION ↓
      setTimeout(() => {
        postUserMessage(text);
      }, 1000);
      // simulateChatbotResponse(text);
    }
    setInput("");
    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // Post user message to the server
  const postUserMessage = async (text, isJson = false) => {
    setInputAllowed(false);

    // If the message is a JSON object, extract the UseCaseId and data
    let UseCaseId, data;
    if (isJson) {
      console.log(text);
      text = JSON.parse(text);
      console.log(typeof text);
      UseCaseId = text.UseCaseId;
      // Convert comma separated string to object
      data = text.data;
    } else {
      data = text;
    }

    // Call the API
    try {
      setMsgLoading(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/AlchemusAi/Generate/${UseCaseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson) {
        await renderBotMessage(responseJson);
      }
      setInputAllowed(true);

      setMsgLoading(false);
    } catch (error) {
      console.error(error);
      await renderBotMessage(`${error}`);
      setInputAllowed(true);
      setMsgLoading(false);
    }
  };

  // Render chatbot response
  const renderBotMessage = async (responseJson) => {
    updateTime();

    let text = JSON.stringify(responseJson);

    setMessages((prevMessages) => [...prevMessages, { text: text, sender: "BOT", time: currentTime }]);

    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // Regenerate
  const regenerate = async (text, isJson = false) => {
    scrollToBottom();

    setIsAnimationRenderedOnce(false);
    if (isJson) {
      text = JSON.stringify(text);
      setMessages((prevMessages) => [...prevMessages, { text: text, sender: "User", time: currentTime }]);
      postUserMessage(text, true);
    } else if (text.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: text, sender: "User", time: currentTime }]);
      postUserMessage(text);
    }
    setInput("");
    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // New Chat
  const newChat = () => {
    setMessages([]);
    setInput("");
    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // Catches the message sent to the iframe from the parent window
  useEffect(() => {
    const saveLoginToken = async () => {
      setLoginToken(await login());
    };
    saveLoginToken();

    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:3000" && event.origin !== "http://192.168.168.117:3000") {
        // console.log(event);
        newChat();
        regenerate(event.data, true);
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  return (
    <>
      <section className={styles.main}>
        {/* Status Bar */}
        <div className={styles.statusbar}>
          <span className={styles.statusbar_text}>HR Assistant</span>
          <button className={styles.newChat} onClick={newChat}>
            <img src={new_chat_icon} alt="NewChat" draggable="false" />
          </button>
          <button className={styles.close_btn}>
            <img src={close_icon} alt="Minimize" draggable="false" />
          </button>
        </div>
        <div className={styles.chatbot_frame}>
          <div className={styles.chat_section}>
            {/* Chat Section */}
            <div className={styles.chat_display} ref={chatDisplayRef}>
              {Messages.map((message, index) => (
                <Message key={index} index={index} message={message} messagesLength={Messages.length} IsAnimationRenderedOnce={IsAnimationRenderedOnce} scrollToBottom={scrollToBottom} regenerate={regenerate} />
              ))}
              {MsgLoading && <Spinner scrollToBottom={scrollToBottom} />}
            </div>

            {/* Input Section */}
            <div className={styles.input_section}>
              <form className={styles.user_input} onSubmit={handleUserInput} autoComplete="off" noValidate>
                <input
                  type="text"
                  name="userMessage"
                  placeholder="Ask a question"
                  value={Input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                  required
                  autoComplete="off"
                />
                <button type="submit" disabled={!InputAllowed}>
                  <img className={styles.send_icon} src={send_icon} alt="Send" draggable="false" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
