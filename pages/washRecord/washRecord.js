// pages/washRecord/washRecord.js
import getLOrderList from '../../request/getLOrderList.js';
Page({

  data: {

  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    //获取订单数据
    getLOrderList(this,2);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止下拉刷新
    getLOrderList(this,2);
  }

});
