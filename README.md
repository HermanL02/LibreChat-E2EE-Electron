# Reference
This project uses [Electron React Boilerplate](https://github.com/electron-react-boilerplate) as the project template. 

# Main Frameworks used
Electron based on React and Node.js
NeDB - For keys local storage

# Mainly used modules 
## [Electron React Boilerplate](https://github.com/electron-react-boilerplate) included modules
- Jest

## IPC Transimission
There is always a discussion about how do we implement the IPC transmission
1. Electron Store NPM package could do
2. Set NodeIntegration as True (which is not recommended for best practices)
3. Put Window.require in the main file
We Plan to use the third method in our project. 

## Exclude above
- Tailwind CSS
- NeDB - For keys local storage
- Electron-store
