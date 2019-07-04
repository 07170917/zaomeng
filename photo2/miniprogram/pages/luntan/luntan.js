const db = wx.cloud.database()
Page({
  data: {
    tie: [],
    loadingHidden: false,
    background: ['../../images/lbj5.jpg', '../../images/timg.jpg'],
  },
  onPullDownRefresh: function () {
    this.getdata()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShow: function () {
    this.getdata()
  },
  //跳转到详细页
  xingxi:function(e){
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '../item/item?id=' + e.currentTarget.dataset.index,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //获得数据的方法
  getdata() {
    var _this = this;
    db.collection('tie').get({
      success: function (res) {
        // 反转数组
        _this.setData({
          tie: res.data.reverse(),
          loadingHidden: true
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '转发',
      path: 'pages/luntan/luntan',
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})