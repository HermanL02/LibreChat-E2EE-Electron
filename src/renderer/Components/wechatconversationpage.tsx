import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useWeChatMessages } from '../WeChatMessageContext';
import usePersonalKeys from './subComponents/usePersonalKeys';

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

  useEffect(() => {
    const filterAndDecryptMessages = async () => {
      const filteredMessages = messages.filter(
        (message) =>
          message.fromUser === info?.fromUser ||
          message.toUser === info?.fromUser,
      );
      const decrypted = await Promise.all(
        filteredMessages.map(async (message) => {
          try {
            if (message?.path) {
              return null;
            }
            const decryptedContent = await window.electronAPI.decrypt(
              message.content,
              latestPersonalKey.privateKey,
            );

            return { ...message, content: decryptedContent };
          } catch (error) {
            try {
              const { encryptedPhotoPath, encryptedKey } = JSON.parse(
                message.content,
              );
              const decryptedPhotoPath = await window.electronAPI.decryptPhoto(
                encryptedPhotoPath,
                latestPersonalKey.privateKey,
                encryptedKey,
              );
              const json = { imgPath: decryptedPhotoPath };
              return { ...message, content: JSON.stringify(json) };
            } catch (err) {
              console.log(err);
            }
            return { ...message, content: message.content };
          }
        }),
      );
      setDecryptedMessages(decrypted.filter((msg) => msg !== null));
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
        {decryptedMessages.map((msg: Message) => (
          <p key={msg.msgId} className="border-b border-gray-600 mb-2 pb-2">
            <strong className="text-blue-400">{msg.fromUser}:</strong>{' '}
            {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={messageToSend}
          onChange={handleInputChange}
          placeholder='Use this format to send image: {"imagePath":"<path to image>"} '
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
