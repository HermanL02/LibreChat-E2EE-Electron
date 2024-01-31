import React from 'react';
import { WeChatMessageProvider } from '../WeChatMessageContext';
import Navbar from '../Components/navbar';
import WeChatConversationPage from '../Components/wechatconversationpage';

export default function WeChatChatPage() {
  return (
    <WeChatMessageProvider>
      <Navbar />
      <WeChatConversationPage />
    </WeChatMessageProvider>
  );
}
