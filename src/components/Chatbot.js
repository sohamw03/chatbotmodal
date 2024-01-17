import { useEffect, useRef, useState } from "react";
import chatbot_icon from "../assets/chatbot_icon.svg";
import close_icon from "../assets/close_icon.svg";
import minimize_icon from "../assets/minimize_icon.svg";
import send_icon from "../assets/send_icon.svg";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";
import promptJson from "../prompt.json";
import { useNavigate } from "react-router-dom";
import { login } from "../functions/login";

export default function Chatbot() {
  // Set states
  const [modalOpen, setModalOpen] = useState(false);
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

  // Navigate
  const navigate = useNavigate();

  // Set References
  const chatDisplayRef = useRef(null);

  // Utility functions
  const scrollToBottom = () => {
    // Code to scroll .chat-display to bottom
    setTimeout(() => {
      // document.querySelector("div[chat-display]").scrollTop = document.querySelector("div[chat-display]").scrollHeight;
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
  const postUserMessage = async (text) => {
    setInputAllowed(false);

    try {
      setMsgLoading(true);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/AlchemusAi/Generate/2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ query: text }),
      });

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson || response.status === 500) {
        await renderBotMessage(responseJson);
      }
      setInputAllowed(true);

      setMsgLoading(false);
    } catch (error) {
      console.error(error);
      alert("Server timed out please try again in some time! 🙂");
      setInputAllowed(true);
    }
  };

  // Render chatbot response
  const renderBotMessage = async (responseJson) => {
    updateTime();

    let text = "";
    if (responseJson.choices[0].message.function_call !== undefined) {
      text = responseJson.choices[0].message.function_call.arguments;
    } else {
      text = responseJson.choices[0].message.content;
    }

    setMessages((prevMessages) => [...prevMessages, { text: text, sender: "BOT", time: currentTime }]);

    setTimeout(() => {
      document.querySelector('input[type="text"]').focus();
    }, 50);
  };

  // Toggle modal
  const toggleModal = () => {
    setModalOpen((prevModalOpen) => !prevModalOpen);
    if (!modalOpen) {
      setTimeout(() => {
        document.querySelector('input[type="text"]').focus();
      }, 50);
    }
  };

  // Simulate chatbot response | Testing and development of API connection purposes only
  const simulateChatbotResponse = (message) => {
    updateTime();
    setMsgLoading(true);
    const testdata = {
      id: "chatcmpl-8cSlSa4OpUCuAU6kBvMBaqQtlp6Zz",
      object: "chat.completion",
      created: 1704177726,
      model: "gpt-3.5-turbo-0613",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "",
            function_call: {
              arguments: message,
            },
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 18,
        completion_tokens: 252,
        total_tokens: 270,
      },
      system_fingerprint: null,
    };
    console.log(testdata);
    setTimeout(() => {
      const response = testdata;
      renderBotMessage(response);
      setMsgLoading(false);
    }, 1000);
  };

  // Catches the message sent to the iframe from the parent window
  // useEffect(() => {
  //   const receiveMessage = (event) => {
  //     if (event.origin == "http://127.0.0.1:5500") {
  //       console.log(event.data);
  //       setModalOpen(true);
  //       simulateChatbotResponse(event.data.msg);
  //     }
  //   };

  //   window.addEventListener("message", receiveMessage);
  //   return () => {
  //     window.removeEventListener("message", receiveMessage);
  //   };
  // });

  useEffect(() => {
    login();
  }, []);

  return (
    <>
      {modalOpen ? (
        <section className={styles.main}>
          {/* Status Bar */}
          <div className={styles.statusbar}>
            <span className={styles.statusbar_text}>HR Assistant</span>
            <button className={styles.minimize} onClick={toggleModal}>
              <img src={minimize_icon} alt="Minimize" />
            </button>
            <button className={styles.close_btn} onClick={toggleModal}>
              <img src={close_icon} alt="Minimize" />
            </button>
          </div>
          <div className={styles.chatbot_frame}>
            <div className={styles.chat_section}>
              {/* Chat Section */}
              <div className={styles.chat_display} ref={chatDisplayRef}>
                {Messages.map((message, index) => (
                  <Message key={index} index={index} message={message} messagesLength={Messages.length} IsAnimationRenderedOnce={IsAnimationRenderedOnce} scrollToBottom={scrollToBottom} />
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
                    <img className={styles.send_icon} src={send_icon} alt="Send" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button className={styles.chatbot_btn} onClick={toggleModal}>
          <img src={chatbot_icon} alt="Chatbot" />
        </button>
      )}
    </>
  );
}
