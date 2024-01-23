// keyStore.test.tsx
import KeyStore from '../main/components/keystore';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/fake/path'),
  },
}));

describe('KeyStore', () => {
  it('should insert a friend', async () => {
    const publicKeys: [string, Date][] = [['key1', new Date()]]; // 明确指定类型
    const newFriend = await KeyStore.insertFriend('Alice', publicKeys);
    expect(newFriend).toBeTruthy();
    expect(newFriend.name).toBe('Alice');
    expect(newFriend.publicKeys).toEqual(publicKeys);
  });
});
