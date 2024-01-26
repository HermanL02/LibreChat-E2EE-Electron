// usePersonalKeys.ts
import { useState, useEffect } from 'react';

const usePersonalKeys = () => {
  const [personalKeys, setPersonalKeys] = useState([]);
  const [latestPersonalKey, setlatestPersonalKey] = useState({
    publicKey: '',
    privateKey: '',
    date: null,
    _id: '',
  });

  const getPersonalKeys = async () => {
    const response = await window.electronAPI.getPersonalKeys();
    setPersonalKeys(response);
    // 将响应按日期时间戳从早到晚排序
    const sortedByDate = response.sort((a: any, b: any) => a.date - b.date);
    // 获取时间戳最晚的元素
    const latestEntry = sortedByDate[sortedByDate.length - 1];
    setlatestPersonalKey(latestEntry);
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
  }, []);

  return {
    personalKeys,
    latestPersonalKey,
    getPersonalKeys,
    updatePersonalKeys,
  };
};

export default usePersonalKeys;
