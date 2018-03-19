// pages/laundrySettlement/laundrySettlement.js
import { formatDate } from '../../utils/util.js';
const app = getApp();
Page({

  data: {
    showConfirm: false,
    countGoodsLength: 0,
    commission: null,
    couponChecked: false, //是否使用代金券
    isVIP: false,
    loaded: false, //是否加载完成
    prefetchingTime: '', //选择的预取时间
    startTime: '', //预取时间 开始
    remarks: '', //记录备注信息
    totalPrice: 0, //总价
    remarksLen: 0, //备注长度
    trolleys: [], //购物车数据
    takeAddress: null, // 取货地址
    giveAddress: null //送货地址
  },

  onShow() {
    //渲染已选择的送衣地址
    if (app.globalData.giveAddress) {
      this.setData({
        giveAddress: app.globalData.giveAddress
      });
    }

    //渲染已选择的取衣地址
    if (app.globalData.takeAddress) {
      this.setData({
        takeAddress: app.globalData.takeAddress
      });
    }
  },

  getTakeAddressAndGiveAddress(defaultAddress) {
    //从storage中取衣地址及送衣地址
    wx.getStorage({
      key: 'takeAddress',
      success: res => {
        this.setData({
          takeAddress: JSON.parse(res.data),
          loaded: true
        });
      },
      fail: err => {
        if (defaultAddress) {
          this.setData({
            takeAddress: defaultAddress,
            loaded: true
          });
        } else {
          this.setData({
            loaded: true
          });
        }
      }
    });
    wx.getStorage({
      key: 'giveAddress',
      success: res => {
        this.setData({
          giveAddress: JSON.parse(res.data),
          loaded: true
        });
      },
      fail: err => {
        if (defaultAddress) {
          this.setData({
            giveAddress: defaultAddress,
            loaded: true
          });
        } else {
          this.setData({
            loaded: true
          });
        }
      }
    });
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    let twoDaysLater = new Date().getTime() + 50 * 24 * 60 * 60 * 1000;
    this.setData({
      startTime: formatDate(new Date()),
      isVIP: app.globalData.isVIP,
      endTime: formatDate(new Date(twoDaysLater)),
      commission: app.globalData.commission
    });



    // 从购物车中获取商品渲染
    wx.getStorage({
      key: 'laundryTrolley',
      success: res => {
        let i, totalPrice = 0,
          trolley = JSON.parse(res.data) || [],
          countGoodsLength = 0;
        console.log(trolley);
        for (i = 0; i < trolley.length; i++) {
          countGoodsLength += parseInt(trolley[i].total);
          totalPrice += parseInt(trolley[i].total) * parseFloat(trolley[i].price);
        }
        this.setData({
          trolleys: trolley,
          totalPrice: totalPrice,
          countGoodsLength
        });
      }
    });

    //获取默认地址
    wx.request({
      url: `${app.globalData.api}/address/default_address`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        if (res.data.status == 1) {
          this.getTakeAddressAndGiveAddress(res.data.data);
        } else {
          this.getTakeAddressAndGiveAddress();
        }
      },
      fail: err => {
        this.getTakeAddressAndGiveAddress();
      }
    });
  },

  // 切换是否使用代金券
  handleCheckout() {
    this.setData({
      couponChecked: !this.data.couponChecked
    });
  },

  onUnload() {
    console.log(123);
  },

  // 日期选择
  handleDateChange(e) {
    this.setData({
      prefetchingTime: e.detail.value
    });
  },

  //备注
  bindTextAreaBlur(e) {
    this.setData({
      remarks: e.detail.value,
      remarksLen: e.detail.value.length
    });
  },

  //购买
  handleBuy() {
    if (!this.data.takeAddress) {
      console.log(123);
      wx.showModal({
        content: '请选择取衣地址',
        showCancel: false
      });
    } else if (!this.data.giveAddress) {
      if (app.globalData.isVIP) {
        wx.showModal({
          content: '请选择送衣地址',
          showCancel: false
        });
      } else {
        if (!this.data.prefetchingTime) {
          wx.showModal({
            content: '请选择预取时间',
            showCancel: false
          });
        } else {
          this.startBuy();
        }
      }
    } else if (!this.data.prefetchingTime) {
      wx.showModal({
        content: '请选择预取时间',
        showCancel: false
      });
    } else {
      this.startBuy();
    }
  },

  startBuy() {
    wx.showLoading({ title: '提交中' });
    console.log(this.data);
    let i,
      goods = [],
      trolleys = this.data.trolleys;
    for (i = 0; i < trolleys.length; i++) {
      goods.push({
        "goodsId": trolleys[i].catId,
        "goodsNum": trolleys[i].total
      });
    }
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}/buy/buy`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userID,
        useCoupons: this.data.couponChecked ? 1 : 0,
        orderScore: 1,
        goods: JSON.stringify(goods),
        userAddressId: this.data.takeAddress.addressId,
        getAddressId: this.data.isVIP ? this.data.giveAddress.addressId : this.data.takeAddress.addressId,
        requireTime: this.data.prefetchingTime,
        deliverType: 0,
        orderRemarks: this.data.remarks
      },
      success: res => {
        app.globalData.updateAlmirah = true;
        console.log('------');
        console.log(res);
        console.log('------');
        wx.hideLoading();
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

              app.globalData.updateAlmirah = true;

              // 清空购物车
              wx.removeStorage({
                key: 'laundryTrolley'
              });

              app.globalData.commission.freeWash = this.data.couponChecked ? app.globalData.commission.freeWash * 1 - 1 : app.globalData.commission.freeWash;

              setTimeout(() => {
                wx.redirectTo({
                  url: `../success/success?type=laundry&orderId=${data.orderId}&createTime=${data.creatime}&shopName=${data.shopName}&shopTel=${data.shopTel}&shopAddress=${data.shopAddress}`
                });
              }, 600);
            } else {
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
              // setTimeout(() => {
              //   wx.redirectTo({
              //     url: '../fail/fail?type=laundry'
              //   });
              // }, 800);
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
      }
    });
  }
});
