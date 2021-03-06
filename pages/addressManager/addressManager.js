// pages/addressManager/addressManager.js
const app = getApp();
Page({
  data: {
    lists: []
  },

  // 获取地址列表数据
  getAddressLists() {
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: `${app.globalData.api}/address/list_address`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        this.setData({
          lists: res.data.data
        });
      }
    });
  },

  //删除地址
  handleDelAddress(e) {
    wx.showModal({
      content: `确认删除`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中' });
          console.log(this.data.lists[e.currentTarget.id].addressId);
          wx.request({
            url: `${app.globalData.api}/address/del_address`,
            data: {
              addressId: this.data.lists[e.currentTarget.id].addressId
            },
            success: res => {
              console.log(res);
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showToast({
                  title: `删除成功`,
                  icon: 'success',
                  duration: 1500
                });
                let lists = this.data.lists;
                lists.splice(e.currentTarget.id, 1);
                this.setData({
                  lists: lists
                });
              } else {
                wx.showToast({
                  title: `删除失败`,
                  icon: 'fail',
                  duration: 1500
                });
              }
            }
          });
        }
      }
    });

  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.getAddressLists();
  },

  //生命周期函数--监听页面显示
  onShow: function() {
    this.getAddressLists();
  }
});
