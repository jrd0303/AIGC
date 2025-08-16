// pages/日历列表/日历列表.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMonth: '',
    currentYear: '',
    currentDay: "",
    days: [],
    currentText: '这天没有记录哦',
    selectedDay: null,
    // 心情与颜色映射
    moodColorMap: {
      '001': '#ffeaf5',   // 红
      '002': '#dccff4',   // 紫
      '003': '#eaefff',   // 蓝
      '004': '#fdf3dd'    // 黄
    },
    // 存储所有日记数据
    allDiaries: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.generateCalendar();
    this.fetchDiaries();
  },
  
  // 自动选中当前日期
  autoSelectCurrentDate() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const currentDay = date.getDate();
    
    // 构建中文格式的日期字符串
    const displayDate = `${currentYear}年${currentMonth + 1}月${currentDay}日`;
    // 构建查找日记的日期字符串
    const searchDate = `${currentYear}-${currentMonth + 1}-${currentDay}`;
    
    // 查找当天的日记
    const diary = this.data.allDiaries[searchDate];
    
    // 更新日历选中状态
    const updatedDays = this.data.days.map(item => {
      return {
        ...item,
        isSelected: item.day === currentDay
      };
    });
    
    this.setData({
      days: updatedDays,
      selectedDay: currentDay,
      currentDay: displayDate,
      currentText: diary ? diary.content : '这天没有记录哦'
    });
  },

  // 从云数据库获取用户日记
  fetchDiaries() {
    const that = this;
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getDiaries',
      success: res => {
        wx.hideLoading();
        console.log('云函数完整响应:', res);
        
        // 检查云函数是否返回错误
        if (res.result.code === -1) {
          console.error('云函数返回错误:', res.result);
          wx.showToast({
            title: `获取失败: ${res.result.error || res.result.message}`,
            icon: 'none',
            duration: 3000
          });
          return;
        }
        
        // 确保数据是数组
        const diaryData = res.result.data || [];
        if (!Array.isArray(diaryData)) {
          console.error('无效的日记数据格式:', diaryData);
          wx.showToast({ 
            title: '数据格式错误', 
            icon: 'none' 
          });
          return;
        }
        
        console.log('获取到日记数据:', diaryData);
        
        // 组织日记数据
        const diariesMap = {};
        diaryData.forEach(diary => {
          if (diary.createTime) {
            const date = new Date(diary.createTime);
            const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            diariesMap[dateStr] = {
              content: diary.content,
              mood: diary.mood
            };
          }
        });
        
        that.setData({
          allDiaries: diariesMap
        }, () => {
          that.updateCalendarColors();
          
          // 在日记数据加载完成后，自动选中当天
          that.autoSelectCurrentDate();
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('调用云函数失败', err);
        wx.showToast({
          title: '网络错误: ' + err.errMsg,
          icon: 'none',
          duration: 3000
        });
      }
    });
  },

  generateCalendar() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    this.setData({
      currentMonth: months[month],
      currentYear: year,
      // 初始化为当天日期
      currentDay: `${year}年${month + 1}月${date.getDate()}日`
    });
    
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    let days = [];
    
    // 填充前置空白
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ valid: false, day: '', color: '', isSelected: false });
    }
    
    // 填充有效日期
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        valid: true,
        day: i,
        color: '', // 初始为空，稍后根据心情设置
        isSelected: false
      });
    }
    
    // 填充后置空白
    const lastDayOfWeek = new Date(year, month, totalDays).getDay();
    for (let i = lastDayOfWeek + 1; i < 7; i++) {
      days.push({ valid: false, day: '', color: '', isSelected: false });
    }
    
    this.setData({ days });
  },
  
  // 更新日历颜色（根据心情）
  updateCalendarColors() {
    const { days, currentYear, allDiaries, moodColorMap } = this.data;
    const month = new Date().getMonth(); // 0-11
    
    const updatedDays = days.map(item => {
      if (item.valid) {
        // 构建日期字符串
        const dateStr = `${currentYear}-${month + 1}-${item.day}`;
        const diary = allDiaries[dateStr];
        // 如果有日记，设置对应心情颜色
        if (diary && moodColorMap[diary.mood]) {
          return {
            ...item,
            color: moodColorMap[diary.mood]
          };
        }
      }
      return item;
    });
    this.setData({ days: updatedDays });
  },

  // 选择日期
  selectDate(e) {
    const day = parseInt(e.currentTarget.dataset.day);
    if (!day) return;
    
    const { days, currentYear, allDiaries } = this.data;
    const month = new Date().getMonth(); // 0-11
    
    // 构建中文格式的日期字符串
    const displayDate = `${currentYear}年${month + 1}月${day}日`;
    // 构建查找日记的日期字符串
    const searchDate = `${currentYear}-${month + 1}-${day}`;
    
    // 查找日记
    const diary = allDiaries[searchDate];
    
    const updatedDays = days.map(item => ({
      ...item,
      isSelected: item.day === day
    }));
    
    this.setData({
      days: updatedDays,
      selectedDay: day,
      currentText: diary ? diary.content : '这天没有记录哦',
      currentDay: displayDate
    });
  },

  ToRecord: function() {
    if (this.data.currentText === '这天没有记录哦') {
      wx.navigateTo({
        url: '/pages/日历记录/日历记录'
      })
    }
  },
/**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.switchTab({
      url: '/pages/日历入口/日历入口'
    })
  },

})