// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid=wxContext.OPENID 
  return await db.collection("Testrecord")
  .add({
    data:{
      openid:openid,
      time:event.time,//时间
      timestamp: event.timestamp,//时间戳
      name:event.name,//名称
      testid:event.testid,//测试ID
      score:event.score,//分数
      result:event.result,//结果

    }
  })
}