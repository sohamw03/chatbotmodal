import { createContext, useContext, useRef, useState } from "react";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  // Set References
  const chatDisplayRef = useRef(null);
  const inputRef = useRef(null);

  // Set states
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

  const values = {
    currentTime,
    setCurrentTime,
    chatDisplayRef,
    inputRef,
    MsgLoading,
    setMsgLoading,
    Messages,
    setMessages,
    InputAllowed,
    setInputAllowed,
    Input,
    setInput,
  };

  return <GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
  return useContext(GlobalContext);
}
