const io = require('../../utils/weapp.socket.io.js')

Page({
  data: {
    motto: 'Hello World',
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
    wx.stopLocalServiceDiscovery({
      success: res=>{
        this.setData({ serviceList: []})
      }
    })
  },
  connect(e){
    const idx = e.currentTarget.dataset.idx
    const service = this.data.serviceList[idx]
    console.log(service)
    if (service){
      const { ip, port, serviceName } = service
      wx.request({
        url: `http://${ip}:${port}/`,
        success: (res) => {
          console.log(res)
        },
      })

      const socket = io(`ws://${ip}:${port}/`)
      console.log(socket)
      socket.emit('test',res=>{
        console.log(res)
      })
    }
  }
})
