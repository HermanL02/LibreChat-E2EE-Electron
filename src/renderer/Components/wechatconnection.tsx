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
        message: 'WeChat Login successfully!',
      });
      setIsConnected(true);
    } else {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'WeChat Login',
        buttons: ['OK'],
        type: 'info',
        message: 'WeChat Login failed!',
      });
    }
  };
  return (
    <div>
      <h1>Before click on this button, Hook WeChat first. </h1>
      <button type="button" onClick={switchInstructions}>
        Click for Instructions
      </button>
      {modalShow ? (
        <div>
          <div>
            <label>
              <input type="checkbox" />
              Open WeChat with Run as Administrator and Login ; Open CMD with
              Run as Administrator
            </label>
            <br />
            <label>
              <input type="checkbox" />
              use CMD to direct to Injector.exe; run the command line below,
              substitute the path of dll file with your own path: Injector.exe
              --process-name WeChat.exe -i D:\wxhelper3982501.dll
            </label>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={checkWeChatLogin}
      >
        Connect to WeChat
      </button>
    </div>
  );
}
