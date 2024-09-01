import React from 'react';
import { WeChatMessageProvider } from '../WeChatMessageContext';
import WeChatConversationPage from '../Components/wechatconversationpage';

export default function WeChatChatPage() {
  return (
    <WeChatMessageProvider>
      <WeChatConversationPage />
    </WeChatMessageProvider>
  );
}
