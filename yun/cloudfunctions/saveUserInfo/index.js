// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  openid=wxContext.OPENID
  return await db.collection("user")
  .doc(openid)
  .set({
    data:{
      nickname:event.nickname,//昵称
      avatar:event.avatar,//头像地址
      sex:event.sex,//性别
      birthday:event.birthday,//生日
      _openid:openid,
      self:event.self//个人简介
    }
  })
}