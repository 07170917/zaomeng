const db = wx.cloud.database()
Page({
  data:{
    src:"../../images/add.jpg",
    imagechoose:false,
    ing:false
  },
  addphoto: function(){
    var photo=this;
    wx.chooseImage({
      success: chooseResult => {
        photo.setData({
          src: chooseResult.tempFilePaths[0],
          imagechoose:true
        })
      },
    })
  },
  formSubmit:function(e){
    var that=this.data.src
    if (e.detail.value.title.trim() != "" && e.detail.value.body.trim() != "" && this.data.imagechoose==true){
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var num = String( Math.floor(Math.random() * 100));
      wx.showToast({
        icon: 'none',
        title: '上传中。。。。',
      })
      this.setData({
        ing:true
      })
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'photo/'+timestamp+num+".jpg",
      // 指定要上传的文件的小程序临时文件路径
      filePath: that,
      // 成功回调
      success: res => {
        console.log("上传图片成功")
        db.collection('photo').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id自己增加
            title: e.detail.value.title,
            image: res.fileID,
            body: e.detail.value.body,
          },
          success(res) {
            console.log("上传成功")
            wx.navigateBack({
              url: '../../pages/index/index',
            })
            wx.showToast({
              title: '上传成功'
            })
          }
        })
      }, 
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
    })
    }else{
      wx.showToast({
        title: '请正确填写并选择图片',
        icon: 'none'
      })
    }
  },
})