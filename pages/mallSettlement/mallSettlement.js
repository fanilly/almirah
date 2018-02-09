// pages/mallSettlement/mallSettlement.js
const app = getApp();
let leavingMessage = '';
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    lists: [], //订单明细
    textareaValueLen: 0, //当前留言的长度
    receiptAddress: null, //收货地址
    totalPrice: 0 //订单总价
  },

  //提交订单
  handleSubmitOrder() {
    let goodsIds = [];
    console.log(this.data.receiptAddress);
    console.log(this.data.lists);
    this.data.lists.forEach(function(item) {
      goodsIds.push({ goodsId: item.goodsId });
    });
    console.log(JSON.stringify(goodsIds),this.data.receiptAddress.addressId);
    wx.request({
      url: `${app.globalData.api}/clothesBuy/buy`,
      data: {
        userId: app.globalData.userID,
        getAddressId: this.data.receiptAddress.addressId,
        goodsId: JSON.stringify(goodsIds),
        orderRemarks: leavingMessage
      },
      success: res => {
        console.log(res);
      }
    });
  },

  //生命周期函数--监听页面显示
  onShow() {
    //渲染已选择的取衣地址
    if (app.globalData.receiptAddress) {
      this.setData({
        receiptAddress: app.globalData.receiptAddress
      });
    }
  },

  //记录卖家留言
  handleLeavingMessage(e) {
    leavingMessage = e.detail.value;
    this.setData({
      textareaValueLen: leavingMessage.length
    });
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({ title: '加载中' });
    //记录订单明细数据及总价
    let lists = app.globalData.buyGoodsLists,
      totalPrice = 0;
    lists.forEach(item => {
      totalPrice += parseFloat(item.shopprice);
    });
    totalPrice = totalPrice.toFixed(2);
    this.setData({ lists, totalPrice });
    //获取默认地址
    wx.request({
      url: `${app.globalData.api}/address/default_address`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          this.setData({
            receiptAddress: res.data.data
          });
        }
      },
      fial() {
        wx.hideLoading();
      }
    });
  }
});
