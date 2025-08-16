// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await db.collection("Mood")
      .where({
        _id: event.id
      })
      .get()
    
    return {
      data: result.data,
      errCode: 0,
      errMsg: 'success'
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return {
      data: [],
      errCode: err.errCode || -1,
      errMsg: err.message
    }
  }
}