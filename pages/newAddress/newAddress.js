// pages/newAddress/newAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDefault:true //是否设置为默认地址
  },

  //switch isdefault status
  handleCheckout(){
    this.setData({
      isDefault:!this.data.isDefault
    });
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

  }
});
