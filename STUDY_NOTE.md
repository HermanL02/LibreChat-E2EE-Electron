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
