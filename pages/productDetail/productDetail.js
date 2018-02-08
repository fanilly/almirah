// pages/productDetail/productDetail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalTrolleyLen: 0,
    baseUrl: app.globalData.baseUrl,
    detail: {}, //商品详情数据
    loaded: false //是否加载完成
  },

  //加入购物车
  handleAddToTrolley() {
    let detail = this.data.detail,
      mallTrolleyItem = { //本次要向购物车中添加商品的数据
        goodsName: detail.name,
        goodsId: detail.goodsId,
        goodsThums: detail.goodsThums,
        goodsUnit: detail.goodsUnit,
        goodsSpec: detail.goodsSpec,
        marketPrice: detail.marketPrice,
        shopprice: detail.shopprice
      };
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let i, allowAdd = true,
          mallTrolley = res.data ? JSON.parse(res.data) : [];
        //如果再缓存中找到mallTrolley
        //将获取到的数据转换为数组 循环判断当前商品是否已经在购物车中存在
        for (i = 0; i < mallTrolley.length; i++) {
          if (mallTrolley[i].goodsId == detail.goodsId) {
            allowAdd = false;
            break;
          }
        }

        //如果存在 向用户提示商品已经在购物车中
        //否则直接加入购物车
        if (allowAdd) {
          mallTrolley.push(mallTrolleyItem);
          wx.setStorage({
            key: 'mallTrolley',
            data: JSON.stringify(mallTrolley)
          });
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1500
          });
          app.globalData.totalTrolleyLen = app.globalData.totalTrolleyLen + 1;
          //改变数量
          this.setData({
            totalTrolleyLen: app.globalData.totalTrolleyLen
          });
        } else {
          wx.showToast({
            title: '商品已存在',
            image: '../../assets/warning.png',
            duration: 1500
          });
        }

      },
      fail: err => {
        //如果缓存中没有mallTrolley 代表用户未点击过加入购车车按钮
        //为购物车中添加一件商品
        let mallTrolley = [mallTrolleyItem];
        wx.setStorage({
          key: 'mallTrolley',
          data: JSON.stringify(mallTrolley)
        });
      }
    });
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen
    });
    //请求商品详情数据
    wx.request({
      url: `${app.globalData.api}/goods/goods_info`,
      data: {
        goodsId: options.id
      },
      success: res => {
        console.log(res);
        this.setData({
          detail: res.data,
          loaded: true
        });
      }
    });
  },

  //生命周期函数--监听页面显示
  onShow: function() {

  },

  // 用户点击右上角分享
  onShareAppMessage: function() {
    return {
      title: '净衣客 -- ' + this.data.detail.goodsName,
      path: '/pages/index/index',
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    };
  }
});
