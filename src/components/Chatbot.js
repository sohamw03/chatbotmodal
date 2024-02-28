import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import close_icon from "../assets/close_icon.svg";
import new_chat_icon from "../assets/new_chat_icon.svg";
import send_icon from "../assets/send_icon.svg";
import { useGlobal } from "../context/GlobalContext";
import deleteResumeChatAPI from "../functions/deleteResumeChatAPI";
import deletePolicyChatAPI from "../functions/deletePolicyChatAPI";
import { login } from "../functions/loginAPI";
import policyChatAPI from "../functions/policyChatAPI";
import resumeChatAPI from "../functions/resumeChatAPI";
import generateAPI from "../functions/resumeGenerateAPI";
import { useUtilities } from "../utils/utils";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";

export default function Chatbot() {
  // Global
  const { chatDisplayRef, inputRef, MsgLoading, setMsgLoading, Messages, setMessages, InputAllowed, setInputAllowed, Input, setInput, currentTime, convoId, setConvoId, chatMode, setChatMode } = useGlobal();
  // Utilities
  const { scrollToBottom, focusInput, updateTime, renderMessageOnScreen } = useUtilities();

  // Navigate
  const navigate = useNavigate();

  // Handle user input
  const handleUserInput = (event) => {
    event.preventDefault();
    scrollToBottom();

    const data = {
      conversation_id: convoId,
      prompt: event.target.userMessage.value,
    };
    updateTime();
    if (data.prompt.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, { text: data.prompt, sender: "User", time: currentTime }]);
      postUserMessage(data, chatMode === "policy" ? "policychat" : "resumechat");
    }
    setInput("");
    focusInput();
  };

  // Post user message to the server
  const postUserMessage = async (text, mode = "resumegenerate" | "resumechat" | "policychat") => {
    setInputAllowed(false);

    // Check if the message is in generate mode
    let UseCaseId, data;
    switch (mode) {
      case "resumegenerate":
        console.log(text);
        UseCaseId = text.UseCaseId;
        data = text.data;
        break;
      case "resumechat":
        data = text;
        break;
      case "policychat":
        data = text;
        break;
    }

    // Call the API
    try {
      setMsgLoading(true);

      let responseJson;
      switch (mode) {
        case "resumegenerate":
          responseJson = await generateAPI(data, UseCaseId);
          break;
        case "resumechat":
          responseJson = await resumeChatAPI(data);
          break;
        case "policychat":
          responseJson = await policyChatAPI(data);
          break;
      }

      console.log(responseJson);
      if (responseJson) {
        renderMessageOnScreen(responseJson.output, "BOT");
      }
    } catch (error) {
      console.error(error);
      renderMessageOnScreen(`${error}`, "BOT");
    } finally {
      setInputAllowed(true);
      setMsgLoading(false);
    }
  };

  // New Chat
  const newChat = () => {
    const data = {
      conversation_id: convoId,
    };
    switch (chatMode) {
      case "policy":
        deletePolicyChatAPI(data);
        break;
      case "resume":
        deleteResumeChatAPI(data);
        break;
      default:
        break;
    }

    setMessages([]);
    setInput("");
    focusInput();
  };

  // Catches the message sent to the iframe from the parent window
  useEffect(() => {
    const receiveMessage = (event) => {
      if (event.origin !== "http://localhost:3000" && event.origin !== "http://192.168.168.117:3000" && event.origin !== "http://127.0.0.1:3000") {
        // console.log(event);
        newChat();
        renderMessageOnScreen(event.data, "USER");
        switch (event.data.mode) {
          case "policy":
            setChatMode("policy");
            setConvoId(event.data.conversation_id);
            break;
          case "resume":
            setChatMode("resume");
            postUserMessage(event.data, "resumegenerate");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  useEffect(() => {
    login();
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
                <Message key={index} index={index} message={message} messagesLength={Messages.length} scrollToBottom={scrollToBottom} regenerate={renderMessageOnScreen} />
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
                  ref={inputRef}
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
