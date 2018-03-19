// pages/mallSettlement/mallSettlement.js
const app = getApp();
let leavingMessage = '',
  mallTrolley = [];
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    lists: [], //订单明细
    orderInfo: null, //订单信息
    textareaValueLen: 0, //当前留言的长度
    receiptAddress: null, //收货地址
    totalPrice: 0 //订单总价
  },

  handleGoToDetail(e) {
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${e.currentTarget.dataset.goodsid}&self=1`
    });
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({title:'加载中',mask:true});
    wx.request({
      url: `${app.globalData.api}/clothesBuy/orderInfo`,
      data: {
        orderId: options.orderId
      },
      success: res => {
        wx.hideLoading();
        let lists = res.data.goodsList,
          tempList = [];
        if (options.goodsId) {
          for (let i = 0; i < lists.length; i++) {
            if (options.goodsId == lists[i].goodsId) {
              tempList.push(lists[i]);
              break;
            }
          }
        }
        this.setData({
          lists: tempList,
          orderInfo: res.data.orderInfo
        });
        console.log(res);
      },
      fial() {
        wx.hideLoading();
      }
    });
  }
});
