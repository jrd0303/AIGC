// pages/profile/profile.js
const defaultAvatar = "/images/profile/bear.webp";

Page({
  data: {
    avatarUrl: defaultAvatar,
    userInfo: {
      gender: 1,
      birthday: '1990-01-01',
      bio: '热爱生活，积极向上的心理探索者'
    },
    genders: ['保密', '男', '女'],
    genderIndex: 1
  },

  onChooseAvatar(e) {
    console.log(e)
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  onLoad() {
    const app = getApp();
    
    // 使用全局缓存数据
    if (app.globalData.userInfo) {
      this.setDataFromUserInfo(app.globalData.userInfo);
    }
    
    // 从云数据库获取最新数据
    wx.cloud.callFunction({
      name: 'GetUserInfo',
      success: res => {
        if (res.result.data?.length > 0) {
          const cloudData = res.result.data[0];
          
          // 增加云文件ID处理
          const avatarUrl = cloudData.avatar 
            ? cloudData.avatar.startsWith('cloud://') 
              ? cloudData.avatar 
              : defaultAvatar
            : defaultAvatar;
          
          const userInfo = {
            avatarUrl,  // 使用处理后的头像
            // ...其他字段...
          };
        }
      },
      fail: err => console.error('获取用户信息失败', err)
    });
  },

  setDataFromUserInfo(userInfo) {
    this.setData({
      avatarUrl: userInfo.avatarUrl || defaultAvatar,
      nickname: userInfo.nickname || '',
      'userInfo.birthday': userInfo.birthday,
      'userInfo.bio': userInfo.bio,
      genderIndex: userInfo.gender
    });
  },

  bindGenderChange(e) {
    this.setData({ genderIndex: e.detail.value });
  },
  
  bindDateChange(e) {
    this.setData({ 'userInfo.birthday': e.detail.value });
  },

  formSubmit(e) {
    const formData = e.detail.value;
    const updatedInfo = {
      nickname: formData.nickname,
      gender: this.data.genderIndex,
      birthday: this.data.userInfo.birthday,
      bio: formData.bio
    };
    
    // 头像上传逻辑
    const isStaticResource = this.data.avatarUrl.startsWith('/images/');
    const uploadTask = this.data.avatarUrl.startsWith('http') || 
                      this.data.avatarUrl.startsWith('cloud://') ||
                      isStaticResource // 静态资源不上传
                      ? Promise.resolve(this.data.avatarUrl) 
                      : this.uploadAvatar();
    
    uploadTask.then(cloudPath => {
      wx.cloud.callFunction({
        name: 'saveUserInfo',
        data: {
          ...updatedInfo,
          avatar: isStaticResource ? '' : cloudPath // 静态资源不更新头像
        },
        success: () => {
          wx.showToast({ title: '保存成功', icon: 'success',duration: 1500 });
          const app = getApp();
          app.globalData.userInfo = {
            ...app.globalData.userInfo,
            ...updatedInfo,
            avatarUrl: cloudPath
          };
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        },
        fail: err => {
          console.error('保存失败', err);
          wx.showToast({ title: '保存失败', icon: 'error' });
        }
      });
    }).catch(err => {
      console.error('头像上传失败', err);
      wx.showToast({ title: '头像上传失败', icon: 'error' });
    });
  },

  uploadAvatar() {
    return new Promise((resolve, reject) => {
      // 跳过默认头像和静态资源
      if (this.data.avatarUrl === defaultAvatar || this.data.avatarUrl.startsWith('/images/')) {
        resolve(''); // 返回空字符串，后续不更新头像
        return;
      }
      
      wx.cloud.uploadFile({
        cloudPath: `avatars/${Date.now()}.png`,
        filePath: this.data.avatarUrl,
        success: res => resolve(res.fileID),
        fail: reject
      });
    });
  }
})