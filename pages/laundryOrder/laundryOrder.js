// pages/laundryOrder/laundryOrder.js
const app = getApp(),
  api = app.globalData.api;
let trolley = []; //购物车数据
Page({

  data: {
    isShowAllClass: false,
    baseUrl: '',
    scrollLeft: 0,
    loaded: false, //加载完毕
    isShowTrolley: false, // 是否显示购物车内容编辑模块
    trolleyContent: [], //购物车中的数据
    totalPrice: 0, //购物车中的商品总价
    totalTrolley: 0, //购物车中的商品数量
    curIndex: 0, //当前选中的服饰类型
    datas: [], //所有数据
    lists: [] //当前选中类型的数据
  },

  //阻止时间冒泡
  handleStopPropagation() {

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

  // 去结算
  handleGoSettlement() {
    if (this.data.totalTrolley <= 0) {
      wx.showModal({
        content: '您还没有选择商品呦！'
      });
    } else {
      wx.navigateTo({
        url: '../laundrySettlement/laundrySettlement'
      });
    }
  },

  //关闭购物车内容编辑模块
  handleCloseTrolley(e) {
    this.setData({
      isShowTrolley: false
    });
  },

  //显示购物车内容编辑模块
  handleShowTrolley() {
    this.setData({
      isShowTrolley: true
    });
  },

  // 头部按钮点击事件
  handleCheckoutType(e) {
    let id = parseInt(e.target.id);
    console.log(id);
    this.setData({
      curIndex: id,
      isShowAllClass: false,
      lists: this.data.datas[id].children
    });

    if (id * 1 >= 7) {
      this.setData({
        scrollLeft: 500
      });
    } else if (id * 1 >= 4) {
      this.setData({
        scrollLeft: 300
      });
    }


  },

  // 产品列表中的加号点击事件
  handleAddProduct(e) {
    let i, id = e.currentTarget.id,
      lists = this.data.lists,
      datas = this.data.datas,
      goods = lists[id], //当前商品
      totalPrice = parseFloat(this.data.totalPrice) + parseFloat(goods.price),
      flag = true; //真表示购物车中没有当前商品

    //检查购物车中是否已存在此商品
    //如果存在 添加商品个数
    //如果不存在 将商品加入
    for (i = 0; i < trolley.length; i++) {
      if (goods.catId == trolley[i].catId) {
        trolley[i].total = trolley[i].total + 1;
        lists[id].total = trolley[i].total;
        datas[this.data.curIndex].children[id].total = trolley[i].total;
        flag = false;
        break;
      }
    }

    if (flag) {
      console.log('------------------------------')
      goods.total = 1;
      trolley.push(goods);
      lists[id].total = 1;
      datas[this.data.curIndex].children[id].total = 1;
    }
    this.setData({ lists, datas });

    //更新storage中的购物车数据
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });

    //更新页面展示的购物车数量总价列表数据
    this.setData({
      totalTrolley: this.data.totalTrolley + 1,
      totalPrice: totalPrice.toFixed(2),
      trolleyContent: trolley
    });
  },

  //+
  handleJiaProduct(e) {
    let i, id = e.currentTarget.id,
      lists = this.data.lists,
      datas = this.data.datas,
      goods = lists[id], //当前商品
      totalPrice = parseFloat(this.data.totalPrice) + parseFloat(goods.price);

    for (i = 0; i < trolley.length; i++) {
      if (goods.catId == trolley[i].catId) {
        trolley[i].total = trolley[i].total + 1;
        lists[id].total = trolley[i].total;
        datas[this.data.curIndex].children[id].total = trolley[i].total;
        break;
      }
    }

    this.setData({ lists, datas });

    //更新storage中的购物车数据
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });

    //更新页面展示的购物车数量总价列表数据
    this.setData({
      totalTrolley: this.data.totalTrolley + 1,
      totalPrice: totalPrice.toFixed(2),
      trolleyContent: trolley
    });
  },

  //-
  handleJianProduct(e) {
    let i, id = e.currentTarget.id,
      lists = this.data.lists,
      datas = this.data.datas,
      goods = lists[id], //当前商品
      totalPrice = parseFloat(this.data.totalPrice) - parseFloat(goods.price);

    for (i = 0; i < trolley.length; i++) {
      if (goods.catId == trolley[i].catId) {
        if (trolley[i].total <= 1) {
          trolley.splice(i, 1);
          lists[id].total = 0;
          datas[this.data.curIndex].children[id].total = 0;
        } else {
          trolley[i].total = trolley[i].total - 1;
          lists[id].total = trolley[i].total;
          datas[this.data.curIndex].children[id].total = trolley[i].total;
        }
        break;
      }
    }

    this.setData({ lists, datas });

    //更新storage中的购物车数据
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });

    //更新页面展示的购物车数量总价列表数据
    this.setData({
      totalTrolley: this.data.totalTrolley - 1,
      totalPrice: totalPrice.toFixed(2),
      trolleyContent: trolley
    });
  },

  //减少商品
  handleReduceProductNumber(e) {
    let id = parseInt(e.currentTarget.id),
      trolleyContent = this.data.trolleyContent,
      datas = this.data.datas,
      lists = this.data.lists,
      totalPrice = parseFloat(this.data.totalPrice) - parseFloat(trolleyContent[id].price);

    for (let h = 0; h < datas.length; h++) {
      for (let i = 0; i < datas[h].children.length; i++) {
        if (datas[h].children[i].catId == trolleyContent[id].catId) {
          datas[h].children[i].total = datas[h].children[i].total - 1;
          lists = datas[this.data.curIndex].children;
        }
      }
    }
    this.setData({ datas, lists });

    //如果所减商品的原有数量为1 直接删除该商品
    //否则商品的数量减1
    if (trolleyContent[id].total <= 1) {
      trolleyContent.splice(id, 1);
      this.setData({
        trolleyContent: trolleyContent,
        totalTrolley: this.data.totalTrolley - 1,
        totalPrice: totalPrice.toFixed(2)
      });
    } else {
      trolleyContent[id].total = trolleyContent[id].total - 1;
      this.setData({
        trolleyContent: trolleyContent,
        totalTrolley: this.data.totalTrolley - 1,
        totalPrice: totalPrice.toFixed(2)
      });
    }

    if (this.data.totalTrolley < 1) {
      this.setData({
        isShowTrolley: false
      });
    }

    //更新storage中的购物车数据
    trolley = trolleyContent;
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });
  },

  //添加商品
  handleAddProductNumber(e) {
    let id = parseInt(e.currentTarget.id),
      trolleyContent = this.data.trolleyContent,
      datas = this.data.datas,
      lists = this.data.lists,
      totalPrice = parseFloat(this.data.totalPrice) + parseFloat(trolleyContent[id].price);
    trolleyContent[id].total = trolleyContent[id].total + 1;

    for (let h = 0; h < datas.length; h++) {
      for (let i = 0; i < datas[h].children.length; i++) {
        if (datas[h].children[i].catId == trolleyContent[id].catId) {
          datas[h].children[i].total = datas[h].children[i].total + 1;
          lists = datas[this.data.curIndex].children;
        }
      }
    }

    //更新页面显示的购物车数据
    this.setData({
      trolleyContent: trolleyContent,
      totalTrolley: this.data.totalTrolley + 1,
      totalPrice: totalPrice.toFixed(2),
      datas,
      lists
    });

    //更新storage中的购物车数据
    trolley = trolleyContent;
    wx.setStorage({
      key: 'laundryTrolley',
      data: JSON.stringify(trolley)
    });
  },

  onShow() {
    console.log('--------');
    trolley = [];
    //从storage中获取购物车数据
    wx.getStorage({
      key: 'laundryTrolley',
      success: res => {
        // 首先将购物车中获取的数据字符串转换为json
        // 然后记录购物车中商品数量及总价
        trolley = JSON.parse(res.data) || [];
        console.log(trolley);
        let i, totalTrolley = 0,
          totalPrice = 0;
        for (i = 0; i < trolley.length; i++) {
          totalTrolley += parseInt(trolley[i].total);
          totalPrice += parseInt(trolley[i].total) * parseFloat(trolley[i].price);
        }
        this.setData({
          totalTrolley: totalTrolley,
          totalPrice: totalPrice.toFixed(2),
          trolleyContent: trolley
        });

        console.log('++++++++++++++++++++++++++++++++++++')
        console.log(totalTrolley);
        console.log('++++++++++++++++++++++++++++++++++++')


        console.log('----');


      },
      fail: () => {
        //如果结算返回 初始化页面显示的数据
        console.log('已结算 开始初始化页面数据');
        if (this.data.datas.length) {

          let datas = this.data.datas;
          for (let h = 0; h < datas.length; h++) {
            for (let j = 0; j < datas[h].children.length; j++) {
              datas[h].children[j].total = 0;
            }
          }
          this.setData({
            datas: datas,
            lists: datas[this.data.curIndex].children
          });
        }
        this.setData({
          totalTrolley: 0,
          totalPrice: 0,
          trolleyContent: []
        });
      }
    });
  },

  //显示所有分类
  handleShowAllClass() {
    this.setData({
      isShowAllClass: !this.data.isShowAllClass
    });
  },

  // 清空购物车
  clearTrolley(e) {
    wx.showModal({
      content: '您确定要清空购物车吗？购物车一旦被清空将无法找回',
      success: res => {
        //如果点击确定 清楚缓存并清楚数据模型中的数据
        if (res.confirm) {
          wx.removeStorage({
            key: 'laundryTrolley',
            success: res => {
              trolley = [];
              let datas = this.data.datas,
                lists = this.data.lists;
              for (let h = 0; h < datas.length; h++) {
                for (let i = 0; i < datas[h].children.length; i++) {
                  datas[h].children[i].total = 0;
                }
              }
              this.setData({
                isShowTrolley: false,
                trolleyContent: [],
                totalPrice: 0,
                totalTrolley: 0,
                datas: datas,
                lists: datas[this.data.curIndex].children
              });
              //弹出提示
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1500
              });
            }
          });
        }
      }
    });
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    const curType = options.type;
    //绑定baseUrl
    this.setData({
      baseUrl: app.globalData.baseUrl
    });

    //从storage中获取购物车数据
    // wx.getStorage({
    //   key: 'laundryTrolley',
    //   success: res => {
    //     // 首先将购物车中获取的数据字符串转换为json
    //     // 然后记录购物车中商品数量及总价
    //     trolley = JSON.parse(res.data) || [];
    //     let i, totalTrolley = 0,
    //       totalPrice = 0;
    //     for (i = 0; i < trolley.length; i++) {
    //       totalTrolley += parseInt(trolley[i].total);
    //       totalPrice += parseInt(trolley[i].total) * parseFloat(trolley[i].price);
    //     }
    //     this.setData({
    //       totalTrolley: totalTrolley,
    //       totalPrice: totalPrice.toFixed(2),
    //       trolleyContent: trolley
    //     });
    //   }
    // });

    //获取商品数据
    wx.request({
      url: `${api}/common/get_goods_cate?city=${app.globalData.city}`,
      success: res => {
        console.log(res.data);
        this.setData({
          datas: res.data || [],
          lists: res.data[0].children || [],
          loaded: true
        });

        let datas = res.data,
          lists = this.data.lists;


        //从storage中获取购物车数据
        wx.getStorage({
          key: 'laundryTrolley',
          success: res => {
            // 首先将购物车中获取的数据字符串转换为json
            let trolleys = JSON.parse(res.data) || [];
            console.log(trolleys);
            for (let h = 0; h < datas.length; h++) {
              for (let i = 0; i < datas[h].children.length; i++) {
                datas[h].children[i].total = 0;
                for (let j = 0; j < trolley.length; j++) {
                  if (datas[h].children[i].catId == trolley[j].catId) {
                    datas[h].children[i].total = trolley[j].total;
                  }
                }
              }
            }
            this.setData({
              datas: datas,
              lists: datas[0].children
            });
          },
          fail: err => {
            for (let h = 0; h < datas.length; h++) {
              for (let i = 0; i < datas[h].children.length; i++) {
                datas[h].children[i].total = 0;
              }
            }
            this.setData({
              datas: datas,
              lists: datas[0].children
            });
          }
        });

        if (curType) {
          this.setData({
            curIndex: curType,
            lists: this.data.datas[curType].children
          });
          if (curType * 1 >= 4) {
            this.setData({
              scrollLeft: 300
            });
          }
        }
      }
    });
  }
});
