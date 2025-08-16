// pages/testlist/testlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testResults: [], // 初始化为空数组
    isEmpty: false   // 添加空状态标识

  },
  fetchTestRecords() {
    wx.showLoading({ title: '加载中...' });
    
    // 调用云函数
    wx.cloud.callFunction({
      name: 'GetTestRecord',
      success: res => {
        wx.hideLoading();
        const records = res.result.data || [];
        
        this.setData({
          testResults: records,
          isEmpty: records.length === 0  // 设置空状态
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('获取记录失败', err);
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        });
        this.setData({ isEmpty: true }); // 出错时也显示空状态
      }
    });
  },
  ToTestResult:function(e){
    const score=e.currentTarget.dataset.score
    const id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/result/result?score=${score}&id=${id}`
    });
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
    this.fetchTestRecords();
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