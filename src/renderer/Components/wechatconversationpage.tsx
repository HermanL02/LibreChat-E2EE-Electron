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
  const { messages } = useWeChatMessages();
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { latestPersonalKey } = usePersonalKeys();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const [messageToSend, setMessageToSend] = useState('');

  const handleInputChange = (e) => {
    setMessageToSend(e.target.value);
  };

  useEffect(() => {
    scrollToBottom();
  }, [decryptedMessages]);

  useEffect(() => {
    const filterAndDecryptMessages = async () => {
      const filteredMessages = messages.filter(
        (message) => message.fromUser === info?.fromUser,
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
            return { ...message, content: '[Failed to decrypt]' };
          }
        }),
      );
      setDecryptedMessages(decrypted);
    };

    filterAndDecryptMessages();
  }, [messages, info, latestPersonalKey.privateKey]);
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

  const handleSendMessage = async (message) => {
    try {
      const latestPublicKey = formatPublicKey(info.content);
      console.log(latestPublicKey);
      console.log(latestPersonalKey.publicKey);
      if (latestPublicKey) {
        const encryptedMessage = await window.electronAPI.encrypt(
          message,
          latestPublicKey,
        );

        const response = await window.electronAPI.sendMessage({
          wxid: info.fromUser,
          msg: encryptedMessage,
        });
      } else {
        console.error('No public key available');
      }
    } catch (error) {
      console.error('Encryption failed', error);
    }
  };
  const handleSubmit = async (e) => {
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
    <div>
      <h1>Chat Page</h1>
      <div>
        {/* Display messages */}
        {decryptedMessages.map((msg: Message) => (
          <p key={msg.msgId}>
            <strong>{msg.fromUser}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageToSend}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
