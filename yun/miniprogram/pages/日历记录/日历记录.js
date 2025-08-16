// pages/日历记录/日历记录.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentText: '', // 输入文本
    charCount: 0,       // 当前字数
    maxLength: 500,      // 最大限制（可调整）
    mood:""//心情

  },
  // 输入事件处理
  onInput(e) {
    const value = e.detail.value;
    const count = value.length;
  // 更新数据
    this.setData({
      charCount: count,
      currentText: value // 如果需要存储当前内容
    });
  },
// 这里调用云函数，将currentText（日记内容）和mood(心情)传给云函数（林）
// 云函数这里的实现是通过context获取用户openid，再存入日记的数据库
// 存入的项有openid，mood,currentText,时间（金）
  FinishWrite: function() {
    const that = this;
    const { currentText, mood } = this.data;
    
    if (!currentText.trim()) {
      wx.showToast({
        title: '日记内容不能为空',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中...',
      mask: true
    });

    // 调用云函数保存日记
    wx.cloud.callFunction({
      name: 'SaveDiary', // 云函数名称
      data: {
        content: currentText,
        mood: mood
      },
      success: res => {
        wx.hideLoading();
        console.log('保存成功', res);
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });
        
        // 跳转到日历列表页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/日历列表/日历列表',
          });
        }, 1500);
      },
      fail: err => {
        wx.hideLoading();
        console.error('保存失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("get mood:",options.mood)
// 初始化时触发一次计数
    this.setData({
      charCount: 0,
      mood:options.mood
    });
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