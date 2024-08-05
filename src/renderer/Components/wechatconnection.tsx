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
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl mb-4 text-white">
          Before clicking on this button, hook WeChat first.
        </h1>
        <button
          type="button"
          onClick={switchInstructions}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Click for Instructions
        </button>
        {modalShow ? (
          <div className="mb-4 text-white">
            <div>
              <label className="block text-sm font-bold mb-2">
                <input type="checkbox" className="mr-2" />
                Run WeChat as Administrator and Login
              </label>
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={checkWeChatLogin}
        >
          Connect to WeChat
        </button>
      </div>
    </div>
  );
}
