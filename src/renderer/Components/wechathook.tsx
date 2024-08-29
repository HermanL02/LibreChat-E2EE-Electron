import 'tailwindcss/tailwind.css';
import React, { useState } from 'react';
import WeChatContact from './WeChatContact';
import {
  useWeChatMessages,
  WeChatMessageProvider,
} from '../WeChatMessageContext';

export default function WeChatHook() {
  const { messages, listening, listenForPublicKey } = useWeChatMessages();
  const [isContactListOpen, setContactListOpen] = useState(false);

  window.electron.ipcRenderer.sendMessage('request-shared-port');
  const url = ``;
  const hookWechat = async () => {
    const hooksettings = {
      hookOrUnhook: true,
      port: '3000',
      ip: '127.0.0.1',
      url,
      timeout: '30000',
      enableHttp: false,
    };
    const response = await window.electronAPI.hookWechat(hooksettings);
    if (response) {
      if (response.code === 1) {
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
          message: `Please Unhook First!${response}`,
        });
        console.log(response);
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

  const unhookWechat = async () => {
    const hooksettings = {
      hookOrUnhook: false,
      port: '3000',
      ip: '0.0.0.0',
      url,
      timeout: '3000',
      enableHttp: true,
    };
    const response = await window.electronAPI.hookWechat(hooksettings);
    if (response) {
      if (response.code === 1) {
        window.electron.ipcRenderer.sendMessage('show-dialog', {
          title: 'WeChat Hook',
          buttons: ['OK'],
          type: 'info',
          message: 'WeChat Unhooked!',
        });
      } else {
        window.electron.ipcRenderer.sendMessage('show-dialog', {
          title: 'WeChat Hook',
          buttons: ['OK'],
          type: 'info',
          message: `WeChat is not Hooked!`,
        });
        console.log(response);
      }
    } else {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Hook',
        buttons: ['OK'],
        type: 'info',
        message: 'WeChat Unhook Failed!',
      });
    }
  };
  return (
    <WeChatMessageProvider>
      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-4">
          <button
            type="button"
            className="btn-blue bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
            onClick={hookWechat}
          >
            Hook
          </button>
          <button
            type="button"
            className="btn-red bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
            onClick={unhookWechat}
          >
            Unhook
          </button>
        </div>
        <button
          onClick={() => listenForPublicKey(true)}
          type="button"
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-500 text-white font-bold py-2 px-4 rounded shadow-lg mb-4 transform hover:scale-110 transition duration-300 ease-in-out"
        >
          Listen for a temporary encrypt chat
        </button>
        <div>
          {listening ? (
            <div className="flex items-center">
              <p className="text-gray-300 animate-pulse mr-3">
                Listening to RSA public keys
              </p>
              <div className="space-x-1">
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-blue-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-red-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-green-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-yellow-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-purple-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-pink-400" />
                <div className="inline-block h-8 w-8 animate-pulse rounded-full bg-gray-400" />
              </div>
            </div>
          ) : null}

          <button
            onClick={() => setContactListOpen(!isContactListOpen)}
            value="Start a temporary encrypt chat"
            type="button"
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:scale-110 transition duration-300 ease-in-out mb-6"
          >
            Start a temporary encrypt chat
          </button>

          {isContactListOpen && <WeChatContact />}

          <div className="bg-gray-700 p-4 my-4 h-64 overflow-y-auto shadow-inner rounded">
            {messages.map((message) => (
              <div
                key={message.msgId}
                className="mb-2 p-2 bg-gray-600 text-white rounded shadow-sm"
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WeChatMessageProvider>
  );
}
