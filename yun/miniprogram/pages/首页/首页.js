//pages/index/index.js
//导入app.js
const app = getApp()
//导入fetch函数
const fetch = app.fetch
//连接数据库
const db=wx.cloud.database()

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data:{
    randomText: '',  
    message1:'快去写今日的心情日记吧！',
    moodicon:"https://636c-cloud1-2gdy76jt7b205f78-1372806986.tcb.qcloud.la/%E9%A6%96%E9%A1%B5/%E5%8F%B6%E5%AD%90.png?sign=ff87e73598021049e861ae8943baf15e&t=1754853697"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) { 
    this.getRandomMessage();
    this.getTodayMood(); //获取心情数据
 
},
  async getTodayMood() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      // [新增] 重置为默认值
      this.setData({
        message1: '快去写今日的心情日记吧！',
        moodicon: "https://636c-cloud1-2gdy76jt7b205f78-1372806986.tcb.qcloud.la/%E9%A6%96%E9%A1%B5/%E5%8F%B6%E5%AD%90.png?sign=ff87e73598021049e861ae8943baf15e&t=1754853697"
      });
  
      const res = await wx.cloud.callFunction({ name: 'GetUserMood' });
      
      if (!res.result || res.result.errCode) {
        throw new Error(res.result?.errMsg || '云函数错误');
      }
      
      const diaryList = res.result.data;
      
      // [修改] 当没有日记时直接返回（已设置默认值）
      if (diaryList.length === 0) return; 
  
      const moodId = diaryList[0].mood;
      const resIcon = await wx.cloud.callFunction({
        name: 'Geticon',
        data: { id: moodId }
      });
  
      if (resIcon.result.data?.length > 0) {
        this.setData({
          moodicon: resIcon.result.data[0].icon,
          message1: resIcon.result.data[0].mood
        });
      }
    } catch (err) {
      console.error('获取心情数据失败:', err);
      wx.showToast({ title: '数据加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
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

  },
  ToMusic:function(e){
    var id=e.currentTarget.dataset.id
    console.log(id)
    //转跳事件
    wx.navigateTo({
      url:"/pages/冥想/冥想?id="+id,
    })
  },
  clickMe:function(e){
    //转跳事件
    wx.switchTab({
      url:"/pages/日历入口/日历入口",
    })
  },
  ToTest:function(e){
    var id=e.currentTarget.dataset.id
    console.log(id)
    //转跳事件
    wx.navigateTo({
      url:"/pages/测试/测试?id="+id,
    })
  },
  getRandomMessage() {
    const db = wx.cloud.database(); // 初始化云数据库
    db.collection('Message').count().then(res => {
      const total = res.total;
      // 生成随机索引 (0 到 total-1)
      const randomIndex = Math.floor(Math.random() * total);
      
      db.collection('Message')
        .skip(randomIndex)
        .limit(1)
        .get()
        .then(queryRes => {
          if (queryRes.data.length > 0) {
            this.setData({
              randomText: queryRes.data[0].message
            });
          }
        })
        .catch(err => {
          console.error('获取数据失败', err);
          this.setData({ randomText: '数据加载失败' });
        });
    });
  },
})

