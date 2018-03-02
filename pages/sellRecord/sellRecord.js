// pages/sellRecord/sellRecord.js
// 时间一直走 没有尽头 只有路口
import getSelling from '../../request/getSelling.js';
const app = getApp(),
  params = {
    num: [7, 5, 6],
    msg: ['暂无待发货订单', '暂无已发货订单', '暂无已完成订单']
  },
  switchStatus = {
    GetDelete: '删除',
    Confirm: '确认'
  };
Page({

  // 页面的初始数据
  data: {
    btns: ['待发货', '已发货', '已完成'],
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
    }],
    currentIndex: 0,
    startRefresh: false
  },

  //生命周期函数--监听页面加载
  onLoad(options) {
    this.handleCheckout({ currentTarget: { id: this.data.currentIndex } });
  },

  // 确认收货
  handleConfirm(e) {
    this.changeStatus(e.currentTarget.id, 'Confirm');
  },

  //删除
  handleDelete(e) {
    this.changeStatus(e.currentTarget.id, 'GetDelete');
  },

  // 后台工程师又说不做了  所以这是个假的催促发货
  handleUrge() {
    wx.showLoading({ title: '催促中', mask: true });
    setTimeout(function() {
      wx.hideLoading();
      wx.showToast({
        title: '催促成功',
        icon: 'success',
        duration: 1500
      });
    }, Math.ceil(1000 * (Math.random() + 1)));
  },

  //跳转至详情
  handleGoDetail(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: `../productDetail/productDetail?id=${e.currentTarget.id}&self=1`
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

  // 商品类型切换
  handleCheckout(e) {
    let index = parseInt(e.currentTarget.id);
    this.setData({
      currentIndex: index
    });
    //如果listsStatus的值为努力加载中 代表当前选项的数据未被加载过
    //加载过的数据不进行二次加载 刷新时重新加载当前选项的数据
    if (this.data.listsAll[index].listsStatus == '努力加载中...' || this.data.startRefresh) {
      getSelling(this, params.num[index], () => {
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
  },

  //改变状态
  changeStatus(index, type) {
    wx.showModal({
      content: `确认${switchStatus[type]}`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '请稍后', mask: true });
          let cIndex = this.data.currentIndex,
            listsAll = this.data.listsAll;
          console.log(listsAll[cIndex].lists[index].goodsId);
          wx.request({
            url: `${app.globalData.api}/goods/goods_status`,
            data: {
              goodsId: listsAll[cIndex].lists[index].goodsId,
              goodsMark: type
            },
            success: res => {
              wx.hideLoading();
              if (res.data == 1) {
                wx.showToast({
                  title: `${switchStatus[type]}成功`,
                  icon: 'success',
                  duration: 1500
                });
                listsAll[cIndex].lists.splice(index, 1);
                if (listsAll[cIndex].lists.length <= 0) {
                  listsAll[cIndex].listsStatus = params.msg[cIndex];
                }
                this.setData({ listsAll });
              } else {
                wx.showToast({
                  title: `${switchStatus[type]}失败`,
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }
            },
            fail() {
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          });
        }
      }
    });

  }
});
