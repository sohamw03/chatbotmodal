import OpenAI from "openai";
import { useRef, useState } from "react";
import chatbot_icon from "../assets/chatbot_icon.svg";
import close_icon from "../assets/close_icon.svg";
import minimize_icon from "../assets/minimize_icon.svg";
import send_icon from "../assets/send_icon.svg";
import Message from "./Message";
import Spinner from "./Spinner";
import styles from "./chatbot.module.css";
import promptJson from "../prompt.json";

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

    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Prompt
    const prompt = `
    ${text}
    Analyse the job and generate a job description for the job and return a JSON object as a result.
    `;

    try {
      setMsgLoading(true);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "assistant",
            content: `${Messages[Messages.length - 1]?.text ? Messages[Messages.length - 1]?.text : ""}`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        functions: [promptJson],
      });

      console.log(response);
      // const responseJson = await response.json();
      if (response) {
        await renderBotMessage(response);
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

    setMessages((prevMessages) => [...prevMessages, { text: responseJson.choices[0].message.function_call.arguments, sender: "BOT", time: currentTime }]);

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
  // const simulateChatbotResponse = (message) => {
  //   updateTime();
  //   setMsgLoading(true);
  //   const testdata = {
  //     id: "chatcmpl-8cSlSa4OpUCuAU6kBvMBaqQtlp6Zz",
  //     object: "chat.completion",
  //     created: 1704177726,
  //     model: "gpt-3.5-turbo-0613",
  //     choices: [
  //       {
  //         index: 0,
  //         message: {
  //           role: "assistant",
  //           content:
  //             "Sure! Imagine you are on a fast-moving train and you have a friend sitting opposite you. You decide to throw a ball to your friend. When you throw the ball, it moves through the air and reaches your friend.\n\nNow, let's imagine that instead of being on a train, you are on a really fast spaceship. You and your friend are still playing catch, but this time, when you throw the ball to your friend, something strange happens. The ball doesn't just move straight to your friend, it actually curves a little bit.\n\nWhy does this happen? It's because when you are moving really fast, things behave differently. Even though it looks like you threw the ball straight, the ball actually curves due to something called \"relativity.\"\n\nRelativity is the idea that the way things move and act can change depending on how fast you are moving compared to something else. So, if you are moving very fast, things around you might behave differently than if you were sitting still.\n\nIn the example with the ball, even though you threw it straight, the spaceship was moving so fast that it affected the path of the ball. This is just one small part of the theory of relativity, which helps scientists understand how the whole universe works.",
  //         },
  //         logprobs: null,
  //         finish_reason: "stop",
  //       },
  //     ],
  //     usage: {
  //       prompt_tokens: 18,
  //       completion_tokens: 252,
  //       total_tokens: 270,
  //     },
  //     system_fingerprint: null,
  //   };
  //   setTimeout(() => {
  //     const response = { response: testdata.choices[0].message.content, sender: "BOT", time: currentTime };
  //     renderBotMessage(response);
  //     setMsgLoading(false);
  //   }, 1000);
  // };

  return (
    <>
      {modalOpen ? (
        <section className={styles.main}>
          {/* Status Bar */}
          <div className={styles.statusbar}>
            <span className={styles.statusbar_text}>Bot</span>
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
