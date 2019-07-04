const db = wx.cloud.database()
var you
var date=new Date()
var c=require("../../shouquan/shouquan.js");
Page({
  data:{
    authorized: false
  },
  onLoad:function(){
   if(c.yishou==true){
     this.setData({
       authorized: true
     })
   }
  },
  quanxian:function(e){
    console.log(e.detail.userInfo)
    you=e.detail.userInfo
    this.setData({
      authorized:true
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        c.openid = res.result.openid
      },
    })
    c.yishou=true
  },
  addtie: function (e) {
    console.log(e)
    if (e.detail.value.title.trim() != "" && e.detail.value.content.trim() != "") {
          db.collection('tie').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              // _id自己增加
              title: e.detail.value.title,
              content: e.detail.value.content,
              date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes(),
              posterName: you.nickName,
              posterimage: you.avatarUrl
            },
            success(res) {
              wx.navigateBack({
                url: '../../pages/luntan/luntan',
              })
              wx.showToast({
                title: '发帖成功'
          })
        }
      })
    } else {
      wx.showToast({
        title: '别发空的，没意义',
        icon: 'none'
      })
    }
  },
})