module.exports = (fn) => {
  wx.login({
    success: res => {
      wx.getUserInfo({
        success: res => {
          let userInfo = res.userInfo;
          fn(userInfo);
        },
        fail() {
          console.log('getUserInco fail');
        }
      });
    }
  });
};
