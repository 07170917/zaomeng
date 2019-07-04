const db = wx.cloud.database()
var openid;
var c = require("../../shouquan/shouquan.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tie: [],
    shouquan: false,
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
      openid=c.openid
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
  quanxian(e) {
    this.setData({
      shouquan: true
    })
    c.yishou = true
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
        c.openid = openid;
      },
    })
  },
  xingxi: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../item/item?id=' + e.currentTarget.dataset.index,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getdata() {
    var _this = this;
    db.collection('tie').where({
      _openid: openid
    }).get({
      success: function (res) {
        // 反转数组
        _this.setData({
          tie: res.data.reverse(),
        })
      }
    })
  },
  delete2(e){
    var that = this
    console.log(e.currentTarget.dataset)
    wx.showModal({
      title: '删除',
      content: '是否确定',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '删除中。。。',
          })
          db.collection('tie').doc(e.currentTarget.dataset.x).remove({
            success: function (res) {
              wx.cloud.callFunction({
                // 云函数名称
                name: 'deletecomments',
                // 传给云函数的参数
                data: {
                  who: e.currentTarget.dataset.x
                },
                success: function (res) {
                  console.log(res.result.sum)
                  that.getdata();
                },
                fail: console.error
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