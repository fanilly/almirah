// pages/helpsArticle1/helpsArticle1.js
import WxParse from '../../wxParse/wxParse.js';
const app = getApp();
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    content: null
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

  // 生命周期函数--监听页面加载
  onLoad(options) {
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: `${app.globalData.api}/common/articleInfo`,
      data: {
        articleId: options.articleId
      },
      success: res => {
        wx.hideLoading();
        let article = res.data.data.articleContent;
        WxParse.wxParse('article', 'html', article, this, 5);
        this.setData({
          content: res.data.data
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '网络繁忙！',
          image: '../../assets/warning.png',
          duration: 2000
        });
      }
    });
    // let article = res.data.goodsDesc;
    // WxParse.wxParse('article', 'html', article, this, 5);
  }
});
