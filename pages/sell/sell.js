// pages/sell/sell.js
Page({

  data: {
    delIndex:-1, //当前显示删除按钮的图片在files数组中的索引
    files: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

  },

  //长按选择删除图片
  handleShowDelImage(e){
    this.setData({
      delIndex : e.currentTarget.id
    });
  },

  //点击删除按钮下的遮罩层 隐藏删除按钮
  handleHideDelImage(){
    this.setData({
      delIndex:-1
    });
  },

  //点击按钮删除图标
  handleDelImage(){
    let temp = this.data.files;
    temp.splice(this.data.delIndex,1);
    this.setData({
      delIndex:-1,
      files:temp
    });
  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          files: this.data.files.concat(res.tempFilePaths)
        });
        console.log(this.data.files);
        if (this.data.files.length >= 8) {
          let temp = this.data.files;
          temp.splice(8);
          this.setData({
            files: temp
          });
        }
      }
    });
  },

  //预览图片
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    });
  }
});
