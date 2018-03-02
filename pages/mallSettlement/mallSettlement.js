// pages/mallSettlement/mallSettlement.js
const app = getApp();
let leavingMessage = '',
  mallTrolley = [];
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
    //记录购物车中数据
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        mallTrolley = res.data ? JSON.parse(res.data) : [];
        console.log(mallTrolley);
        console.log(this.data.lists);
        if (!this.data.receiptAddress) {
          wx.showModal({
            content: '请选择收货地址',
            showCancel: false
          });
        } else {
          this.startBuy();
        }
      },
      fail: () => {
        if (!this.data.receiptAddress) {
          wx.showModal({
            content: '请选择收货地址',
            showCancel: false
          });
        } else {
          this.startBuy();
        }
      }
    });


  },

  startBuy() {
    let goodsIds = [];
    wx.showLoading({ title: '提交中' });
    console.log(this.data.receiptAddress);
    console.log(this.data.lists);

    //记录购物车中减去本次购买的商品剩下的商品
    for (let i = 0; i < this.data.lists.length; i++) {
      goodsIds.push({ goodsId: this.data.lists[i].goodsId });
      for (let j = 0; j < mallTrolley.length; j++) {
        if (this.data.lists[i].goodsId == mallTrolley[j].goodsId) {
          mallTrolley.splice(j, 1);
          break;
        }
      }
    }

    console.log(JSON.stringify(goodsIds), this.data.receiptAddress.addressId);
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: `${app.globalData.api}/clothesBuy/buy`,
      data: {
        userId: app.globalData.userID,
        getAddressId: this.data.receiptAddress.addressId,
        goodsId: JSON.stringify(goodsIds),
        orderRemarks: leavingMessage
      },
      success: res => {

        let data = res.data;
        wx.requestPayment({
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          paySign: data.paySign,
          package: data.package,
          signType: 'MD5',
          success: res => {
            console.log(res);

            if (res.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '下单成功',
                icon: 'success',
                duration: 1500
              });

              //删除购物车中数据
              wx.setStorage({
                key: 'mallTrolley',
                data: JSON.stringify(mallTrolley)
              });

              setTimeout(() => {
                //跳转
                wx.redirectTo({
                  url: '../sellRecord/sellRecord'
                });
              }, 800);

            } else {
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }

          },
          fail: res => {
            console.log(res);
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '取消支付',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      },
      fail() {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
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
