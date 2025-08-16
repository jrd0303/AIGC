// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { content, mood } = event
  const dateStr = new Date().toISOString().split('T')[0]
  try {
    const res = await db.collection('Diaries').add({
      data: {
        openid: wxContext.OPENID,     // 用户唯一标识
        content: content,              // 日记内容
        mood: mood,                   // 心情
        createTime: db.serverDate(),  // 服务器时间
        updateTime: db.serverDate(),//更新时间
        date:dateStr//日记日期
      }
    })
    return {
      code: 0,
      data: res._id,
      message: '保存成功'
    }
  } catch (err) {
    console.error(err)
    return {
      code: -1,
      message: '保存失败'
    }
  }
}