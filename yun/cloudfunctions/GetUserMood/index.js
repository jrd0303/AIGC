// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const date = new Date()
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const currentDay = `${year}-${month}-${day}`;
    
    // 添加调试日志
    console.log('查询条件:', { openid, date: currentDay });
    
    const result = await db.collection("Diaries")
      .where({
        openid: openid,
        date: currentDay  // ✅ 正确字段名
      })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get()
    
    // 添加结果日志
    console.log('查询结果:', result);
    
    return {
      data: result.data,
      errCode: 0,
      errMsg: 'success'
    }
  } catch (err) {
    console.error('云函数错误:', err)
    return {
      data: [],
      errCode: 1,
      errMsg: '数据库查询失败: ' + err.message
    }
  }
}