// pages/almirah/almirah.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  //生命周期函数--监听页面加载
  onLoad(options) {

  },

  //选择衣物进行出售
  handleCheckSell() {
    //此处需要一个借口 返回请求订单中的可出售商品
    wx.showActionSheet({
      itemList: ['西服', '毛绒西服', '羽绒服'],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex);
          wx.navigateTo({
            url:'../sell/sell'
          })
        }
      }
    });
  },


  //生命周期函数--监听页面初次渲染完成
  onReady() {

  },


  // 生命周期函数--监听页面显示
  onShow() {

  }
})
