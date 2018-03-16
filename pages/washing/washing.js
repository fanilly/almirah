// pages/washing/washing.js
import getLOrderList from '../../request/getLOrderList.js';
const app = getApp(),
  params = {
    num: [false, 5, 1, 2, 3, 4],
    msg: ['暂无订单数据', '暂无待付款订单', '暂无待取货订单', '暂无待收货订单', '暂无待评价订单', '暂无已完成订单']
  };
Page({

  data: {
    hasOrderList: 2,
    btns: ['全部', '待付款', '待取货', '待收货', '待评价', '已完成'],
    currentIndex: 0,
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
    }, {
      lists: [],
      listsStatus: '努力加载中...'
    }],
    isVIP: app.globalData.isVIP
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      isVIP: app.globalData.isVIP
    });
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
    // //获取订单数据
    // getLOrderList(this, 0);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    let listsAll = this.data.listsAll,
      startRefresh = true;
    //显示刷新动画 清楚视图中数据 重新发起请求
    listsAll[this.data.currentIndex].listsStatus = 1;
    listsAll[this.data.currentIndex].lists = [];
    this.setData({ listsAll, startRefresh });
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  // 生命周期函数--监听页面显示
  onShow() {
    wx.setNavigationBarTitle({
      title: '在洗衣物'
    });
    this.setData({
      isShowChooseGoods: false
    });
  },

  // 商品类型切换
  handleCheckout(e) {
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });

    //如果listsStatus的值为努力加载中 代表当前选项的数据未被加载过
    //加载过的数据不进行二次加载 刷新时重新加载当前选项的数据
    if (this.data.listsAll[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      getLOrderList(this, params.num[index], () => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = params.msg[index];
        this.setData({ listsAll });
      }, (res) => {
        let listsAll = this.data.listsAll;
        listsAll[index].listsStatus = 1;
        listsAll[index].lists = res;
        this.setData({ listsAll });
        console.log(this.data);
      });
    }
  }
});
