# TypeScript Format

# JEST
## Fake some data path in the tests
jest.mock('electron', () => ({
  app: {
    getPath: jest.fn().mockReturnValue('/fake/path'),
  },
}));

# NPM
npm install --save : Save is used to save it to package.json to both dev and build

# Node.JS
## Callback
Callback is an old fashioned asynchronous function. 

## Promise
Promise is the new one, but it generally only works with Node.js. 
### Await/Async
Special one only works with MongoDB and newer dbs. 

# IPC communication
[handle/invoke uses promises so we can async/await. On/send is to set timeouts. -- Edwin Beltran Apr 13, 2020 at 13:51](https://stackoverflow.com/questions/59889729/what-is-the-difference-between-ipc-send-on-and-invoke-handle-in-electron)
1. Electron Store NPM package could do
2. Set NodeIntegration as True (which is not recommended for best practices)
3. Put Window.require in the main file 
## preload.ts
I don't know why the template maker put the preload in the main/preload.ts, which is not a good practice, because it belongs to the renderer part. 
## IPC in TypeScript Clue
[Start from the electron react boilerplate here](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/3016)
BigOldWei provided information. 
## renderer.d.ts
From the doc below: We have to add one more file renderer.d.ts to loadhttps://www.electronjs.org/docs/latest/tutorial/context-isolation#usage-with-typescript
## IPC handler? Where to put? 
[It does not need to be included in the createWindow() function scope. That is just the way the person wrote it in the Doc’s.](https://stackoverflow.com/questions/71266876/is-there-a-reason-they-put-the-ipcmain-on-event-listener-inside-the-createwind)
