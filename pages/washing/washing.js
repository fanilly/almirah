// pages/washing/washing.js
const app = getApp();
Page({

  data: {
    chooseList: [], //供选择出售的商品列表
    isShowChooseGoods: false, // 是否显示选择商品列表
    hasOrderList: 1, //1.加载中 2.隐藏 3.无订单数据
    lists: []
  },


  // 生命周期函数--监听页面加载

  onLoad(options) {
    wx.request({
      url: `${app.globalData.api}/order/order_list`,
      data: {
        userId: app.globalData.userID,
        orderMark: 1
      },
      success: res => {
        console.log(res)
        if (res.data) {
          this.setData({
            lists: res.data,
            hasOrderList: 2
          });
        } else {
          this.setData({
            hasOrderList: 3
          });
        }
      }
    });
  },

  //阻止冒泡
  handleStopPropagation() {

  },

  // 点击商品跳转出售页面
  handleGoToSell(e) {
    let id = e.currentTarget.id,
      item = this.data.chooseList[id],
      goodsID = item.goodsId,
      ID = item.id;
    console.log(item)
    wx.navigateTo({
      url: `../sell/sell?goodsID=${goodsID}&ID=${ID}`
    });
  },

  //点击出售时改变标题栏标题
  handleCloseChooseGoods() {
    wx.setNavigationBarTitle({
      title: '在洗衣物'
    });
    this.setData({
      isShowChooseGoods: false
    });
  },

  //选择衣物进行出售
  handleCheckSell(e) {
    let id = e.currentTarget.id,
      list = this.data.lists[id].list;
    //改变标题栏
    wx.setNavigationBarTitle({
      title: '选择出售商品'
    });
    //记录选择出售的数据
    this.setData({
      chooseList: list,
      isShowChooseGoods: true
    });
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
