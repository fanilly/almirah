// pages/addressChoose/addressChoose.js
const app = getApp();
let type; //保存本次选取类型 1取衣地址 2送衣地址 3收货地址
Page({
  data: {
    lists: []
  },

  // 获取地址列表数据
  getAddressLists() {
    wx.showLoading({title:'加载中'});
    wx.request({
      url: `${app.globalData.api}/address/list_address`,
      data: {
        userId: app.globalData.userID
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          lists: res.data.data
        });
      }
    });
  },

  handleChooseAddress(e){
    let id = e.currentTarget.id;
    console.log(type)
    switch (type) {
      case 1:
        app.globalData.takeAddress = this.data.lists[id];
        break;
      case 2:
        app.globalData.giveAddress = this.data.lists[id];
        break;
      case 3:
        app.globalData.receiptAddress = this.data.lists[id];
        break;
      default:
        console.log(1)
        break;
    }
    wx.navigateBack({
      delta:1
    });
  },

  //删除地址
  handleDelAddress(e) {
    wx.showLoading({title:'删除中'});
    console.log(this.data.lists[e.currentTarget.id].addressId);
    wx.request({
      url: `${app.globalData.api}/address/del_address`,
      data: {
        addressId: this.data.lists[e.currentTarget.id].addressId
      },
      success: res => {
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
        }else{
          wx.showToast({
            title: `删除失败`,
            icon: 'fail',
            duration: 1500
          });
        }
      }
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.getAddressLists();
    type = parseInt(options.type);
  },

  //生命周期函数--监听页面显示
  onShow: function() {
    this.getAddressLists();
  }
});
