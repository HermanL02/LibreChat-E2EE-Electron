import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import path from 'path-browserify';
import { useWeChatMessages } from '../WeChatMessageContext';
import usePersonalKeys from './subComponents/usePersonalKeys';

type Message = {
  content: string;
  createTime: number;
  displayFullContent: string;
  fromUser: string;
  msgId: string;
  msgSequence: number;
  pid: number;
  signature: string;
  toUser: string;
  type: number;
};

export default function WeChatConversationPage() {
  const location = useLocation();
  const info = location.state?.info as Message | undefined;
  const { messages, addMessage } = useWeChatMessages();
  const [decryptedMessages, setDecryptedMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { latestPersonalKey } = usePersonalKeys();
  const [messageToSend, setMessageToSend] = useState('');

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageToSend(e.target.value);
  };

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessages]);
  const lastProcessedMsgIdRef = useRef<number | null>(null);

  useEffect(() => {
    const filterAndDecryptMessages = async () => {
      const newMessages = messages.filter(
        (message) =>
          Number(message.msgId) > (lastProcessedMsgIdRef.current || 0) &&
          (message.fromUser === info?.fromUser ||
            message.toUser === info?.fromUser),
      );

      if (newMessages.length === 0) return;

      const loginInfo = await window.electronAPI.getLoginInfo();
      const decrypted = await Promise.all(
        newMessages.map(async (message) => {
          try {
            if (message?.path) {
              console.log('GMA PRELOAD CALLEd');
              await window.electronAPI.getMsgAttachment(message.msgId);
              return null;
            }
            const decryptedContent = await window.electronAPI.decrypt(
              message.content,
              latestPersonalKey.privateKey,
            );

            return { ...message, content: decryptedContent };
          } catch (error) {
            try {
              const { fileName, encryptedKey } = JSON.parse(message.content);
              console.log(loginInfo);
              console.log(fileName);
              // TODO: wxhelper saving wrong name
              // const fullPath = path.join(
              //   loginInfo.data.currentDataPath,
              //   'wxhelper',
              //   'file',
              //   fileName,
              // );
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 获取月份并补齐两位

              const currentYearMonth = `${year}-${month}`;

              const fullPath = path.join(
                loginInfo.data.currentDataPath,
                'FileStorage',
                'File',
                currentYearMonth,
                fileName,
              );
              const decryptedPhotoBase64 =
                await window.electronAPI.decryptPhoto(
                  fullPath,
                  latestPersonalKey.privateKey,
                  encryptedKey,
                );
              console.log(`got decryptedPhotoPath path`);
              const json = { imgB64: decryptedPhotoBase64 };
              return { ...message, content: JSON.stringify(json) };
            } catch (err) {
              console.log(BigInt(message.msgId).toString());
              console.log(err);
            }
            return { ...message, content: message.content };
          }
        }),
      );

      setDecryptedMessages((prev) => [
        ...prev,
        ...decrypted.filter((msg) => msg !== null),
      ]);

      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage) {
        lastProcessedMsgIdRef.current = Number(lastMessage.msgId);
      }
    };

    filterAndDecryptMessages();
  }, [messages, info, latestPersonalKey.privateKey]);

  const handleChangeTextToPubKey = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    try {
      const loginInfo = await window.electronAPI.getLoginInfo();
      const message = {
        publicKey: latestPersonalKey.publicKey,
        userId: loginInfo.data.signature,
        userName: loginInfo.data.wxid,
      };

      await window.electronAPI.sendMessage({
        wxid: info?.fromUser,
        msg: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error sending public key:', error);
    }
  };
  const handleSendMessage = async (message: string) => {
    try {
      let jsonfiedInfoContent;
      if (info?.content) {
        jsonfiedInfoContent = JSON.parse(info?.content);
      }
      const { publicKey } = jsonfiedInfoContent;
      const latestPublicKey = publicKey;

      if (!latestPublicKey) {
        console.error('No public key available');
      }
      if (message.includes('imagePath')) {
        // Handle Send Image Here
        const jsonFile = JSON.parse(message); // Assuming message is a valid JSON string

        const { encryptedPath, encryptedKey } =
          await window.electronAPI.encryptPhoto(
            jsonFile.imagePath,
            latestPublicKey,
          );

        const response = await window.electronAPI.sendImage({
          wxid: info?.fromUser,
          imagePath: encryptedPath,
          encryptedKey,
        });

        addMessage({
          msgId: response.msgId,
          fromUser: 'me',
          content: message,
          createTime: Date.now(),
          displayFullContent: message,
          msgSequence: Math.random(),
          pid: 1,
          signature: '',
          toUser: info?.fromUser || '',
          type: 1,
        });
      } else {
        // Handle Send Message Here
        const encryptedMessage = await window.electronAPI.encrypt(
          message,
          latestPublicKey,
        );

        const response = await window.electronAPI.sendMessage({
          wxid: info?.fromUser,
          msg: encryptedMessage,
        });
        addMessage({
          msgId: response.msgId,
          fromUser: 'me',
          content: message,
          createTime: Date.now(),
          displayFullContent: message,
          msgSequence: Math.random(),
          pid: 1,
          signature: '',
          toUser: info?.fromUser || '',
          type: 1,
        });
      }
    } catch (error) {
      console.error('Encryption failed', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageToSend.trim()) {
      await handleSendMessage(messageToSend);
      setMessageToSend(''); // Clear the input field after sending
    }
  };

  if (!info) {
    return <div>No message info available</div>;
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Chat Page</h1>
      <div className="bg-gray-700 p-4 rounded-lg shadow-lg overflow-y-auto h-96 mb-4">
        {/* Display messages */}
        {decryptedMessages.map((msg: Message) => {
          const contentObj = (() => {
            try {
              return JSON.parse(msg.content);
            } catch (e) {
              return null;
            }
          })();

          return (
            <div key={msg.msgId} className="border-b border-gray-600 mb-2 pb-2">
              <strong className="text-blue-400">{msg.fromUser}:</strong>{' '}
              {contentObj && contentObj.imgB64 ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img
                  src={contentObj.imgB64}
                  alt="Message Image"
                  className="mt-2 max-w-full rounded"
                />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={messageToSend}
          onChange={handleInputChange}
          placeholder='Use this format to send image:{"imagePath": "C:\\Users\\liang\\Desktop\\Master Presentation Prep.jpg" } '
          className="flex-1 bg-gray-600 rounded-lg p-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </form>
      <form onSubmit={handleChangeTextToPubKey} className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Send My Key
        </button>
      </form>
    </div>
  );
}
