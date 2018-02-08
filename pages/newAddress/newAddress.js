// pages/newAddress/newAddress.js
const app = getApp();
let address = '',
  name, phone, addressContent, latitude, longitude,
  title = '添加';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressID: '',
    isAdd: true, //是否为添加地址
    name: '请输入姓名',
    phone: '请输入手机号',
    address: '请选择', //地址
    addressContent: '请输入详细地址',
    textareaValueLen: 0, //详细地址的长度
    isDefault: false //是否设置为默认地址
  },

  //切换地址是否设为默认
  handleCheckout() {
    this.setData({
      isDefault: !this.data.isDefault
    });
  },

  //记录姓名
  handleRecordName(e) {
    name = e.detail.value;
  },

  //记录手机号
  handleRecordPhone(e) {
    phone = e.detail.value;
  },

  //记录详细地址
  handleAddressContent(e) {
    addressContent = e.detail.value;
    this.setData({
      textareaValueLen: addressContent.length
    });
  },

  //点击选取地址
  hadleChooseAddress() {
    // 点击选择按钮之后打开地图选择地址
    wx.getLocation({
      type: 'wgs84',
      // 如果成功 直接选择地址
      success: res => {
        this.chooseAddress();
      },
      // 如果选择失败 打开设置 重新授权
      fail: res => {
        wx.openSetting({
          success: res => {
            if (res.authSetting['scope.userLocation']) {
              this.chooseAddress();
            }
          }
        });
      }
    });
  },

  //选取地址
  chooseAddress() {
    wx.chooseLocation({
      success: res => {
        latitude = res.latitude;
        longitude = res.longitude;
        address = res.name != '' ? res.name : res.address;
        this.setData({
          address: address
        });
      }
    });
  },

  //添加地址
  handleAddAddress() {
    //添加地址
    if (this.data.isAdd) {
      if (!name) {
        wx.showModal({
          content: '请输入姓名',
          showCancel: false
        });
      } else if (!phone) {
        wx.showModal({
          content: '请输入手机号',
          showCancel: false
        });
      } else if (!address) {
        wx.showModal({
          content: '请选择地址',
          showCancel: false
        });
      } else if (!addressContent) {
        wx.showModal({
          content: '请输入详细地址',
          showCancel: false
        });
      } else {
        wx.showLoading({title:`${title}中`});
        wx.request({
          url: `${app.globalData.api}/address/add_address`,
          data: {
            userId: app.globalData.userID,
            userName: name,
            userPhone: phone,
            addr: this.data.address,
            latitude: latitude,
            longitude: longitude,
            address: addressContent,
            isDefault: this.data.isDefault ? 1 : 0
          },
          success: res => {
            wx.hideLoading();
            if (res.data.status == 1) {
              //弹出提示
              wx.showToast({
                title: `${title}成功`,
                icon: 'success',
                duration: 1500
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 500);
            } else {
              wx.showToast({
                title: `${title}失败`,
                image:'../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      }
    } else {
      if (!name && !this.data.name) {
        wx.showModal({
          content: '请输入姓名',
          showCancel: false
        });
      } else if (!phone && !this.data.phone) {
        wx.showModal({
          content: '请输入手机号',
          showCancel: false
        });
      } else if (!address && !this.data.address) {
        wx.showModal({
          content: '请选择地址',
          showCancel: false
        });
      } else if (!addressContent && !this.data.addressContent) {
        wx.showModal({
          content: '请输入详细地址',
          showCancel: false
        });
      } else {
        wx.showLoading({title:`${title}中`});
        wx.request({
          url: `${app.globalData.api}/address/add_address`,
          data: {
            addressId: this.data.addressID,
            userId: app.globalData.userID,
            userName: name != '' ? name : this.data.name,
            userPhone: phone != '' ? phone : this.data.phone,
            addr: this.data.address,
            latitude: latitude != '' ? latitude : this.data.latitude,
            longitude: longitude != '' ? longitude : this.data.longitude,
            address: addressContent != '' ? addressContent : this.data.addressContent,
            isDefault: this.data.isDefault ? 1 : 0
          },
          success: res => {
            wx.hideLoading();
            if (res.data.status == 1) {
              //弹出提示
              wx.showToast({
                title: `${title}成功`,
                icon: 'success',
                duration: 1500
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                });
              }, 500);
            } else {
              wx.showToast({
                title: `${title}失败`,
                image:'../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      }
    }
  },


  //生命周期函数--监听页面加载
  onLoad(options) {
    address = '';
    name = '';
    phone = '';
    addressContent = '';
    latitude = '';
    longitude = '';
    title = '添加';
    if (options.title == '修改地址') {
      title = '修改';
      wx.setNavigationBarTitle({
        title: '修改地址'
      });
      this.setData({
        isAdd: false,
        name: options.name,
        phone: options.phone,
        address: options.addr,
        addressContent: options.address,
        addressID: options.addressId,
        isDefault: options.isDefault * 1 == 1 ? true : false,
        latitude: options.latitude,
        longitude: options.longitude
      });
    }
  }
});
