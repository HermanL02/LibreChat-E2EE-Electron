// keyStore.test.tsx
import KeyStore from '../main/components/keystore';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/fake/path'),
  },
}));

describe('KeyStore', () => {
  it('should insert a friend', async () => {
    const newFriend = await KeyStore.insertFriend('Alice', 'key1');
    expect(newFriend).toBeTruthy();
    expect(newFriend.name).toBe('Alice');
  });
});
