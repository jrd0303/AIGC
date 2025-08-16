// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid=wxContext.OPENID
  const id=event.id
  const score=event.score
  let index=0
  if(score<50){
    index=0
  }
  else if(score<60){
    index=1
  }
  else if(score<70){
    index=2
  }
  else {
    index=3
  }
  const res=await db.collection("test1")
                  .doc(event.id)
                  .field({
                    result: true // 只返回result字段
                  })
                  .get()
    const result=res.data.result[index]
  return {
    score,
    message:result.message,
    color:result.color,
    suggestion:result.suggestion
  }
}