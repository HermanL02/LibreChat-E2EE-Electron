import React, { useEffect, useState } from 'react';

export default function PersonalInfo() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [personalKeys, setPersonalKeys] = useState([]);
  const [latestKey, setLatestKey] = useState({
    publicKey: '',
    privateKey: '',
    date: null,
    _id: '',
  });
  const getPersonalKeys = async () => {
    const response = await window.electronAPI.getPersonalKeys();
    setPersonalKeys(response);
    console.log(response);
    // 将响应按日期时间戳从早到晚排序
    const sortedByDate = response.sort((a: any, b: any) => a.date - b.date);

    // 获取时间戳最晚的元素
    const latestEntry = sortedByDate[sortedByDate.length - 1];
    setLatestKey(latestEntry);
    console.log(latestEntry);
  };

  const updatePersonalKeys = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await window.electronAPI.updatePersonalKeys();
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: '',
        buttons: ['OK'],
        type: 'info',
        message: 'Updated Personal Key successfully!',
      });
      await getPersonalKeys();
    } catch (error) {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'Failed to Update Personal Key',
        buttons: ['OK', 'Report'],
        type: 'info',
        message: 'Failed to update. It is our problem, not yours.',
      });
    }
  };

  useEffect(() => {
    getPersonalKeys();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div>
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
      >
        Show your encrypt key
      </button>
      <button
        type="button"
        className="p-2 w-full text-left hover:bg-blue-100 rounded-md mb-2 last:mb-0"
        onClick={updatePersonalKeys}
      >
        Update Key
      </button>
      <p>
        Your current key is: {`${latestKey.privateKey.substring(100, 105)}`}
      </p>
    </div>
  );
}
