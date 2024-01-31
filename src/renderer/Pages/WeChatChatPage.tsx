import React from 'react';
import { useLocation } from 'react-router-dom';

type Message = {
  content: string;
  createTime: number;
  displayFullContent: string;
  fromUser: string;
  msgId: number;
  msgSequence: number;
  pid: number;
  signature: string;
  toUser: string;
  type: number;
};

export default function WeChatChatPage() {
  const location = useLocation();
  const info = location.state?.info as Message | undefined;

  if (!info) {
    return <div>No message info available</div>;
  }

  return (
    <div>
      <h1>Chat Page</h1>
      <p>
        <strong>From:</strong> {info.fromUser}
      </p>
      <p>
        <strong>Content:</strong> {info.content}
      </p>
      {/* 根据需要渲染更多信息 */}
    </div>
  );
}
