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
      console.log(res)
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
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  onHide(){
    wx.stopLocalServiceDiscovery({
      success: res=>{
        console.log(res)
        this.setData({ serviceList: []})
      }
    })
  },
  connect(e){
    console.log(e)
    const idx = e.currentTarget.dataset.idx
    const service = this.data.serviceList[idx]
    console.log(service)
  }
})
