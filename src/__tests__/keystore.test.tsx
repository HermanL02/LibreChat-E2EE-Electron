// keyStore.test.tsx
import KeyStore from '../main/components/keystore';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/fake/path'),
  },
}));

describe('KeyStore', () => {
  // eslint-disable-next-line jest/no-done-callback
  it('should insert a friend', (done) => {
    KeyStore.insertFriend(
      'Alice',
      [['key1', new Date()]],
      (err: Error | null, newDoc: any) => {
        expect(err).toBeNull();
        expect(newDoc).toBeTruthy();
        done();
      },
    );
  });
});
