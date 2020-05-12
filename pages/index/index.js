// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    scrollTop:0,
    message:null
  },
  id:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.connectSocket({
      // 本地服务器地址
      url: 'ws://localhost:3000',
    })
    // 连接成功
    wx.onSocketOpen(function() {
      console.log('连接成功');
    })
    wx.onSocketMessage(res => {
      var data = JSON.parse(res.data)
      data.id = this.id++
      data.role = 'server'
      var list = this.data.list
      list.push(data)
      this.setData({
        list:list
      })
      this.rollingBottom()
    })
  },
  // 页面卸载，关闭连接
  onUnload() {
    wx.onSocketClose();
    wx.showToast({
      title: '连接已断开~',
      icon: 'none',
      duration: 2000
    })
  },
  //获取输入框文本内容
  bindChange:function(e){
    this.data.message = e.detail.value
  },
  send:function(e){
    var msg = this.data.message
    if (msg){
      wx.sendSocketMessage({
        data: msg,
      })
      var tempList = this.data.list
      var temMsg ={
        role: 'me',
        id:++this.id,
        content:msg
      }
      tempList.push(temMsg)
      this.setData({
        list:tempList,
        message:null
      })
    } else {
      wx.showToast({
        title: '消息内容不能为空',
        icon:'none'
      })
    }
  },
  //使聊天消息显示在最底端
  rollingBottom:function(){
    var listNode = wx.createSelectorQuery().selectAll('.list')
    listNode.boundingClientRect(rects =>{
      rects.forEach(rect => {  
        console.log(rect)   
      this.setData({
        scrollTop:rect.bottom 
      })
      })
    }).exec()
  }
})