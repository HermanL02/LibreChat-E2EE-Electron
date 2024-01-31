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
      console.log('redirecting 1');
      if (listening) {
        if (message.content.includes('RSA')) {
          if (message.fromUser !== '') {
            console.log('redirecting to chat page');
            navigate('/WeChatOperation/ChatPage', {
              state: { info: message },
            });
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

  return (
    <WeChatMessageContext.Provider
      value={{
        messages,
        listening,
        setMessages,
        listenForPublicKey,
        sendPublicKeyAndStartChat,
      }}
    >
      {children}
    </WeChatMessageContext.Provider>
  );
};
