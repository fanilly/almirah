// pages/mallSettlement/mallSettlement.js
const app = getApp();
Page({

  data: {
    baseUrl:app.globalData.baseUrl,
    lists:[]
  },


  //生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      lists:app.globalData.buyGoodsLists
    });
  }
});
