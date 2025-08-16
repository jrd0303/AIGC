// pages/隐私/隐私.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapters: [
      { id: 'section1', name: '引言' },
      { id: 'section2', name: '我们收集的信息' },
      { id: 'section3', name: '信息的用途' },
      { id: 'section4', name: '信息的共享与披露' },
      { id: 'section5', name: '您的权利' },
      { id: 'section6', name: '未成年人保护' },
      { id: 'section7', name: '政策的更新' },
      { id: 'section8', name: '联系我们' }
    ],
    currentChapter: 'section1', // 默认选中第一章
    currentSectionId: 'section1' // 初始滚动到第一章

  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 跳转到指定章节
  jumpToChapter(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      currentChapter: id,
      currentSectionId: id
    });
    // 延迟执行以确保滚动生效
    setTimeout(() => {
      this.setData({
        currentSectionId: id
      });
    }, 100);
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