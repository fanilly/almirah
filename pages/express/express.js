// pages/selling/selling.js
import getSelling from '../../request/getSelling.js';
import deleteGoods from '../../request/deleteGoods.js';
import changeStatus from '../../request/changeStatus.js';
import sendMessage from '../../request/sendMessage.js';
const app = getApp(),
  params = {
    num: [100, 0, 1, 2],
    msg: ['暂无流通商品', '暂无待流通商品', '暂无流通中商品', '暂无已流通商品']
  };

Page({

  data: {
    btns: ['全部', '待流通', '流通中', '已完成'],
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
    }],
    currentIndex: 0,
    startRefresh: false
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
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

  //收货
  handleConfirm(e) {
    changeStatus(this, e.currentTarget.id, 2, 2, '收货', params);
  },

  //删除
  handleDelete(e) {
    deleteGoods(this, e.currentTarget.id, params);
  },

  //催促
  handleUrge(e) {
    sendMessage(this, e.currentTarget.id, 'express');
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
      getSelling(2,this, params.num[index], () => {
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
