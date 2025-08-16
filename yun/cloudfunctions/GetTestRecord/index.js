// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid=wxContext.OPENID
  return await db.collection("Testrecord")
  .where({
    openid:openid
  })
  .orderBy('timestamp', 'desc') //按时间倒序排列
  .limit(10)
  .get()
}