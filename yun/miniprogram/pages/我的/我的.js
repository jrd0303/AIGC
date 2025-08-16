// pages/我的/我的.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar_src: "/images/profile/bear.webp", // 默认头像地址
    nickName: "你好，游客", // 默认用户昵称
  },

  // 新增方法：更新用户信息
  updateUserInfo: function(userInfo) {
    this.setData({
      avatar_src: userInfo.avatarUrl || this.data.avatar_src,
      nickName: userInfo.nickname || this.data.nickName,
    });
    
    // 如果需要，可以在这里保存到本地存储
    wx.setStorageSync('userInfo', userInfo);
  },

  onShow: function() {
    // 页面显示时检查全局数据是否有更新
    const app = getApp();
    if (app.globalData.userInfo) {
      this.updateUserInfo(app.globalData.userInfo);
    }
  },

  ToInfo: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    })
  },

  ToDiary:function(){
    console.log("跳转到日记页面")
    wx.navigateTo({
      url:"/pages/日历列表/日历列表"
    })
  },

  ToTest:function(){
    console.log("跳转到评测结果页面")
    wx.navigateTo({
      url:"/pages/testlist/testlist"
    })
  },

  ToPrivacy:function(){
    console.log("跳转到隐私与安全页面")
    wx.navigateTo({
      url:"/pages/隐私/隐私",
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})