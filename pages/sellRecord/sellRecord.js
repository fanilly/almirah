// pages/sellRecord/sellRecord.js
// 时间一直走 没有尽头 只有路口
import getSelling from '../../request/getSelling.js';
import changeStatus from '../../request/changeStatus.js';
import deleteGoods from '../../request/deleteGoods.js';
import sendMessage from '../../request/sendMessage.js';
const app = getApp(),
  params = {
    num: [100, 0, 1, 2],
    msg: ['暂无买商品', '暂无待发货商品', '暂无配送中商品', '暂无已完成商品']
  },
  switchStatus = {
    UserDelete: '删除',
    Pulloff: '下架',
    Putup: '上架',
    Recovery: '收回'
  };

Page({

  data: {
    btns: ['全部', '待发货', '配送中', '已完成'],
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

  //跳转至详情
  handleGoDetail(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${e.currentTarget.id}&goodsId=${e.currentTarget.dataset.goodsid}`
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

  //催促发货
  handleUrgeDelivery(e) {
    sendMessage(this, e.currentTarget.id, 'delivery');
  },

  //确认收货
  handleConfirm(e) {
    changeStatus(this, e.currentTarget.id, 4, 2, '收货', params);
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
      getSelling(4, this, params.num[index], () => {
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
