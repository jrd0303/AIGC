// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('=== 开始执行 getDiaries 云函数 ===')
  
  try {
    const wxContext = cloud.getWXContext()
    console.log('用户 openid:', wxContext.OPENID)
    
    const db = cloud.database()
    const _ = db.command
    
    const res = await db.collection('Diaries')
      .where({
        openid: wxContext.OPENID
      })
      .orderBy('date', 'desc')
      .get()
    
    
    if (!res.data) {
      console.warn('未查询到日记数据')
      return {
        code: 0,
        data: [] // 返回空数组而不是 undefined
      }
    }
    
    return {
      code: 0,
      data: res.data
    }
    
  } catch (err) {
    console.error('云函数执行错误:', err)
    return {
      code: -1,
      message: '获取日记失败',
      error: err.message // 返回具体错误信息
    }
  }
}