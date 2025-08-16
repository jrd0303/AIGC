Page({
  //页面的初始数据
  data: {
  content:"",
  //聊天机器人信息
  Robot:{
    id:"001",
    name:"聆音",
    avatar:"https://636c-cloud1-6g247k6w9e33102b-1331005316.tcb.qcloud.la/linlin.png?sign=b4ba3b94c413fa0cbb5a9fe73b000b5c&t=1754587849"
  },
  //用户信息
  User:{
    id:"002",
    name:"用户",
    avatar:"https://636c-cloud1-6g247k6w9e33102b-1331005316.tcb.qcloud.la/linlin.png?sign=b4ba3b94c413fa0cbb5a9fe73b000b5c&t=1754587849"
  },
  //聊天信息
  chatList:[
    {
      id:"001",
      name:"聆音",
      avatar:"https://636c-cloud1-6g247k6w9e33102b-1331005316.tcb.qcloud.la/linlin.png?sign=b4ba3b94c413fa0cbb5a9fe73b000b5c&t=1754587849",
      message:'你好，我是聆音，很高兴见到你,我可以帮助你解答心理咨询相关的问题，我也可以陪你说说话~~~',
      type:'text'
    },
    {
      id:"002",
      name:"用户",
      avatar:"https://636c-cloud1-6g247k6w9e33102b-1331005316.tcb.qcloud.la/linlin.png?sign=b4ba3b94c413fa0cbb5a9fe73b000b5c&t=1754587849",
      message:'你好',
      type:'text'
    }
  ]
  },
  //输入监听
  inputClick(e){
  this.setData({
  content:e.detail.value
  })
  },
  //发送监听
  sendClick(){
  var that = this;
  var list = this.data.chatList;
  //获取当前时间
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minu = date.getMinutes();
  var now1 = month < 10 ? '0' + month : month;
  var now2 = day < 10 ? '0' + day : day;
  //组装数据
  //加入用户发送的数据
  var msg={
  id:this.data.User.id,
  name:this.data.User.name,
  avatar:this.data.User.avatar,
  message: this.data.content,
  data: now1 + '-' + now2 + ' ' + hour + ':' + minu,
  type:'text'
  }
  this.setData({
  chatList: list.concat(msg)
  }, () => {
    that.scrollToBottom();
    setTimeout(()=>
    {
      that.get_answer();
    },2000)
  })
  },
  //滑动到最底部
  scrollToBottom(){
  setTimeout(() => {
    wx.pageScrollTo({
      scrollTop: 200000,
      duration: 3
    });
  }, 600)
  },
  //获取机器人回答
  get_answer(){
  var that = this;
  var list = this.data.chatList;
  //获取当前时间
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minu = date.getMinutes();
  var now1 = month < 10 ? '0' + month : month;
  var now2 = day < 10 ? '0' + day : day;
  //组装数据
  //加入机器人回答的数据
  //这里等以后好了，调用接口获取回答
  // wx.request({
  //   url: 'http://127.0.0.1:5000/get_gpt',
  //   method:"POST",
  //   data:{
  //     "content":this.data.content
  //   },
  //   header:{
  //     "content-type":"application/json"
  //   },
  //   success:function(res){
  //     console.log("GPT success",res.data)
  //     var msg={
  //       id:that.data.Robot.id,
  //       name:that.data.Robot.user,
  //       avatar:that.data.Robot.avatar,
  //       message:res.data.result,
  //       date: now1 + '-' + now2 + '' + hour + ':' + minu,
  //       type:'text'
  //     }
  //     that.setData({
  //       chatList: list.concat(msg)
  //     }, () => {
  //         that.scrollToBottom();
  //         that.setData({
  //           content:''
  //         })
  //       })
  //     },
  //     fail:function(res){
  //       console.log("GPT erro")
  //     }
  //     })
  // 目前先设置自动回复
      var msg={
        id:that.data.Robot.id,
        name:that.data.Robot.name,
        avatar:that.data.Robot.avatar,
        message:"好的",
        date: now1 + '-' + now2 + ' ' + hour + ':' + minu,
        type:'text'
      }
      that.setData({
        chatList: list.concat(msg)
      }, () => {
          that.scrollToBottom();
          that.setData({
            content:''
          })
        })
    },
  /*
  生命周期函数--监听页面加载
  */
  onLoad(options) {
  },
  /**
  生命周期函数--监听页面初次渲染完成
  */
  onReady() {
  },
  /**
  生命周期函数--监听页面显示
  */
  onShow() {
  },
  /**
  生命周期函数--监听页面隐藏
  */
  onHide() {
  },
  /**
  生命周期函数--监听页面卸载
  */
  onUnload() {
    
  },
  /**
  页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh() {
  },
  /**
  页面上拉触底事件的处理函数
  */
  onReachBottom() {
  },
  /**
  用户点击右上角分享
  */
  onShareAppMessage() {
  }
  })