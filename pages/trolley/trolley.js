// pages/trolley/trolley.js
const app = getApp(),
  controlAnimate = wx.createAnimation({
    duration: 520,
    timingFunction: 'ease'
  });
let storageMallTrolley = [];

Page({

  data: {
    isChooseAll: false,
    showMsg: true,
    showMask: {}, //动画数据 显示遮罩层
    loadingStatus: 0, //加载装填 0 加载中 1 购物车空空 2 显示购物车列表
    currentShowControl: -1, //控制按钮显示的列表
    lists: [], // 商品列表
    totalCheckedGoods: 0, // 已选中商品的数量
    totalCheckedPrice: 0, // 已选中商品的价格
    baseUrl: app.globalData.baseUrl
  },

  //分享
  onShareAppMessage(res) {
    return {
      title: '净衣客',
      path: `/pages/index/index?recommendId=${app.globalData.userID}`,
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    };
  },

  test() {
    if (this.data.currentShowControl != -1) {
      this.setData({
        currentShowControl: -1
      });
    }
  },

  //关闭温馨提示
  handleCloseMsg() {
    this.setData({
      showMsg: false
    });
  },

  handleChooseAll() {
    console.log(1);
    this.setData({
      isChooseAll: !this.data.isChooseAll
    });
    let i,
      lists = this.data.lists,
      totalCheckedGoods = 0,
      totalCheckedPrice = 0;
    if (this.data.isChooseAll) { //全选
      for (i = 0; i < lists.length; i++) {
        lists[i].checked = true;
        totalCheckedPrice = parseFloat(totalCheckedPrice) + parseFloat(lists[i].shopprice);
      }
      totalCheckedGoods = lists.length;
      totalCheckedPrice = totalCheckedPrice.toFixed(2);
    } else { //取消全选
      for (i = 0; i < lists.length; i++) {
        lists[i].checked = false;
      }
    }
    this.setData({ lists, totalCheckedGoods, totalCheckedPrice });
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
    let i, index = e.currentTarget.id,
      lists = this.data.lists,
      totalCheckedGoods = 0,
      totalCheckedPrice = 0;

    //更新缓存中的购物车数据
    storageMallTrolley.splice(index, 1);
    wx.setStorage({
      key: 'mallTrolley',
      data: JSON.stringify(storageMallTrolley)
    });


    //更新页面渲染的购物车数据
    lists.splice(index, 1);

    //更新选中商品的个数及价格
    for (i = 0; i < lists.length; i++) {
      if (lists[i].checked) {
        totalCheckedGoods++;
        totalCheckedPrice = parseFloat(totalCheckedPrice) + parseFloat(lists[i].shopprice);
      }
    }

    //如果lists的长度小于等于0 证明购物车已经被删空了
    if (lists.length <= 0) {
      this.setData({
        loadingStatus: 1
      });
    } else {
      //改变购物车中商品列表及选中商品个数和价格
      this.setData({ lists, totalCheckedGoods, totalCheckedPrice });
    }

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
        console.log(storageMallTrolley);
        for (i = 0; i < mallTrolley.length; i++) {
          mallTrolley[i].checked = false;
        }
        this.setData({
          lists: mallTrolley,
          loadingStatus: mallTrolley.length <= 0 ? 1 : 2
        });
      },
      fail: err => {
        this.setData({
          loadingStatus: 1
        });
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
      console.log(totalCheckedPrice);
      totalCheckedPrice = totalCheckedPrice.toFixed(2);
    } else {
      //如果取消选择改变选中件数及总金额
      totalCheckedGoods--;
      totalCheckedPrice = parseFloat(totalCheckedPrice) - parseFloat(lists[id].shopprice);
      totalCheckedPrice = totalCheckedPrice.toFixed(2);
    }
    this.setData({ lists, totalCheckedGoods, totalCheckedPrice });

    let tempFlag = true;
    for (let i = 0; i < lists.length; i++) {
      if (!lists[i].checked) {
        tempFlag = false;
        break;
      }
    }
    if (tempFlag) {
      this.setData({
        isChooseAll: true
      });
    } else {
      this.setData({
        isChooseAll: false
      });
    }
  },

  //跳转到商城页面
  handleNavigateToMall() {
    wx.navigateTo({
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
