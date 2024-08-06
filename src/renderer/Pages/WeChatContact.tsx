import React, { useState } from 'react';

interface Contact {
  customAccount: string;
  delFlag: number;
  type: number;
  userName: string;
  verifyFlag: number;
  wxid: string;
}

interface ContactResponse {
  code: number;
  data: Contact[];
}

const getContactList = async (): Promise<
  ContactResponse | { error: string }
> => {
  const newContacts = await window.electronAPI.getContact();
  return newContacts;
};

export default function WeChatContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    const result = await getContactList();
    if ('error' in result) {
      setError(result.error);
    } else {
      setContacts(result.data);
      setError(null);
    }
  };
  const handleContactClick = (contact: Contact) => {
    // Handle the click event for the contact
    alert(`Clicked on contact: ${contact.userName}`);
  };
  return (
    <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md">
      <button
        type="button"
        className="block w-full text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md py-2 px-4 mb-4 transition duration-150 ease-in-out"
        onClick={fetchContacts}
      >
        Retrieve Contact List
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {contacts.length > 0 && (
        <ul className="text-sm text-gray-600">
          {contacts.map((contact) => (
            <li key={contact.wxid} className="border-b border-gray-200 py-2">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => handleContactClick(contact)}
              >
                <p className="font-medium">{contact.userName}</p>
                <p className="text-xs text-gray-500">
                  Custom Account: {contact.customAccount}
                </p>
                <p className="text-xs text-gray-500">WXID: {contact.wxid}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
