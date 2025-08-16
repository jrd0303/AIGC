// pages/测试/测试.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionnaire: {
      name: "",
      topics: [],
      score:0
    } ,
    currentIndex: 0,      // 当前题目索引
    selectedAnswers: [],   // 存储用户选择
    totalScore: 0,        // 总分
    progress: 0,           // 进度百分比
    description:`
    亲爱的朋友，感谢你此刻的自我觉察。这份量表将帮助你梳理近期的情绪状态，我们称之为'心灵晴雨表'。
    请根据过去一周的真实感受，为每道题选择最贴近的选项。
    答案无对错，你的感受独一无二且被珍视。所有数据仅为你可见，并受严格隐私保护。
    `,
    score_list:[],//分数列表,在最终计算列表中所有数字和
    id:0 ,//测试id
    multiplier: 1 // 添加乘法系数，默认为1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id // 获取传入的ID
    this.fetchQuestionnaire(id)
    this.setData({
      selectedAnswers: new Array(20).fill(-1), // 假设最多20题，-1表示未选择
      id:options.id
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
  },
  fetchQuestionnaire(id) {
    const db = wx.cloud.database();
    db.collection('test1').doc(id).get({
      success: res => {
        const data = res.data;
        const topics = data.topic.map((title, index) => ({
          id: index,
          number: `${index + 1}.`,
          score:title.score,
          title: title.title,
          choices: data.options
        }));
        
        this.setData({
          questionnaire: {
            name: data.name,
            topics: topics
          },
          multiplier: data.multiplier || 1,
          progress: Math.round((1 / topics.length) * 100)
          
        });
      },
      fail: err => {
        console.error('数据库查询失败:', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  // 选择选项
  selectOption(e) {
    const { index: optionIndex } = e.currentTarget.dataset;
    const { currentIndex, selectedAnswers } = this.data;
    // 获取当前分值
    const score=e.currentTarget.dataset.score
    // 将分值放到列表中
    this.data.score_list[currentIndex]=parseInt(score,10)
    // 更新选择
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = optionIndex;
    
    this.setData({
      selectedAnswers: newAnswers
      // all_score:all_score+score
    });
     // 用来输出看结果，之后稳定可以删掉
    console.log(this.data.score_list)
    
    // 自动跳转到下一题（可选）
    // setTimeout(() => this.nextQuestion(), 300);
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentIndex > 0) {
      const newIndex = this.data.currentIndex - 1;
      this.updateProgress(newIndex);
      this.setData({ currentIndex: newIndex });
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, selectedAnswers, questionnaire } = this.data;
    
    // 检查当前题目是否已选择
    if (selectedAnswers[currentIndex] === -1) {
      wx.showToast({ title: '请选择一个选项', icon: 'none' });
      return;
    }
    
    // 检查是否最后一题
    if (currentIndex < questionnaire.topics.length - 1) {
      const newIndex = currentIndex + 1;
      this.updateProgress(newIndex);
      this.setData({ currentIndex: newIndex });
    } else {
      this.calculateScore();
    }
  },

  // 更新进度
  updateProgress(newIndex) {
    const progress = Math.round(((newIndex + 1) / this.data.questionnaire.topics.length) * 100);
    this.setData({ progress });
  },

  // 计算分数
  async calculateScore() {
    let totalScore = 0;
    for (let i = 0; i < this.data.score_list.length; i++) {
      totalScore += this.data.score_list[i];
    }
    totalScore = totalScore * this.data.multiplier;
    this.setData({ totalScore });
    
    // 获取当前时间戳（毫秒级）
    const timestamp = Date.now(); 
    // 准备测试记录数据
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份+1（0-11）并补零
    const day = String(now.getDate()).padStart(2, '0'); // 日期补零
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`; // 格式：2025-08-13
    
    const testRecord = {
      time: formattedDate, // 使用格式化后的日期
      timestamp: timestamp,
      name: this.data.questionnaire.name,
      testid: this.data.id,
      score: totalScore,
    };

    try {
      // 显示加载提示
      wx.showLoading({
        title: '结果分析中...',
        mask: true
      });

      // 调用云函数保存记录
      const res = await wx.cloud.callFunction({
        name: 'SaveTestRecord',
        data: testRecord
      });

      console.log('保存测试记录成功', res);
      
      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?score=${totalScore}&id=${this.data.id}`
      });
      
    } catch (err) {
      console.error('保存测试记录失败', err);
      wx.showToast({
        title: '保存失败，请稍后重试',
        icon: 'none'
      });
    } finally {
      // 隐藏加载提示
      wx.hideLoading();
    }
  }
})