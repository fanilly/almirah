// pages/productDetail/productDetail.js
import getMGoodsLists from '../../request/getMGoodsLists.js';
const app = getApp(),
  getMallTrolleyItem = function(detail) { //本次购买或加入购物车的数据
    return {
      goodsName: detail.goodsName,
      goodsId: detail.goodsId,
      goodsThums: detail.goodsThums,
      goodsUnit: detail.goodsUnit,
      goodsSpec: detail.goodsSpec,
      marketPrice: detail.marketPrice,
      shopprice: detail.shopPrice
    };
  };
Page({


  // 页面的初始数据
  data: {
    showDetail:false,
    totalTrolleyLen: 0,
    baseUrl: app.globalData.baseUrl,
    detail: {}, //商品详情数据,
    loadingStatus: -1, //1 到底了 2 未加载到商品
    lists: [], //列表数据
    loaded: false //是否加载完成
  },

  handleShowDetail(){
    this.setData({
      showDetail:true
    });
  },

  //加入购物车
  handleAddToTrolley() {
    console.log(this.data.detail);
    let detail = this.data.detail,
      mallTrolleyItem = getMallTrolleyItem(detail);
    console.log(mallTrolleyItem);
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let i, index, allowAdd = true,
          mallTrolley = res.data ? JSON.parse(res.data) : [];
        //如果再缓存中找到mallTrolley
        //将获取到的数据转换为数组 循环判断当前商品是否已经在购物车中存在
        for (i = 0; i < mallTrolley.length; i++) {
          if (mallTrolley[i].goodsId == detail.goodsId) {
            index = i;
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
          //提示商品已存在 默默的更新数据 =_=！
          mallTrolley.splice(index, 1, mallTrolleyItem);
          wx.setStorage({
            key: 'mallTrolley',
            data: JSON.stringify(mallTrolley)
          });
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
        app.globalData.totalTrolleyLen = app.globalData.totalTrolleyLen + 1;
        //改变数量
        this.setData({
          totalTrolleyLen: app.globalData.totalTrolleyLen
        });
      }
    });
  },

  //立即购买
  handleBuy() {
    let detail = this.data.detail,
      settlementGoods = [],
      temp = getMallTrolleyItem(detail);
    settlementGoods.push(temp);
    app.globalData.buyGoodsLists = settlementGoods;
    //跳转到商品结算页面
    wx.navigateTo({
      url: '../mallSettlement/mallSettlement'
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen,
      //如果是从出售商品页面进来的表示是自己的商品 此时应只显示详情无不相关内容
      isSelf: options.self ? true : false
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

    getMGoodsLists(this, 1);
  },

  //生命周期函数--监听页面显示
  onShow: function() {
    this.setData({
      totalTrolleyLen: app.globalData.totalTrolleyLen
    });
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
