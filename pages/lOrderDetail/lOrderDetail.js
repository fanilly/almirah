// pages/lOrderDetail/lOrderDetail.js
const app = getApp();
let shopId, flag, orderId, timer, passTime;
Page({
  data: {
    showTime: false,
    time: '',
    msg: '',
    baseUrl: app.globalData.baseUrl,
    totalGoods: 0,
    loaded: false,
    isvip: app.globalData.isVIP,
    loadingStatus: '努力加载中...',
    content: {}
  },

  //定位
  handleGoMap(e) {
    let rel = e.currentTarget.dataset;
    if (rel == 1) {
      wx.openLocation({
        latitude: parseFloat(this.data.content.userLatitude),
        longitude: parseFloat(this.data.content.userLongitude),
        scale: 18
      });
    } else {
      wx.openLocation({
        latitude: parseFloat(this.data.content.latitude),
        longitude: parseFloat(this.data.content.longitude),
        scale: 18
      });
    }
  },

  //打电话给商家
  handleCallTel(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.content.shopTel
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      isVIP: app.globalData.isVIP
    });
    console.log(options.orderId);
    wx.request({
      url: `${app.globalData.api}/order/order_info`,
      data: {
        orderId: options.orderId
      },
      success: res => {
        console.log(res);
        if (res.data.status == 1) {
          let data = res.data.data,
            i = 0,
            totalGoods = 0,
            msg = '';
          for (let i = 0; i < data.goodsList.length; i++) {
            totalGoods += parseInt(data.goodsList[i].goodsNums);
          }
          passTime = res.data.data.passTime * 1;
          if (data.Status == 0) {
            if (data.passTime <= 1800) {
              data.orderStatus = '未付款';
            } else {
              data.orderStatus = '交易关闭';
              msg = '交易已关闭 请重新下单';
            }
          } else if (data.Status == 1 || data.Status == 2) {
            data.orderStatus = '未取货';
            msg = '支付成功  已通知商家上门取件';
          } else if (data.Status >= 3 && content.Status <= 7) {
            data.orderStatus = '待收货';
            msg = '衣物清洗中   请耐心等待';
          } else if (data.Status == 8) {
            data.orderStatus = '待评价';
            msg = '感谢您对净衣客的支持，欢迎再次下单！';
          } else if (data.Status == 9) {
            data.orderStatus = '交易完成';
            msg = '感谢您对净衣客的支持，欢迎再次下单！';
          }

          if (passTime > 1800) {
            this.setData({
              showTime: false
            });
          } else {
            let time = `等待买家付款 剩余 ${Math.floor((1800-passTime)/60)} 分 ${(1800-passTime)%60} 秒 订单自动关闭`;
            this.setData({ time });
          }

          this.setData({
            showTime: passTime > 1800 ? false : data.Status == 0 ? true : false,
            content: data,
            loaded: true,
            totalGoods,
            msg
          });



          if (passTime <= 1800) {
            timer = setInterval(() => {
              passTime++;
              if (passTime > 1800) {
                let content = this.data.content;
                content.orderStatus = '交易关闭';
                this.setData({
                  showTime: false,
                  msg: '交易已关闭 请重新下单',
                  content
                });
                clearInterval(timer);
              } else {
                let time = `等待买家付款 剩余 ${Math.floor((1800-passTime)/60)} 分 ${(1800-passTime)%60} 秒 订单自动关闭`;
                this.setData({ time });
              }
            }, 1000);
          }


          console.log(this.data.content)

        } else {
          this.setData({
            loadingStatus: '网络异常~~'
          });
        }
      },
      fail: () => {
        this.setData({
          loadingStatus: '网络异常~~'
        });
      }
    });
  },

  //生命周期函数--监听页面显示
  onShow: function() {

  },

  handleRePayment() {
    wx.navigateTo({
      url: '../laundryOrder/laundryOrder'
    });
  },

  //立即付款
  handlePayment(e) {
    wx.request({
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      url: `${app.globalData.api}/buy/reBuy`,
      data: {
        userId: app.globalData.userID,
        orderId: e.currentTarget.dataset.orderid
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        let data = res.data;
        wx.requestPayment({
          timeStamp: data.timeStamp.toString(),
          nonceStr: data.nonceStr,
          paySign: data.paySign,
          package: data.package,
          signType: 'MD5',
          success: res => {
            console.log(res);
            if (res.errMsg == 'requestPayment:ok') {
              wx.showToast({
                title: '下单成功',
                icon: 'success',
                duration: 1500
              });
              app.globalData.updateAlmirah = true;
              setTimeout(() => {
                wx.navigateTo({
                  url: `../success/success?type=laundry&orderId=${data.orderId}&createTime=${data.creatime}`
                });
              }, 800);
            } else {
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }

          },
          fail: res => {
            console.log(res);
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '取消支付',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      },
      fail() {
        wx.showToast({
          title: '网络异常',
          image: '../../assets/warning.png',
          duration: 1500
        });
      }
    });
  },

  //去评价
  handleGoEvaluate(e) {
    let orderId = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: `../evaluate/evaluate?orderId=${orderId}`
    });
  },

  // 点击商品跳转出售页面
  handleGoToSell(e) {
    let id = e.currentTarget.id,
      item = this.data.content.goodsList[id],
      goodsID = item.goodsId,
      ID = item.id;
    this.setData({
      isShowChooseGoods: false
    });
    if (orderId) {
      wx.navigateTo({
        url: `../sell/sell?goodsID=${goodsID}&ID=${ID}&shopID=${shopId}&flag=${flag}&orderId=${orderId}`
      });
    } else {
      wx.navigateTo({
        url: `../sell/sell?goodsID=${goodsID}&ID=${ID}&shopID=${shopId}&flag=${flag}`
      });
    }
  },

  //确认收货
  handleConfirm(e) {
    wx.showModal({
      content: '确认收货',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: `${app.globalData.api}/order/order_status`,
            data: {
              orderId: e.currentTarget.dataset.orderid,
              orderMark: 'Confirm'
            },
            success: res => {
              if (res.data == 1) { // 收货成功
                //隐藏加载层并提示收货成功
                wx.hideLoading();
                wx.showToast({
                  title: '已收货',
                  image: '../../assets/success.png',
                  duration: 1500
                });

                app.globalData.updateAlmirah = true;

                setTimeout(() => {
                  wx.switchTab({ url: '../almirah/almirah' });
                }, 500);

              } else { //收货失败
                //收货失败 隐藏加载动画并提示收货失败
                wx.hideLoading();
                wx.showToast({
                  title: '收货失败',
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }
            },
            fail() {
              //主观认为请求发送失败为网络异常
              wx.hideLoading();
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
  },

  //点击删除按钮删除订单
  handleDelOrder(e) {
    wx.showModal({
      content: '删除订单',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: `${app.globalData.api}/order/order_status`,
            data: {
              orderId: e.currentTarget.dataset.orderid,
              orderMark: 'Delete'
            },
            success: res => {
              if (res.data == 1) { //删除成功
                //隐藏加载层并提示删除成功
                wx.hideLoading();
                wx.showToast({
                  title: '删除成功',
                  image: '../../assets/success.png',
                  duration: 1500
                });

                app.globalData.updateAlmirah = true;

                setTimeout(() => {
                  wx.switchTab({ url: '../almirah/almirah' });
                }, 500);

              } else {
                //删除失败 隐藏加载动画并提示删除失败
                wx.hideLoading();
                wx.showToast({
                  title: '删除失败',
                  image: '../../assets/warning.png',
                  duration: 1500
                });
              }
            },
            fail() {
              //主观认为请求发送失败为网络异常
              wx.hideLoading();
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
  },

  //handleUrge 催促取衣
  handleUrge(e) {
    wx.showLoading({ title: '提醒中', mask: true });
    wx.request({
      url: `${app.globalData.api}/message/send_message`,
      data: {
        userId: app.globalData.userID,
        shopId: e.currentTarget.dataset.shopid,
        msgContent: `编号为${app.globalData.userID}的用户催促编号为：${e.currentTarget.dataset.orderid}的订单速度取件`
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.status == 1) {
          wx.showToast({
            title: `提醒成功`,
            icon: 'success',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: `提醒失败`,
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
  },

  //点击出售时改变标题栏标题
  handleCloseChooseGoods() {
    wx.setNavigationBarTitle({
      title: '商品详情'
    });
    this.setData({
      isShowChooseGoods: false
    });
  },

  //选择衣物进行出售
  handleCheckSell(e) {
    let id = e.currentTarget.id,
      list = this.data.content.goodsList;
    flag = e.currentTarget.dataset.flag;
    orderId = e.currentTarget.dataset.orderid || false;
    console.log(flag);

    //api工程师要求需要shopId
    shopId = this.data.content.shopId;
    //如果本订单的商品个数为1 直接去储藏或出售
    if (list.length == 1) {
      if (orderId) {
        wx.navigateTo({
          url: `../sell/sell?goodsID=${list[0].goodsId}&ID=${list[0].id}&shopID=${shopId}&flag=${flag}&orderId=${orderId}`
        });
      } else {
        wx.navigateTo({
          url: `../sell/sell?goodsID=${list[0].goodsId}&ID=${list[0].id}&shopID=${shopId}&flag=${flag}`
        });
      }
    } else {
      //改变标题栏
      wx.setNavigationBarTitle({
        title: '选择出售商品'
      });
      console.log(list);
      //记录选择出售的数据
      this.setData({
        chooseList: list,
        isShowChooseGoods: true
      });
    }

  },
});
