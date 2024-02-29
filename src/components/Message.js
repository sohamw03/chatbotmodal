import { motion } from "framer-motion";
import copy_icon from "../assets/copy_icon.svg";
import styles from "./chatbot.module.css";
import { useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";

export default function Message(props) {
  // Chatbot context
  const { scrollToBottom } = props;

  const { chatMode } = useGlobal();

  // New messages can be animated using framer motion
  const isNewMessage = props.index === props.messagesLength - 1;
  const animation = isNewMessage ? { initial: { opacity: 0, transform: "translateY(5px)" }, animate: { opacity: 1, transform: ["translateY(0px)", "translateY(-5px)", "translateY(0px)"] }, transition: { duration: 0.5 } } : {};

  const style_msgType = props.message.sender === "BOT" ? styles.chatbot_message : styles.user_message;

  const copyText = () => {
    navigator.clipboard.writeText(props.message.text);
  };

  const regenerate = () => {
    props.regenerate(props.message.text);
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <motion.div {...animation}>
      <div className={`${style_msgType} ${styles.message}`}>
        <span className={styles.message_text}>{props.message.text}</span>
        {/* <span className={styles.message_time}>{props.message.time}</span> */}
        <div className={styles.actionBtns} style={{ left: props.message.sender === "BOT" ? "0" : "auto", right: props.message.sender === "BOT" ? "auto" : "0" }}>
          <button className={styles.actionBtn} onClick={copyText}>
            <img src={copy_icon} alt="Copy" draggable="false" />
          </button>
          {props.message.sender === "BOT" && chatMode == "resume" ? (
            <button className={styles.actionBtn} onClick={regenerate}>
              <span>Regenerate</span>
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
