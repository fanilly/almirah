// pages/selling/selling.js
const app = getApp(),
  params = {
    num: [1, 2, 3, 0],
    msg: ['暂无已上架商品', '暂无已下架商品', '暂无已收回商品', '暂无待审核商品']
  };
Page({

  data: {
    btns: ['已上架', '已下架', '已收回', '待审核'],
    baseUrl: app.globalData.baseUrl,
    listsTest: [{
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
    let listsTest = this.data.listsTest,
      startRefresh = true;
    //显示刷新动画 清楚视图中数据 重新发起请求
    listsTest[this.data.currentIndex].listsStatus = 1;
    listsTest[this.data.currentIndex].lists = [];
    this.setData({ listsTest, startRefresh });
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  // 切换至已上架上品
  handleCheckout(e) {
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });
    if (this.data.listsTest[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      this.checkout(params.num[index], () => {
        let listsTest = this.data.listsTest;
        listsTest[index].listsStatus = params.msg[index];
        this.setData({ listsTest });
      }, (res) => {
        let listsTest = this.data.listsTest;
        listsTest[index].listsStatus = 1;
        listsTest[index].lists = res;
        this.setData({ listsTest });
      });
    }
  },

  //数据切换
  checkout(num, fn1, fn2) {
    wx.request({
      url: `${app.globalData.api}/goods/goods_list`,
      data: {
        userId: app.globalData.userID,
        goodsMark: num
      },
      success: res => {
        // 隐藏加载动画
        this.setData({
          startRefresh: false
        });
        if (!res.data || res.data.length <= 0) {
          if (fn1) fn1();
        } else {
          if (fn2) fn2(res.data);
        }
      }
    });
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady() {

  },

  // 生命周期函数--监听页面显示
  onShow() {

  },

  //生命周期函数--监听页面隐藏
  onHide() {

  }
});
