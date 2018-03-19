// pages/almirah/almirah.js
const app = getApp();
import getLOrderList from '../../request/getLOrderList.js';
Page({

  data: {
    isVIP: app.globalData.isVIP,
    isConfirm: false, //是否为已完成订单
    hasOrderList: 1, //1.加载中 2.隐藏 3.无订单数据
    lists: []
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    //获取订单数据
    getLOrderList(this, false, () => {
      console.log('geted')
      this.setData({
        hasOrderList: 3
      });
    }, (res) => {
      console.log('no')
      this.setData({
        hasOrderList: 2,
        lists: res
      });
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh(); //停止下拉刷新
    // getLOrderList(this);
    this.setData({
      lists: [],
      hasOrderList: 1
    });
    getLOrderList(this, false, () => {
      this.setData({
        hasOrderList: 3
      });
    }, (res) => {
      this.setData({
        hasOrderList: 2,
        lists: res
      });
    });
  },

  // 生命周期函数--监听页面显示
  onShow() {
    wx.setNavigationBarTitle({
      title: '衣橱'
    });
    this.setData({
      isShowChooseGoods: false
    });
    this.setData({
      isVIP: app.globalData.isVIP
    });
    if (!this.data.isVIP) {
      wx.showModal({
        cancelText: '忽略',
        confirmText: '成为会员',
        content: '衣橱功能之后会员可以使用哟~~~',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../register/register'
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: '../index/index'
            });
          }
        }
      });
    }
    if (app.globalData.updateAlmirah) {
      //获取订单数据
      getLOrderList(this, false, () => {
        this.setData({
          hasOrderList: 3,
          lists: res
        });
      }, (res) => {
        this.setData({
          hasOrderList: 2,
          lists: res
        });
      });
      app.globalData.updateAlmirah = false;
    }
  }
});
