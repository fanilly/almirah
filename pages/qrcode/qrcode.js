// pages/qrcode/qrcode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log(app.globalData.commission)
    this.setData({
      userInfo:app.globalData.userInfo,
      url:`${app.globalData.baseUrl}${app.globalData.commission.rqcode}`
    });
  }
});
