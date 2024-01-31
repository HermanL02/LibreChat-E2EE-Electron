import React, { useState } from 'react';
import WeChatConnection from '../Components/wechatconnection';
import Navbar from '../Components/navbar';
import WeChatHook from '../Components/wechathook';
import { WeChatMessageProvider } from '../WeChatMessageContext';

export default function WeChatOperation() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <div>
      <WeChatMessageProvider>
        <Navbar />
        {!isConnected && <WeChatConnection setIsConnected={setIsConnected} />}
        {isConnected && <WeChatHook />}
      </WeChatMessageProvider>
    </div>
  );
}
