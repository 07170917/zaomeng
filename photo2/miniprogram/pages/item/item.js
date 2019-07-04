// miniprogram/pages/item/item.js
const db = wx.cloud.database()
var id
var date = new Date()
var you
var c = require("../../shouquan/shouquan.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    comments: [],
    inputval: "",
    shouquan:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    id = options.id
    this.getitemdata()
    if (c.yishou == true) {
      this.setData({
        shouquan: true
      })
    }
  },
  onShow: function() {
    this.getitemdata()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getitemdata()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  bindKeyInput: function(e) {
    this.setData({
      inputval: e.detail.value
    });
  },
  quanxian:function(e){
    console.log(e.detail.userInfo)
    you = e.detail.userInfo
    this.setData({
      shouquan: true
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        c.openid = res.result.openid
      },
    })
    c.yishou = true
  },
  comments: function() {
    var that = this
    if (that.data.inputval.trim() != "") {
      db.collection('comments').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id自己增加
          who: id,
          comments: that.data.inputval,
          date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes(),
          youname: you.nickName,
          youtou: you.avatarUrl
        },
        success(res) {
          wx.showToast({
            title: '留言成功'
          })
          that.setData({
            inputval: ""
          })
          that.onShow()
        }
      })
    } else {
      wx.showToast({
        title: '不说别按我',
        icon: 'none'
      })
    }
  },
  getitemdata() {
    var that = this
    db.collection('tie').doc(id).get({
      success(res) {
        that.setData({
          data: res.data
        })
        db.collection('comments').where({
            who: id
          })
          .get({
            success(res) {
              console.log(res.data)
              that.setData({
                comments: res.data
              })
            }
          })
      }
    })
  },
  //右上角分享
  onShareAppMessage: function () {
    return {
      title: '转发',
      path: 'pages/item/item?id'+id,
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})