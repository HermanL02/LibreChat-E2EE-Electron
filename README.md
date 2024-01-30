# Author
Herman Liang

# Reference
This project uses [Electron React Boilerplate](https://github.com/electron-react-boilerplate) as the project template. 

# Structure
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
- axios - Used to access api
- express - Used to access 



# 构思
1. Normal Contacts
本地存储，本地加解密
2. Cloud Contacts
上传自己的wxid与union ID绑定，确保用户不会恶意重复注册，防止数据库爆炸
可以设置每次登录自动同步本机的personal public key，其他用户可通过wxid搜索到对应人的公钥，从而给他发加密消息
3. WeChat Connection Alpha
通过WeChat，与其他使用相同应用的好友, 直接发加密消息，接收加密消息，自动无感加解密
(自动搜索云端来实时通过wxid更新对方的public key? 或者手动更新? )

