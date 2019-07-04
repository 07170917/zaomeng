// pages/myphoto/myphoto.js
const db = wx.cloud.database()
var openid;
var c = require("../../shouquan/shouquan.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouquan:false,
    array:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (c.yishou == true) {
      this.setData({
        shouquan: true
      })
      openid = c.openid
      this.getdata()
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  quanxian(e){
  console.log(e.detail)
    this.setData({
      shouquan:true
    })
    c.yishou=true
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        openid = res.result.openid
        this.getdata();
        c.openid=openid
      },
    })
  },
  getdata() {
    var _this = this;
    db.collection('photo').count({
      success: function (res) {
        if (res.total > 20) {
          allshu = res.total - 20
          db.collection('photo').where({
            _openid : openid
          }).skip(allshu).get({
            success: function (res) {
              console.log(res.data)
              // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
              _this.setData({
                array: res.data.reverse(),
              })
            }
          })
        } else {
          db.collection('photo').where({
            _openid : openid
          }).get({
            success: function (res) {
              console.log(res.data)
              // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
              _this.setData({
                array: res.data.reverse(),
              })
            }
          })
        }
      }
    })
  },
  delete1:function(e){
    var that=this
    console.log(e.currentTarget.dataset)
    wx.showModal({
      title: '删除',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除中。。。',
          })
          db.collection('photo').doc(e.currentTarget.dataset.x).remove({
            success: function(res){
              wx.cloud.deleteFile({
                fileList: [e.currentTarget.dataset.xw],
                success: res => {
                  // handle success
                  wx.showToast({
                    title: '删除成功',
                    icon: ""
                  })
                  that.getdata();
                },
                fail: err => {
                  console.error
                }
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})