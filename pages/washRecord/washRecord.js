// pages/washRecord/washRecord.js
import getSelling from '../../request/getSelling.js';
import changeStatus from '../../request/changeStatus.js';
import deleteGoods from '../../request/deleteGoods.js';
import sendMessage from '../../request/sendMessage.js';
const app = getApp(),
  params = {
    num: [100, 0, 1, 2, 3],
    msg: ['暂无存储商品', '暂无待存储商品', '暂无存储中商品', '暂无待收货商品', '暂无已完成商品']
  };

Page({

  data: {
    btns: ['全部', '待存储', '存储中', '待收货', '已完成'],
    baseUrl: app.globalData.baseUrl,
    listsAll: [{
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }],
    currentIndex: 0,
    startRefresh: false
  },

  //跳转至编辑页面
  handleEdit(e) {
    console.log(e);
    console.log(this.data.listsAll[0]);
    wx.navigateTo({
      url: `../edit/edit?id=${e.currentTarget.id}`
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  onShow() {
    if (app.globalData.updateWashRecord) this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  //跳转至详情
  handleGoDetail(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${e.currentTarget.id}&self=1&isStorage=1`
    });
  },

  //下拉刷新
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
    let listsAll = this.data.listsAll,
      startRefresh = true;
    //显示刷新动画 清楚视图中数据 重新发起请求
    listsAll[this.data.currentIndex].listsStatus = 1;
    listsAll[this.data.currentIndex].lists = [];
    this.setData({ listsAll, startRefresh });
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  //催促
  handleUrgeDelivery(e) {
    sendMessage(this, e.currentTarget.id, 'storage');
  },

  //收货
  handleConfirm(e) {
    changeStatus(this, e.currentTarget.id, 1, 3, '收货', params);
  },

  //取回
  handleRetrieve(e) {
    changeStatus(this, e.currentTarget.id, 1, 2, '取回', params);
  },

  //交易
  handleSell(e) {
    wx.navigateTo({
      url: `../edit/edit?id=${e.currentTarget.id}&isSell=1`
    });
  },

  handleExpress(e) {
    wx.navigateTo({
      url: `../edit/edit?id=${e.currentTarget.id}&isSell=2`
    });
  },

  //删除
  handleDelete(e) {
    deleteGoods(this, e.currentTarget.id, params);
  },

  // 商品类型切换
  handleCheckout(e) {
    console.log(this.data.listsAll[0].lists);
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });
    //如果listsStatus的值为努力加载中 代表当前选项的数据未被加载过
    //加载过的数据不进行二次加载 刷新时重新加载当前选项的数据
    if (this.data.listsAll[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      getSelling(1, this, params.num[index], () => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = params.msg[index];
        this.setData({ listsAll });
      }, (res) => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = 1;
        listsAll[index].lists = res;
        this.setData({ listsAll });
      });
    }
  }
});
