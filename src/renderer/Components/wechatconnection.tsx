/* eslint-disable jsx-a11y/label-has-associated-control */
// AnotherPage.tsx

import React, { useState } from 'react';

interface WeChatConnectionProps {
  setIsConnected: (isConnected: boolean) => void;
}
export default function WeChatConnection({
  setIsConnected,
}: WeChatConnectionProps) {
  const [modalShow, setModalShow] = useState(false);
  const switchInstructions = () => setModalShow(!modalShow);
  const checkWeChatLogin = async () => {
    const response = await window.electronAPI.checkWechatLogin();
    if (response && response.code === 1) {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Login',
        buttons: ['OK'],
        type: 'info',
        message: 'WeChat Connected! ',
      });
      setIsConnected(true);
    } else {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Login',
        buttons: ['OK'],
        type: 'info',
        message: 'Please Start WeChat with Admin Priviledge! ',
      });
    }
  };
  const installWeChat = async () => {
    await window.electronAPI.installWeChat();
  };
  const putAntiUpgradeIntoDesignatedFolder = async () => {
    const response = await window.electronAPI.antiWeChatUpgrade();
    if (response.result === true) {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Anti-Update',
        buttons: ['OK'],
        type: 'info',
        message:
          'WeChat AntiUpdate Done! The anti-update settings will be applied after you restrat! ',
      });
    } else {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Anti-Update',
        buttons: ['OK'],
        type: 'info',
        message: `WeChat AntiUpdate Failed! ${response.result.error}`,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl mb-4 text-white">
          Before clicking on this button, hook WeChat first.
        </h1>
        <button
          type="button"
          onClick={switchInstructions}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-t-lg mb-4 flex items-center justify-between w-full"
        >
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4h16v16H4z"
              />
            </svg>
            Compulsory Steps Before Hook
          </span>
          <svg
            className="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 9l6 6 6-6"
            />
          </svg>
        </button>

        {modalShow ? (
          <div className="mb-4 text-white">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={installWeChat}
            >
              Install WeChat 3.9.2.23
            </button>
            <div>
              <label className="block text-sm font-bold mb-2">
                <input type="checkbox" className="mr-2" />
                Run WeChat as Administrator and Login
              </label>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">
                <input type="checkbox" className="mr-2" />
                Click Here to Prevent WeChat Update
              </label>
            </div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={putAntiUpgradeIntoDesignatedFolder}
            >
              Add WeChat Anti Update Plugin
            </button>
          </div>
        ) : null}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={checkWeChatLogin}
        >
          Hook WeChat
        </button>
      </div>
    </div>
  );
}
