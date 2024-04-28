/* eslint-disable react/jsx-no-constructed-context-values */
// WeChatMessageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Message = {
  content: string;
  createTime: number;
  displayFullContent: string;
  fromUser: string;
  msgId: number;
  msgSequence: number;
  pid: number;
  signature: string;
  toUser: string;
  type: number;
};

interface WeChatMessageContextType {
  messages: Message[];
  listening: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  listenForPublicKey: () => void;
  sendPublicKeyAndStartChat: () => void;
  addMessage: (message: Message) => void;
}

const WeChatMessageContext = createContext<
  WeChatMessageContextType | undefined
>(undefined);

export const useWeChatMessages = () => {
  const context = useContext(WeChatMessageContext);
  if (!context) {
    throw new Error(
      'useWeChatMessages must be used within a WeChatMessageProvider',
    );
  }
  return context;
};

// eslint-disable-next-line react/function-component-definition
export const WeChatMessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.electronAPI.receiveMessage((message: Message) => {
      console.log('Message from main process:', message);
      if (listening) {
        if (message.content.includes('RSA')) {
          if (message.fromUser !== '') {
            navigate('/WeChatOperation/ChatPage', {
              state: { info: message },
            });
            setListening(false);
          }
        }
      }
      // 直接将接收到的消息对象添加到 messages 数组中
      setMessages((prevMessages) => {
        if (
          prevMessages.some(
            (prevMessage) => prevMessage.msgId === message.msgId,
          )
        ) {
          console.warn(`Duplicate message id detected: ${message.msgId}`);
          return prevMessages; // 如果存在，不添加重复的消息
        }
        return [...prevMessages, message]; // 如果不存在，添加新消息
      });
    });
  }, [navigate, listening]);

  const listenForPublicKey = () => {
    setListening(true);
  };

  const sendPublicKeyAndStartChat = () => {
    setListening(false);
  };
  const addMessage = (message: Message) => {
    console.log('adding Message');
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log(messages);
  };
  return (
    <WeChatMessageContext.Provider
      value={{
        messages,
        listening,
        setMessages,
        listenForPublicKey,
        sendPublicKeyAndStartChat,
        addMessage,
      }}
    >
      {children}
    </WeChatMessageContext.Provider>
  );
};
