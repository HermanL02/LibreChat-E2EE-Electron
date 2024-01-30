import React, { useState } from 'react';
import WeChatConnection from '../Components/wechatconnection';
import Navbar from '../Components/navbar';
import WeChatChatInterface from '../Components/wechatchatpage';

export default function WeChatOperation() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <div>
      <Navbar />
      {!isConnected && <WeChatConnection setIsConnected={setIsConnected} />}
      {isConnected && <WeChatChatInterface />}
    </div>
  );
}
