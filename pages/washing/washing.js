// pages/washing/washing.js
import getLOrderList from '../../request/getLOrderList.js';
const app = getApp();
Page({

  data: {
    isVIP: app.globalData.isVIP
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      isVIP: app.globalData.isVIP
    });
    //获取订单数据
    getLOrderList(this, 1);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止下拉刷新
    getLOrderList(this, 1);
  },

  // 生命周期函数--监听页面显示
  onShow() {
    wx.setNavigationBarTitle({
      title: '在洗衣物'
    });
    this.setData({
      isShowChooseGoods: false
    });
  }
});
