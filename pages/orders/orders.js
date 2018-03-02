// pages/almirah/almirah.js
const app = getApp();
import getLOrderList from '../../request/getLOrderList.js';
Page({

  data: {
    isVIP:app.globalData.isVIP,
    isConfirm: false, //是否为已完成订单
    hasOrderList: 1, //1.加载中 2.隐藏 3.无订单数据
    lists: []
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      isVIP:app.globalData.isVIP
    });
    //获取订单数据
    getLOrderList(this);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止下拉刷新
    getLOrderList(this);
  },

  // 生命周期函数--监听页面显示
  onShow() {
    wx.setNavigationBarTitle({
      title: '我的订单'
    });
    this.setData({
      isShowChooseGoods: false
    });
  }
});
