# 微信小程序局域网通信

> 基于 mDNS 协议实现 http 和 socket 通信

Windows 上未找到可用的 mDNS 服务发现工具，Linux 上可使用 [avahi](http://www.avahi.org/)，MacOS 上可使用 [Bonjour](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/NetServices/Introduction.html#//apple_ref/doc/uid/TP40002445-SW1)。

本项目使用 Linux 作为通信终端。
<!-- 文档对应代码地址：https://git.smartahc.com/software/lan-communication-mp -->

## 技术栈

- 服务发现
  - [avahi](http://www.avahi.org/)
- server
  - [express](https://expressjs.com/zh-cn/)
  - [socket.io](https://socket.io/)

- client
  - [小程序 mDNS 系列 API](https://developers.weixin.qq.com/miniprogram/dev/api/network/mdns/wx.stopLocalServiceDiscovery.html)
  - [weapp.socket.io](https://github.com/10cella/weapp.socket.io)

<!-- 除 avahi 外文档都比较清晰，这里只对 avahi 做 -->

## 服务端（Linux）

### 安装 avahi

```sh
sudo apt-get install avahi-utils
```

### 注册服务

```sh
avahi-publish-service -s "yourServiceName" _http._tcp 1111
```

参数分别为：服务名称，服务类型，端口号。

运行后即可在局域网中被发现。


### 运行 server

nodejs，npm 或 yarn 为必备环境，不做赘述。

先进入 server 文件夹

```sh
cd server
```

安装依赖

```sh
# 使用 yarn
yarn

# 或使用 npm
npm i
```

运行脚本

```sh
 node index.js
```

终端打印 ```listening on *:1111``` 即表示运行成功，将持续监听 1111 端口，与注册服务时暴露的端口号一致。

脚本基于 express 和 socket.io 分别提供了 http 和 socket 的通信能力。

## 客户端（小程序）

小程序局域网通信详情可见 [局域网通信](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/mDNS.html)。

### 服务发现

```js
/**
 * 开始搜索局域网下的 mDNS 服务。搜索的结果会通过 wx.onLocalService* 事件返回。
 * @param { object } object.serviceType 必填项 要搜索的服务类型
 */
wx.startLocalServiceDiscovery({
  serviceType: '_http._tcp.'
})

/**
 * 监听 mDNS 服务发现的事件
 * @param {function} callback 发现了服务的回调，参数为单个服务数据
 */
wx.onLocalServiceFound(function callback)
```
<!-- 主要通过小程序提供的 mDNS 系列 api 实现 -->

### 服务数据

onLocalServiceFound 方法回调中的数据如图：

![server data](https://i.loli.net/2019/09/24/lRuMofBXKeWSaDz.png)

根据数据中的 ip 和 port 信息，即可进行 http 和 socket 通信。

<!-- 通过服务中的 ip 与 端口即可建立通信。 -->

## Tips

- 一些 OS 可能不支持 mDNS 服务发现，这时可使用微信开发工具的**真机调试**功能进行调试。
