//index.js
const db = wx.cloud.database()
//获取一个又多少数据
var allshu
Page({
  data: {
    array:[],
    loadingHidden: false,
  },
  onPullDownRefresh:function(){
   this.getdata()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShow: function(){
   this.getdata()
  },
  bigimage(e){
    var src = e.currentTarget.dataset.src
    console.log(src)
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/add/add',
    })
  },
  getdata(){
    var _this = this;
    db.collection('photo').count({
      success: function (res) {
        if(res.total>20){
        allshu = res.total - 20
          db.collection('photo').skip(allshu).get({
            success: function (res) {
              console.log(res.data)
              // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
              _this.setData({
                array: res.data.reverse(),
                loadingHidden: true
              })
            }
          })
        }else{
          db.collection('photo').get({
            success: function (res) {
              console.log(res.data)
              // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
              _this.setData({
                array: res.data.reverse(),
                loadingHidden: true
              })
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '转发',
      path: 'pages/index/index',
      success: function (res) {
        console.log('成功', res)
      }
    }
  }
})
