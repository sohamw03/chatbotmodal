import { motion } from "framer-motion";
import copy_icon from "../assets/copy_icon.svg";
import styles from "./chatbot.module.css";
import { useEffect } from "react";

export default function Message(props) {
  // Chatbot context
  const { scrollToBottom } = props;

  // New messages can be animated using framer motion
  const isNewMessage = props.index === props.messagesLength - 1;
  const animation = isNewMessage ? { initial: { opacity: 0, transform: "translateY(5px)" }, animate: { opacity: 1, transform: ["translateY(0px)", "translateY(-5px)", "translateY(0px)"] }, transition: { duration: 0.5 } } : {};

  const style_msgType = props.message.sender === "BOT" ? styles.chatbot_message : styles.user_message;

  const copyText = () => {
    navigator.clipboard.writeText(props.message.text);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <motion.div {...animation}>
      <div className={`${style_msgType} ${styles.message}`}>
        <span className={styles.message_text}>{props.message.text}</span>
        {/* <span className={styles.message_time}>{props.message.time}</span> */}
        <button className={styles.copyBtn} style={{ left: props.message.sender === "BOT" ? "0" : "auto", right: props.message.sender == "BOT" ? "auto" : "0" }} onClick={copyText}>
          <img src={copy_icon} alt="Copy" />
        </button>
      </div>
    </motion.div>
  );
}
