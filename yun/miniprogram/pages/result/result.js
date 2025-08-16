Page({
  data: {
    score: 0, // 示例分数（实际应从测试逻辑获取）
    ringColor: "#e0e0e0", // 圆环颜色
    progress: 0, // 进度条角度（0-360）
    resultDescription: '',
    adviceList: "",
  },

  onLoad(options) {
    wx.cloud.callFunction({
      name:"GetResult",
      data:{
        id:options.id,
        score:options.score
      },
      success:(res)=>{
        console.log(res)
        const progress = Math.min(res.result.result_score * 3.6, 360);
        this.setData({
          // ringColor:res.result.color,
          score:res.result.score,
          resultDescription:res.result.message,
          adviceList:res.result.suggestion,
          progress:progress
        })
      },
      fail:function(error){
        console.log(error)
      }
    })
  },

  getRingClass() {
    if (this.data.score >= 80) return 'excellent';
    if (this.data.score >= 60) return 'good';
    return 'poor';
},
  ToTestList:function(){
    console.log("跳转到评测结果列表页面")
    wx.navigateTo({
      url:"/pages/testlist/testlist"
    })
  },
  onUnload() {
    wx.switchTab({
      url: '/pages/首页/首页'
    })
  },
})

