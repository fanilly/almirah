// components/lorder/lorder.js
import changeOrderStatus from '../../request/changeOrderStatus.js';
const app = getApp();
let shopId, flag;
Component({
  properties: {
    // 订单列表渲染状态
    hasOrderList: {
      type: Number,
      value: 1 //1.加载中 2.隐藏 3.无订单数据
    },

    isvip: {
      type: Boolean,
      value: false
    },

    //订单列表数据
    lists: {
      type: Array,
      value: []
    },

    //页面导航条标题
    navTitle: {
      type: String,
      value: '衣橱'
    }
  },

  data: {
    chooseList: [], //选择出售的订单列表
    isShowChooseGoods: false //是否显示选择出售
  },

  methods: {
    //阻止冒泡
    handleStopPropagation() {
      console.log('stop propagation');
    },

    //去评价
    handleGoEvaluate(e) {
      let orderId = e.currentTarget.dataset.order;
      wx.navigateTo({
        url: `../evaluate/evaluate?orderId=${orderId}`
      });
    },

    //确认收货
    handleConfirm(e) {
      wx.showModal({
        content: '确认收货',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading();
            let id = e.currentTarget.id;
            changeOrderStatus(this, id, 2);
          }
        }
      });
    },

    //handleUrge 催促取衣
    handleUrge(e) {
      wx.showLoading({ title: '催促中', mask: true });
      wx.request({
        url: `${app.globalData.api}/message/send_message`,
        data: {
          userId: app.globalData.userID,
          shopId: e.currentTarget.dataset.shopid,
          msgContent: `编号为${app.globalData.userID}的用户催促编号为：${e.currentTarget.dataset.orderid}的订单速度取衣`
        },
        success: res => {
          console.log(res);
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showToast({
              title: `催促成功`,
              icon: 'success',
              duration: 1500
            });
          } else {
            wx.showToast({
              title: `催促失败`,
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

    //点击删除按钮删除订单
    handleDelOrder(e) {
      wx.showModal({
        content: '删除订单',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading();
            let id = e.currentTarget.id;
            changeOrderStatus(this, id, 1);
          }
        }
      });
    },

    // 点击商品跳转出售页面
    handleGoToSell(e) {
      let id = e.currentTarget.id,
        item = this.data.chooseList[id],
        goodsID = item.goodsId,
        ID = item.id;
      this.setData({
        isShowChooseGoods: false
      });
      wx.navigateTo({
        url: `../sell/sell?goodsID=${goodsID}&ID=${ID}&shopID=${shopId}&flag=${flag}`
      });
    },

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
                  wx.redirectTo({
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

    //点击出售时改变标题栏标题
    handleCloseChooseGoods() {
      wx.setNavigationBarTitle({
        title: this.data.navTitle
      });
      this.setData({
        isShowChooseGoods: false
      });
    },

    //选择衣物进行出售
    handleCheckSell(e) {
      let id = e.currentTarget.id,
        list = this.data.lists[id].list;
      flag = e.currentTarget.dataset.flag;

      //api工程师要求需要shopId
      shopId = this.data.lists[id].shopId;
      //如果本订单的商品个数为1 直接去储藏或出售
      if (list.length == 1) {
        wx.navigateTo({
          url: `../sell/sell?goodsID=${list[0].goodsId}&ID=${list[0].id}&shopID=${shopId}&flag=${flag}`
        });
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
  }
});
