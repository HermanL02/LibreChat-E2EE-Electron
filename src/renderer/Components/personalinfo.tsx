import React, { useState } from 'react';
import usePersonalKeys from './subComponents/usePersonalKeys';

export default function PersonalInfo() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { latestPersonalKey, getPersonalKeys, updatePersonalKeys } =
    usePersonalKeys();
  const [copySuccess, setCopySuccess] = useState('');
  const [copyAllSuccess, setCopyAllSuccess] = useState('');
  const [importedPublicKey, setImportedPublicKey] = useState('');
  const [importedPrivateKey, setImportedPrivateKey] = useState('');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(latestPersonalKey.publicKey);
      setCopySuccess('Key copied to clipboard!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `{"publicKey": ${latestPersonalKey.publicKey},"privateKey": ${latestPersonalKey.privateKey}}`,
      );
      setCopyAllSuccess('Key copied to clipboard!');
    } catch (err) {
      setCopyAllSuccess('Failed to copy!');
    }
  };

  const handleImportKeys = async () => {
    try {
      const response = await window.electronAPI.importPersonalKeys(
        importedPublicKey,
        importedPrivateKey,
      );
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'Import Keys',
        buttons: ['OK'],
        type: 'info',
        message: `${JSON.stringify(response)}`,
      });
    } catch (error) {
      window.electron.ipcRenderer.sendMessage('show-dialog', {
        title: 'Import Keys',
        buttons: ['OK'],
        type: 'info',
        message: `${error}`,
      });
    }
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
      {latestPersonalKey ? (
        <div>
          <button
            type="button"
            className="block w-full text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md py-2 px-4 mb-2 transition duration-150 ease-in-out"
            onClick={copyToClipboard}
          >
            Copy Your Public Key to Clipboard
          </button>
          {copySuccess && (
            <p className="text-sm text-green-500">{copySuccess}</p>
          )}

          <button
            type="button"
            className="block w-full text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md py-2 px-4 mb-2 transition duration-150 ease-in-out"
            onClick={copyAllToClipboard}
          >
            Copy Your Public Key and Private Key to Clipboard
          </button>
          {copyAllSuccess && (
            <p className="text-sm text-green-500">{copyAllSuccess}</p>
          )}

          <button
            type="button"
            className="block w-full text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md py-2 px-4 mb-4 transition duration-150 ease-in-out"
            onClick={updatePersonalKeys}
          >
            Update Your Keys
          </button>
          <div className="text-sm text-gray-600">
            <p>Your current key is:</p>
            <p className="font-mono text-gray-800 bg-gray-100 rounded p-2 mt-2">
              {`${latestPersonalKey.privateKey.substring(100, 105)}`}
            </p>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="block w-full text-left text-sm font-medium text-gray-700 bg-red-50 hover:bg-gray-100 rounded-md py-2 px-4 mb-4 transition duration-150 ease-in-out"
          onClick={updatePersonalKeys}
        >
          Retrieve Your Key Here !
        </button>
      )}

      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter Public Key"
          className="block w-full text-sm text-gray-700 bg-gray-50 rounded-md py-2 px-4 mb-2"
          value={importedPublicKey}
          onChange={(e) => setImportedPublicKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Private Key"
          className="block w-full text-sm text-gray-700 bg-gray-50 rounded-md py-2 px-4 mb-2"
          value={importedPrivateKey}
          onChange={(e) => setImportedPrivateKey(e.target.value)}
        />
        <button
          type="button"
          className="block w-full text-left text-sm font-medium text-gray-700 bg-blue-50 hover:bg-blue-100 rounded-md py-2 px-4 transition duration-150 ease-in-out"
          onClick={handleImportKeys}
        >
          Import Keys
        </button>
      </div>
    </div>
  );
}
