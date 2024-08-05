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
  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [messageToSend, setMessageToSend] = useState('');

  const handleInputChange = (e: any) => {
    setMessageToSend(e.target.value);
  };

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessages]);

  useEffect(() => {
    const filterAndDecryptMessages = async () => {
      console.log(info?.fromUser);
      const filteredMessages = messages.filter(
        (message) =>
          message.fromUser === info?.fromUser ||
          message.toUser === info?.fromUser,
      );
      const decrypted = await Promise.all(
        filteredMessages.map(async (message) => {
          try {
            const decryptedContent = await window.electronAPI.decrypt(
              message.content,
              latestPersonalKey.privateKey,
            );
            return { ...message, content: decryptedContent };
          } catch (error) {
            console.log('Decryption failed', error);
            return { ...message, content: message.content };
          }
        }),
      );
      console.log('decrypted', decryptedMessages);
      setDecryptedMessages(decrypted);
    };

    filterAndDecryptMessages();
  }, [messages, info, latestPersonalKey.privateKey, decryptedMessages]);
  function formatPublicKey(key: string) {
    const PEM_HEADER = '-----BEGIN RSA PUBLIC KEY-----';
    const PEM_FOOTER = '-----END RSA PUBLIC KEY-----';
    const MAX_LINE_LENGTH = 64;

    // Remove any existing white space, PEM header, and footer from the key
    const formattedKey = key
      .replace(PEM_HEADER, '')
      .replace(PEM_FOOTER, '')
      .replace(/\s+/g, '');

    // Insert line breaks every 64 characters
    let result = '';
    for (let i = 0; i < formattedKey.length; i += MAX_LINE_LENGTH) {
      result += `${formattedKey.substring(i, i + MAX_LINE_LENGTH)}\n`;
    }

    return `${PEM_HEADER}\n${result}${PEM_FOOTER}`;
  }
  const handleChangeTextToPubKey = async () => {
    const response = await window.electronAPI.getPersonalKeys();
    console.log('Change Text Field');
    handleInputChange(response);
  };
  const handleSendMessage = async (message: any) => {
    try {
      const latestPublicKey = formatPublicKey(info?.content || '');
      if (latestPublicKey) {
        const encryptedMessage = await window.electronAPI.encrypt(
          message,
          latestPublicKey,
        );

        const response = await window.electronAPI.sendMessage({
          wxid: info?.fromUser,
          msg: encryptedMessage,
        });
        console.log('sending');
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
        console.error('No public key available');
      }
    } catch (error) {
      console.error('Encryption failed', error);
    }
  };

  const handleSubmit = async (e: any) => {
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
          placeholder="Type a message..."
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
