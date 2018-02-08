// pages/trolley/trolley.js
const app = getApp(),
  controlAnimate = wx.createAnimation({
    duration: 520,
    timingFunction: 'ease'
  });
let storageMallTrolley = [];

Page({

  data: {
    showMask: {}, //动画数据 显示遮罩层
    loadingStatus: 0, //加载装填 0 加载中 1 购物车空空 2 显示购物车列表
    currentShowControl: -1, //控制按钮显示的列表
    lists: [], // 商品列表
    totalCheckedGoods: 0, // 已选中商品的数量
    totalCheckedPrice: 0, // 已选中商品的价格
    baseUrl: app.globalData.baseUrl
  },

  // 长按列表项显示控制按钮
  handleShowControl(e) {
    this.setData({
      currentShowControl: e.currentTarget.id
    });

    controlAnimate.opacity(1).step();
    this.setData({
      showMask: controlAnimate
    });
  },

  //点击删除从购物车中删除当前商品
  handleDelGoods(e) {
    let index = e.currentTarget.id,
      lists = this.data.lists;
    //更新缓存中的购物车数据
    storageMallTrolley.splice(index, 1);
    wx.setStorage({
      key: 'mallTrolley',
      data: JSON.stringify(storageMallTrolley)
    });
    //更新页面渲染的购物车数据
    lists.splice(index, 1);
    this.setData({ lists });
    //更新全局记录的购物车商品数量
    app.globalData.totalTrolleyLen = app.globalData.totalTrolleyLen - 1;
  },

  //点击控制按钮 隐藏
  handleHideControl() {
    this.setData({
      currentShowControl: -1
    });

    controlAnimate.opacity(0).step();
    this.setData({
      showMask: controlAnimate
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    //从缓存中获取购物车数据
    wx.getStorage({
      key: 'mallTrolley',
      success: res => {
        let i, mallTrolley = res.data ? JSON.parse(res.data) : [];
        storageMallTrolley = mallTrolley;
        for (i = 0; i < mallTrolley.length; i++) {
          mallTrolley[i].checked = false;
        }
        this.setData({
          lists: mallTrolley,
          loadingStatus: mallTrolley.length = 0 ? 1 : 2
        });
        console.log(this.data.lists);
      }
    });
  },

  // 切换选中状态
  handleCheckout(e) {
    let id = e.currentTarget.id,
      lists = this.data.lists,
      totalCheckedGoods = this.data.totalCheckedGoods,
      totalCheckedPrice = this.data.totalCheckedPrice;
    lists[id].checked = !lists[id].checked;
    if (lists[id].checked) { //如果选中 改变选中件数及总金额
      totalCheckedGoods++;
      totalCheckedPrice = parseFloat(totalCheckedPrice) + parseFloat(lists[id].shopprice);
      console.log(totalCheckedPrice)
      totalCheckedPrice = totalCheckedPrice.toFixed(2);
    } else {
      //如果取消选择改变选中件数及总金额
      totalCheckedGoods--;
      totalCheckedPrice = parseFloat(totalCheckedPrice) - parseFloat(lists[id].shopprice);
      totalCheckedPrice = totalCheckedPrice.toFixed(2);
    }
    this.setData({ lists, totalCheckedGoods, totalCheckedPrice });
  },

  //跳转到商城页面
  handleNavigateToMall() {
    wx.switchTab({
      url: '../mall/mall'
    });
  },

  //跳转到详情页面
  handleNavigateToDetail(e) {
    let goodsId = this.data.lists[e.currentTarget.id].goodsId;
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${goodsId}`
    });
  },

  //点击去结算进行多商品结算
  handleGoSettlement() {
    //将选中的商品记录到全局对象中
    let settlementGoods = [],
      lists = this.data.lists;
    lists.forEach(item => {
      if (item.checked) {
        settlementGoods.push(item);
      }
    });
    if (settlementGoods.length <= 0) {
      wx.showModal({
        content: '去结算时至少要选中一件商品哦！',
        showCancel: false
      });
    } else {
      app.globalData.buyGoodsLists = settlementGoods;
      //跳转到商品结算页面
      wx.navigateTo({
        url: '../mallSettlement/mallSettlement'
      });
    }
  },

  //点击购买进行单商品结算
  handleBuyGoods(e) {
    let settlementGoods = [],
      index = e.currentTarget.id,
      lists = this.data.lists;
    settlementGoods.push(lists[index]);
    app.globalData.buyGoodsLists = settlementGoods;
    //跳转到商品结算页面
    wx.navigateTo({
      url: '../mallSettlement/mallSettlement'
    });
  },

  // 生命周期函数--监听页面显示
  onShow: function() {

  }
});
