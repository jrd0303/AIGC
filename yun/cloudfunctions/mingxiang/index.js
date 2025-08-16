// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection("Music")
  // console.log("music_id:",options.id)
  // db.collection("Music")
  // .doc(options.id)
  // .get()
  // .then(res=>{
  //   console.log("get music data:",res.data)
  //   this.setData({
  //     bg_img_src:res.data.image,
  //     name:res.data.name,
  //     message:res.data.message,
  //     music:res.data.music,
  //     all_time:res.data.all_time,
  //   })
  // })
}