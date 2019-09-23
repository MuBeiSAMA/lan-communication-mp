const io = require('../../utils/weapp.socket.io.js')

Page({
  data: {
    serviceList: []
  },
  onLoad() {
    /**
     * 监听 mDNS 服务发现的事件
     */
    wx.onLocalServiceFound(res=>{
      const serviceList = this.data.serviceList
      serviceList.push(res)
      this.setData({
        serviceList
      })
    })
  },
  onShow(){
    /**
     * 开始搜索局域网下的 mDNS 服务，搜索的结果会通过 wx.onLocalService * 事件返回，30s 后自动断开
     */
    wx.startLocalServiceDiscovery({
      serviceType: '_http._tcp.',
      success: res=>{
        this.setData({ serviceList: [] })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  onHide(){
    /**
     * 停止搜索
     */
    wx.stopLocalServiceDiscovery({
      success: res=>{
        this.setData({ serviceList: []})
      }
    })
  },
  /**
   * 连接
   */
  connect(e){
    const idx = e.currentTarget.dataset.idx
    const service = this.data.serviceList[idx]
    console.log(service)
    if (service){
      const { ip, port, serviceName } = service

      /**
       * http 通信
       */
      wx.request({
        url: `http://${ip}:${port}/`,
        data:{name: 'yourName'},
        success: res => {
          console.log(res)
        },
      })

      /**
       * socket 通信 建立连接
       */
      const socket = io(`ws://${ip}:${port}/`)

      // 发送
      socket.emit('test', {msg: 'hello world'})

      // 接收
      socket.on('test',res => {
        console.log(res)
      })
    }
  }
})
