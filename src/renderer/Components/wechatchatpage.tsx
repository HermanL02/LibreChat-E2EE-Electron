import 'tailwindcss/tailwind.css';
import React, { useEffect, useState } from 'react';

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
export default function WeChatChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    window.electronAPI.receiveMessage((message: Message) => {
      console.log('Message from main process:', message);
      if (listening) {
        if (message.content.includes('RSA')) {
          // redirect to a new page
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
  }, [listening]);
  const ListenForPublicKey = async () => {
    setListening(true);
  };
  const SendPublicKeyAndStartChat = async () => {
    setListening(false);
  };
  let sharedPortUse = 3000;
  window.electron.ipcRenderer.on(
    'response-shared-port',
    (event, sharedPort: any) => {
      console.log(sharedPort); // 应该输出 3000
      sharedPortUse = sharedPort;
    },
  );
  window.electron.ipcRenderer.sendMessage('request-shared-port');
  const globalAny: any = global;
  console.log(globalAny.sharedPort);
  const url = `http://localhost:${sharedPortUse}`;
  console.log(url);
  const hookWechat = async () => {
    const hooksettings = {
      port: '19099',
      ip: '0.0.0.0',
      url,
      timeout: '3000',
      enableHttp: true,
    };
    const response = await window.electronAPI.hookWechat(hooksettings);
    if (response) {
      if (response.code === 0) {
        window.electron.ipcRenderer.sendMessage('show-dialog', {
          title: 'WeChat Hook',
          buttons: ['OK'],
          type: 'info',
          message: 'WeChat Hook successfully!',
        });
      } else {
        window.electron.ipcRenderer.sendMessage('show-dialog', {
          title: 'WeChat Hook',
          buttons: ['OK'],
          type: 'info',
          message: 'Please Unhook First!',
        });
      }
    } else {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Hook',
        buttons: ['OK'],
        type: 'info',
        message: 'WeChat Hook failed! It is our problem, not yours.',
      });
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <button type="button" className="btn-blue" onClick={hookWechat}>
          Hook
        </button>
        <button type="button" className="btn-red">
          Unhook
        </button>
      </div>
      <button onClick={ListenForPublicKey} type="button">
        Listen for a temporary encrypt chat
      </button>
      {listening ? <p>Listening to RSA public keys</p> : null}
      <button
        onClick={SendPublicKeyAndStartChat}
        value="Start a temporary encrypt chat"
        type="button"
      >
        Start a temporary encrypt chat
      </button>
      <div className="bg-gray-100 p-4 my-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={message.msgId} className="mb-2">
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}
