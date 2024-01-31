import 'tailwindcss/tailwind.css';
import React from 'react';
import { useWeChatMessages } from '../WeChatMessageContext';

// type Message = {
//   content: string;
//   createTime: number;
//   displayFullContent: string;
//   fromUser: string;
//   msgId: number;
//   msgSequence: number;
//   pid: number;
//   signature: string;
//   toUser: string;
//   type: number;
// };
export default function WeChatHook() {
  const { messages, listening, listenForPublicKey, sendPublicKeyAndStartChat } =
    useWeChatMessages();
  let sharedPortUse = 3000;
  window.electron.ipcRenderer.on(
    'response-shared-port',
    (event, sharedPort: any) => {
      console.log(sharedPort); // 应该输出 3000
      sharedPortUse = sharedPort;
    },
  );
  window.electron.ipcRenderer.sendMessage('request-shared-port');
  const url = `http://localhost:${sharedPortUse}`;
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
      <button onClick={listenForPublicKey} type="button">
        Listen for a temporary encrypt chat
      </button>
      {listening ? <p>Listening to RSA public keys</p> : null}
      <button
        onClick={sendPublicKeyAndStartChat}
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
