// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid=wxContext.OPENID
  return await db.collection("user")
    .where({ _openid: openid })
    .get()  // 添加这行以实际获取数据
}