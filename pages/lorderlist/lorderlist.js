// pages/businessAdmin/businessAdmin.js
const app = getApp();
let shopId, currPage = 1,
  totalPage = 10,
  startTime, endTime;
Page({

  data: {
    isLoadMore: false,
    noMoreData: false,
    startTime: '',
    endTime: '',
    showIcon: false,
    baseUrl: app.globalData.baseUrl,
    lists: []
  },

  handleStartSearch() {
    if (!this.data.startTime) {
      wx.showModal({
        content: '请选择开始日期',
        showCancel: false
      });
    } else if (!this.data.endTime) {
      wx.showModal({
        content: '请选择截止日期',
        showCancel: false
      });
    } else {
      let startTimeStamp = new Date(this.data.startTime).getTime(),
        endTimeStamp = new Date(this.data.endTime).getTime();
      if (startTimeStamp > endTimeStamp) {
        wx.showModal({
          content: '开始日期不得大于截止日期',
          showCancel: false
        });
      } else {
        this.setData({
          lists: []
        });
        wx.showLoading({
          title: '加载中',
          mask: true
        });
        startTime = this.data.startTime;
        endTime = this.data.endTime;
        currPage = 1;
        totalPage = 10;
        this.getOrderList();
      }
    }
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    currPage = 1;
    totalPage = 10;
    shopId = options.shopId;
    if (options.startTime) {
      startTime = options.startTime;
      endTime = options.endTime;
      this.setData({
        startTime: options.startTime,
        endTime: options.endTime
      });
    }
    this.getOrderList();
  },

  handleDateChange(e) {
    console.log(e)
    if (e.currentTarget.dataset.rel == 'end') {
      this.setData({
        endTime: e.detail.value
      });
    } else {
      this.setData({
        startTime: e.detail.value
      });
    }
  },

  getOrderList(options) {
    let tempData = {
      shopId: shopId,
      pcurr: currPage
    };
    if (startTime && endTime) {
      tempData.startTime = startTime;
      tempData.endTime = endTime;
    }
    wx.request({
      url: `${app.globalData.api}/admin/parterOrder`,
      data: tempData,
      success: res => {
        console.log(res)
        wx.hideLoading();
        let data = res.data.data,
          lists = this.data.lists;
        if (currPage == 1 && !data.root || data.root.length <= 0) {
          this.setData({ showIcon: true });
        }else{
          this.setData({ showIcon: false });
        }
        currPage++;
        lists.push(...data.root);
        totalPage = data.totalPage;
        this.setData({ lists });
        console.log(lists)
      }
    });
  },

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if (currPage <= totalPage) {
      this.setData({
        isLoadMore: true
      });
      this.getOrderList();
    } else {
      this.setData({
        isLoadMore: false,
        noMoreData: true
      });
    }
  }

});
