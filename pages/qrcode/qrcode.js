// pages/qrcode/qrcode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    url: '',
    userInfo: ''
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    this.setData({
      money: app.globalData.commission.money,
      userInfo: app.globalData.userInfo,
      url: `${app.globalData.baseUrl}${app.globalData.commission.rqcode}`
    });

    setInterval(() => {
      wx.request({
        url: `${app.globalData.api}/user/user_info`,
        data: {
          userId: app.globalData.userID
        },
        success: res => {
          app.globalData.commission = res.data.data;
          this.setData({
            money: app.globalData.commission.money
          });
          wx.hideLoading();
        }
      });
    }, 8000);
  },

  handleClickDownLoad() {
    //保存图片
    const downloadTask = wx.downloadFile({
      url: this.data.url, //仅为示例，并非真实的资源
      success: function(res) {
        console.log(res)
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res) {
            console.log(res);
            var savedFilePath = res.savedFilePath;
            wx.saveImageToPhotosAlbum({
              filePath:savedFilePath,
              success(res) {
                console.log('yes')
              }
            })
          }
        });
        wx.playVoice({
          filePath: res.tempFilePath
        })
      }
    });

    // downloadTask.onProgressUpdate((res) => {
    //   console.log('下载进度', res.progress)
    //   console.log('已经下载的数据长度', res.totalBytesWritten)
    //   console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    // });
  },

  //提现
  handleTiXian() {
    if (!app.globalData.commission.phone) {
      wx.showModal({
        content: '请先绑定手机号',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../bindphone/bindphone'
            });
          }
        }
      });
    } else {
      if (this.data.money * 1 <= 0) {
        wx.showToast({
          title: '金币不足',
          image: '../../assets/warning.png',
          duration: 1500
        });
      } else {
        wx.request({
          url: `${app.globalData.api}/commission/tixian`,
          data: {
            userId: app.globalData.userID,
            money: this.data.money
          },
          success: res => {
            if (res.data.status == 1) {
              wx.showModal({
                content: '恭喜您，提现成功，提现金额会在24小时之内下发到您的账户，请注意查收',
                showCancel: false
              });
              this.setData({
                money: 0.00
              });
              app.globalData.commission.money = 0.00;
            } else {
              wx.showToast({
                title: '网络异常',
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

  },

  //分享
  onShareAppMessage(res) {
    return {
      title: '净衣客',
      path: `/pages/index/index?recommendId=${app.globalData.userID}`,
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      }
    };
  },
});
