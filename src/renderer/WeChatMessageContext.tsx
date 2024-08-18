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
  listenForPublicKey: (status: boolean) => void;
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
  const [myWXID, setMyWXID] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    window.electronAPI.receiveMessage((message: Message) => {
      console.log('Message from main process:', message);
      if (listening) {
        try {
          const content = JSON.parse(message.content);
          const { publicKey, userName } = content;
          console.log('Username', userName);

          if (publicKey) {
            // In case the message is sent by myself
            if (message.fromUser !== '' && message.fromUser !== myWXID) {
              navigate('/WeChatOperation/ChatPage', {
                state: { info: message },
              });
              setListening(false);
              alert('Haha');
            }
          }
        } catch (error) {
          console.error('Invalid JSON content:', error);
        }
      }
      // Add Messages Direct to the Array
      setMessages((prevMessages) => {
        if (
          prevMessages.some(
            (prevMessage) => prevMessage.msgId === message.msgId,
          )
        ) {
          console.warn(`Duplicate message id detected: ${message.msgId}`);
          return prevMessages; // (If Exist, No Repetative Msg.)
        }
        return [...prevMessages, message]; // If Not Exist, add new msg.
      });
    });
  }, [navigate, listening]);

  const listenForPublicKey = async (status: boolean) => {
    setListening(status);
    const myLoginInfo = await window.electronAPI.getLoginInfo();
    console.log(myLoginInfo);
    const { wxid } = myLoginInfo.data;
    console.log(wxid);
    setMyWXID(wxid);
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

        addMessage,
      }}
    >
      {children}
    </WeChatMessageContext.Provider>
  );
};
