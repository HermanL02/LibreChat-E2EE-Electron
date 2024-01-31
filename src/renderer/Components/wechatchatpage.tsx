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
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    window.electronAPI.receiveMessage((message: Message) => {
      console.log('Message from main process:', message);

      // 直接将接收到的消息对象添加到 messages 数组中
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewMessage(event.target.value);
  };

  const sendMessage = () => {};
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

      <input
        type="text"
        className="input input-bordered input-xs w-full max-w-xs"
        placeholder="Input the Username you want to talk to"
        value={username}
        onChange={handleUsernameChange}
      />

      <div className="bg-gray-100 p-4 my-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={message.msgId} className="mb-2">
            {message.content}
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleNewMessageChange}
        />
        <button type="button" onClick={sendMessage} className="btn ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
