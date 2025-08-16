// pages/冥想/冥想.js
const db=wx.cloud.database()
var audioCTX=wx.createInnerAudioContext()
var timer = require("../../utils/timer.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg_img_src:"",//背景图路径
    name:"", //页面名称
    message:"", //描述
    music:"" , //音乐地址
    all_time:"", //音乐总时长
    time:"00:00:00", //音乐播放时长
    state:0, //播放状态，0表示停止，1表示开始
    play_src:"https://636c-cloud1-2gdy76jt7b205f78-1372806986.tcb.qcloud.la/%E5%86%A5%E6%83%B3/%E6%9A%82%E5%81%9C.png?sign=38f8e95332ff835a9d9a7ac72f3ba8f9&t=1754458130"  //播放图标地址

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      //调用云函数名
      name:"mingxiang",
      //调用成功
      success:function(res){
      console.log(res)
      },
      //调用失败
      fail:function(error){
      console.log(error)
      }
    }),
    console.log("music_id:",options.id)
    db.collection("Music")
    .doc(options.id)
    .get()
    .then(res=>{
      console.log("get music data:",res.data)
      this.setData({
        bg_img_src:res.data.image,
        name:res.data.name,
        message:res.data.message,
        music:res.data.music,
        all_time:res.data.all_time,
      })
    })
  },
  play:function(){
    // 未播放state为0时，播放音乐,更换图标，修改state值为1,更新播放时间
    if (this.data.state===0){
      console.log("music_src",this.data.music)
      audioCTX.src=this.data.music
      audioCTX.onPlay(()=>{
        console.log("开始播放")
      })
      audioCTX.play()
      this.setData({
        state:1,
        play_src:"https://636c-cloud1-2gdy76jt7b205f78-1372806986.tcb.qcloud.la/%E5%86%A5%E6%83%B3/%E6%AD%A3%E5%9C%A8%E6%92%AD%E6%94%BE.png?sign=67a18e0586d187012ecbb536ba84761d&t=1754458154"
      })
      timer.onTimeUpdate(time => {
        this.setData({ time })
      })
      timer.start()
    }
    // 已播放音乐时，暂停音乐，修改state和图标
    else{
      audioCTX.pause()
      this.setData({
        state:0,
        play_src:"https://636c-cloud1-2gdy76jt7b205f78-1372806986.tcb.qcloud.la/%E5%86%A5%E6%83%B3/%E6%9A%82%E5%81%9C.png?sign=38f8e95332ff835a9d9a7ac72f3ba8f9&t=1754458130"
      })
      timer.pause()
    };
  },
  goTohome:function(){
    audioCTX.stop()
    timer.reset()
    this.setData({
      time:"00:00:00",
      state:0,
    })
    wx.switchTab({
      url: '/pages/首页/首页'
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
    audioCTX.stop()
    timer.reset()
    this.setData({
      time:"00:00:00",
      state:0,
    })
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