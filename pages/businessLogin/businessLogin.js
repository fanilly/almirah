const app = getApp();
Page({
  data: {
    shopLoginName: '',
    shopLoginPwd: ''
  },

  onLoad(options) {
    //如果已登陆 直接跳转至后台管理页面
    if (app.globalData.business.isLogin) {
      wx.redirectTo({
        url: '../businessAdmin/businessAdmin'
      });
    } else {
      //从缓存中提取用户名密码
      wx.getStorage({
        key: 'shopLoginName',
        success: res => {
          this.setData({
            shopLoginName: res.data
          });
        }
      });

      wx.getStorage({
        key: 'shopLoginPwd',
        success: res => {
          this.setData({
            shopLoginPwd: res.data
          });
        }
      });
    }
  },

  //表单提交事件
  formSubmit(e) {
    let self = this,
      data = e.detail.value;
    if (!data.loginName) {
      wx.showModal({
        content: '请输入用户名',
        showCancel: false
      });
    } else if (!data.loginPwd) {
      wx.showModal({
        content: '请输入密码',
        showCancel: false
      });
    } else {
      wx.showLoading({
        title: '登陆中',
        mask: true
      });
      //登陆
      wx.request({
        url: `${app.globalData.api}/admin/login`,
        data: {
          loginName: data.loginName,
          loginPwd: data.loginPwd
        },
        success: res => {
          let datas = res.data;
          wx.hideLoading();
          console.log(datas);
          if (datas.data.status * 1 == 1) {
            //记录登陆状态
            app.globalData.business.isLogin = true;
            app.globalData.business.shopId = datas.data.shopId;
            app.globalData.business.driveId = datas.data.DriveId;
            app.globalData.business.driveName = datas.data.DriveName;
            wx.setStorage({
              key: 'shopLoginName',
              data: data.loginName
            });
            wx.setStorage({
              key: 'shopLoginPwd',
              data: data.loginPwd
            });
            //绑定成功
            wx.showToast({
              title: '登陆成功',
              image: '../../assets/success.png',
              duration: 1500
            });
            setTimeout(() => {
              wx.redirectTo({
                url: '../businessAdmin/businessAdmin'
              });
            }, 500);
          } else {
            wx.showToast({
              title: '登陆失败',
              image: '../../assets/warning.png',
              duration: 1500
            });
          }
        }
      });
    }
  }
});
