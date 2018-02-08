// pages/laundrySettlement/laundrySettlement.js
import { formatDate } from '../../utils/util.js';
const app = getApp();
Page({

  data: {
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


  // 生命周期函数--监听页面加载
  onLoad(options) {

    this.setData({
      startTime: formatDate(new Date())
    });

    // 从购物车中获取商品渲染
    wx.getStorage({
      key: 'laundryTrolley',
      success: res => {
        let i, totalPrice = 0,
          trolley = JSON.parse(res.data) || [];
        for (i = 0; i < trolley.length; i++) {
          totalPrice += parseInt(trolley[i].total) * parseFloat(trolley[i].price);
        }
        this.setData({
          trolleys: trolley,
          totalPrice: totalPrice
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
          this.setData({
            takeAddress: res.data.data,
            giveAddress: res.data.data,
            loaded: true
          });
        }
      }
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
        orderScore: 1,
        goods: JSON.stringify(goods),
        userAddressId: this.data.takeAddress.addressId,
        getAddressId: this.data.giveAddress.addressId,
        requireTime: this.data.prefetchingTime,
        deliverType: 0,
        orderRemarks: this.data.remarks
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data == 1) {
          wx.showToast({
            title: '下单成功',
            icon: 'success',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: '网络异常',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      }
    });
  }
});
