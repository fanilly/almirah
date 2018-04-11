let timer, //定时器
  timediff = 5, //每次获取验证码的时间间隔
  phoneNumber; //当前输入的手机号
const app = getApp();
Page({
  data: {
    being: false, //记录获取验证码的状态 如果为真 代表正在获取
    time: 90, //倒计时
    phone: '',
    placeholder: '请输入手机号',
    isFocus: false
  },

  onLoad(options) {
    this.setData({
      phone: app.globalData.commission.phone
    });
    if (this.data.phone) {
      this.setData({
        placeholder: app.globalData.commission.phone
      });
      wx.setNavigationBarTitle({
        title: '更换手机号'
      });
    }
  },

  //记录手机号
  recordPhoneNumber(e) {
    phoneNumber = e.detail.value;
  },

  //表单提交事件
  formSubmit(e) {
    let self = this,
      data = e.detail.value;
    wx.showLoading({
      title: '提交中'
    });
    //绑定手机号
    wx.request({
      url: `${app.globalData.api}/user/mobile`,
      data: {
        userid: app.globalData.userID,
        mobile: data.phonenumber,
        passcode: data.verfcode
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data == 1) {
          app.globalData.commission.phone = data.phonenumber;
          //绑定成功
          wx.showToast({
            title: this.data.phone ? '更换成功' : '绑定成功',
            image: '../../assets/success.png',
            duration: 1500
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 600);
        } else if (res.data == 0) {
          wx.showToast({
            title: '验证码不正确',
            image: '../../assets/warning.png',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: res.data,
            image: '../../assets/warning.png',
            duration: 1500
          });
        }
      }
    });
  },

  //绑定倒计时事件
  handleGetVerf() {
    let self = this;
    if (!this.data.being) {
      //验证手机号码是否正确
      if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(phoneNumber))) {
        wx.showModal({
          title: '温馨提示！',
          showCancel: false,
          content: '请输入正确的手机号',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                isFocus: true
              });
            }
          }
        });
      } else if (phoneNumber == this.data.placeholder) {
        wx.showModal({
          showCancel: false,
          content: '不能绑定相同的手机号',
          success: function(res) {
            if (res.confirm) {
              self.setData({
                isFocus: true
              });
            }
          }
        });
      } else {
        //显示倒计时
        this.setData({
          being: true
        });

        // 发送获取验证码请求
        console.log(phoneNumber);
        wx.request({
          url: `${app.globalData.api}/user/get_yzm`,
          data: {
            mobile: phoneNumber
          },
          success: res => {
            console.log(res);
          }
        });

        //开始倒计时
        timer = setInterval(function() {
          let tempTime = self.data.time;
          if (tempTime == 0) {
            //倒计时结束
            clearInterval(timer);
            self.setData({
              being: false,
              time: timediff
            });
            return;
          }
          self.setData({
            time: tempTime - 1
          });
        }, 1000);
      }
    }
  }
});
