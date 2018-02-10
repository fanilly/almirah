// pages/laundryOrder/laundryOrder.js
const app = getApp(),
  api = app.globalData.api;
let trolley = []; //购物车数据
Page({

  data: {
    baseUrl: '',
    loaded:false, //加载完毕
    isShowTrolley: false, // 是否显示购物车内容编辑模块
    trolleyContent: [], //购物车中的数据
    totalPrice: 0, //购物车中的商品总价
    totalTrolley: 0, //购物车中的商品数量
    curIndex: 0, //当前选中的服饰类型
    datas: [], //所有数据
    lists: [] //当前选中类型的数据
  },

  //阻止时间冒泡
  handleStopPropagation() {

  },

  // 去结算
  handleGoSettlement() {
    if (this.data.totalTrolley <= 0) {
      wx.showModal({
        content: '您还没有选择商品呦！'
      });
    } else {
      wx.navigateTo({
        url: '../laundrySettlement/laundrySettlement'
      });
    }
  },

  //关闭购物车内容编辑模块
  handleCloseTrolley(e) {
    this.setData({
      isShowTrolley: false
    });
  },

  //显示购物车内容编辑模块
  handleShowTrolley() {
    this.setData({
      isShowTrolley: true
    });
  },

  // 头部按钮点击事件
  handleCheckoutType(e) {
    let id = parseInt(e.target.id);
    this.setData({
      curIndex: id,
      lists: this.data.datas[id].children
    });
  },

  // 产品列表中的加号点击事件
  handleAddProduct(e) {
    let i, id = e.currentTarget.id,
      lists = this.data.lists,
      goods = lists[id], //当前商品
      totalPrice = parseFloat(this.data.totalPrice) + parseFloat(goods.price),
      flag = true; //真表示购物车中没有当前商品

    //检查购物车中是否已存在此商品
    //如果存在 添加商品个数
    //如果不存在 将商品加入
    for (i = 0; i < trolley.length; i++) {
      if (goods.catId == trolley[i].catId) {
        trolley[i].total = trolley[i].total + 1;
        flag = false;
        break;
      }
    }

    if (flag) {
      goods.total = 1;
      trolley.push(goods);
    }

    //更新storage中的购物车数据
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });

    //更新页面展示的购物车数量总价列表数据
    this.setData({
      totalTrolley: this.data.totalTrolley + 1,
      totalPrice: totalPrice.toFixed(2),
      trolleyContent: trolley
    });
  },

  //减少商品
  handleReduceProductNumber(e) {
    let id = parseInt(e.currentTarget.id),
      trolleyContent = this.data.trolleyContent,
      totalPrice = parseFloat(this.data.totalPrice) - parseFloat(trolleyContent[id].price);

    //如果所减商品的原有数量为1 直接删除该商品
    //否则商品的数量减1
    if (trolleyContent[id].total <= 1) {
      trolleyContent.splice(id, 1);
      this.setData({
        trolleyContent: trolleyContent,
        totalTrolley: this.data.totalTrolley - 1,
        totalPrice: totalPrice.toFixed(2)
      });
    } else {
      trolleyContent[id].total = trolleyContent[id].total - 1;
      this.setData({
        trolleyContent: trolleyContent,
        totalTrolley: this.data.totalTrolley - 1,
        totalPrice: totalPrice.toFixed(2)
      });
    }

    //更新storage中的购物车数据
    trolley = trolleyContent;
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });
  },

  //添加商品
  handleAddProductNumber(e) {
    let id = parseInt(e.currentTarget.id),
      trolleyContent = this.data.trolleyContent,
      totalPrice = parseFloat(this.data.totalPrice) + parseFloat(trolleyContent[id].price);
    trolleyContent[id].total = trolleyContent[id].total + 1;

    //更新页面显示的购物车数据
    this.setData({
      trolleyContent: trolleyContent,
      totalTrolley: this.data.totalTrolley + 1,
      totalPrice: totalPrice.toFixed(2)
    });

    //更新storage中的购物车数据
    trolley = trolleyContent;
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    //绑定baseUrl
    this.setData({
      baseUrl: app.globalData.baseUrl
    });

    //从storage中获取购物车数据
    wx.getStorage({
      key: 'laundryTrolley',
      success: res => {
        // 首先将购物车中获取的数据字符串转换为json
        // 然后记录购物车中商品数量及总价
        trolley = JSON.parse(res.data) || [];
        let i, totalTrolley = 0,
          totalPrice = 0;
        for (i = 0; i < trolley.length; i++) {
          totalTrolley += parseInt(trolley[i].total);
          totalPrice += parseInt(trolley[i].total) * parseFloat(trolley[i].price);
        }
        this.setData({
          totalTrolley: totalTrolley,
          totalPrice: totalPrice.toFixed(2),
          trolleyContent: trolley
        });
      }
    });

    //获取商品数据
    wx.request({
      url: `${api}/common/get_goods_cate`,
      success: res => {
        console.log(res.data);
        this.setData({
          datas: res.data || [],
          lists: res.data[0].children || [],
          loaded: true
        });
      }
    });
  }
});
