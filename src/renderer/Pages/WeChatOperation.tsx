import React, { useState } from 'react';
import WeChatConnection from '../Components/wechatconnection';
import WeChatHook from '../Components/wechathook';
import { WeChatMessageProvider } from '../WeChatMessageContext';

export default function WeChatOperation() {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <div>
      <WeChatMessageProvider>
        {!isConnected && <WeChatConnection setIsConnected={setIsConnected} />}
        {isConnected && <WeChatHook />}
      </WeChatMessageProvider>
    </div>
  );
}
