// pages/lOrderDetail/lOrderDetail.js
const app = getApp();
let orderId, tempPrintOrderData;
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    totalGoods: 0,
    loaded: false,
    isvip: app.globalData.isVIP,
    loadingStatus: '努力加载中...',
    content: {},




    /*登陆者信息数据定义*/
    agentID: '', //后台查询到的净哥哥id

    /*打印数据定义*/
    //苹果-打印机name,安卓-deviceID
    printName: 'HM-A388_7FA0',
    deviceID: 'C0:15:83:3B:7F:A0',
    wAndnArr: [], //支持写和notify的主服务id和其对应的特征值的id

    //需要打印的数据
    printDataArr: [],
    printType: '', //打印类型，（1用户，2净哥哥，3店铺）

    //获取订单数据定义
    page: 1, //当前页码
    pageSize: 10, //每页显示数据量
    hasMoreData: true, //是否有更多的数据 ,true有
    contentlist: [], //获取到的(总的)数据列表

    /*其他数据定义*/
    getmore: -1, //当前详情点击下标
    system: '', //操作系统 (A代表android，I代表ios)
    State: false, //停止搜索后，强制关闭监听蓝牙状态
    connectState: false, //连接成功后打印机全局状态
    printingOrderId: '', //当前打印订单的单号（注：不是订单编号）
    latitude: '', //纬度
    longitude: '', //经度
    isEnd: false, //当前订单是否打印过（三种类型都完成）
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
      phoneNumber: this.data.content.getPhone
    });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.setData({
      statusMark: options.statusMark,
      printName: app.globalData.business.driveName,
      deviceID: app.globalData.business.driveId
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
            totalGoods = 0;
          for (let i = 0; i < data.goodsList.length; i++) {
            totalGoods += parseInt(data.goodsList[i].goodsNums);
          }

          this.setData({
            content: data,
            loaded: true,
            totalGoods
          });

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

  handleChangeStatus(e) {
    let data = e.target.dataset,
      cIndex = this.data.currentIndex,
      listsAll = this.data.listsAll;
    wx.showModal({
      content: data.msg,
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${app.globalData.api}/admin/changeOrderStatus`,
            data: {
              shopId: app.globalData.business.shopId,
              orderId: data.orderid,
              status: data.targetstatus
            },
            success: res => {
              console.log(res);
              if (res.data.status == 1) {
                app.globalData.refreshBusinessAdmin = true;
                wx.showToast({
                  title: '操作成功',
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
                  title: '操作失败',
                  icon: '../../assets/warning.png',
                  duration: 1500
                });
              }
            }
          });
        }
      }
    });
  },

  //生命周期函数--监听页面显示
  onShow: function() {
    // testData;
    if (app.globalData.connectedPrint && app.globalData.testData) {
      this.setData({
        /*登陆者信息数据定义*/
        agentID: app.globalData.testData.agentID, //后台查询到的净哥哥id

        /*打印数据定义*/
        //苹果-打印机name,安卓-deviceID
        printName: app.globalData.testData.printName,
        deviceID: app.globalData.testData.deviceID,
        wAndnArr: app.globalData.testData.wAndnArr, //支持写和notify的主服务id和其对应的特征值的id

        //需要打印的数据
        printDataArr: app.globalData.testData.printDataArr,
        printType: app.globalData.testData.printType, //打印类型，（1用户，2净哥哥，3店铺）

        //获取订单数据定义
        page: app.globalData.testData.page, //当前页码
        pageSize: app.globalData.testData.pageSize, //每页显示数据量
        hasMoreData: app.globalData.testData.hasMoreData, //是否有更多的数据 ,true有
        contentlist: app.globalData.testData.contentlist, //获取到的(总的)数据列表

        /*其他数据定义*/
        getmore: app.globalData.testData.getmore, //当前详情点击下标
        system: app.globalData.testData.system, //操作系统 (A代表android，I代表ios)
        State: app.globalData.testData.State, //停止搜索后，强制关闭监听蓝牙状态
        connectState: app.globalData.testData.connectState, //连接成功后打印机全局状态
        printingOrderId: app.globalData.testData.printingOrderId, //当前打印订单的单号（注：不是订单编号）
        latitude: app.globalData.testData.latitude, //纬度
        longitude: app.globalData.testData.longitude, //经度
        isEnd: app.globalData.testData.isEnd //当前订单是否打印过（三种类型都完成）
      });
    }
  },

  handleRePayment() {
    wx.navigateTo({
      url: '../laundryOrder/laundryOrder'
    });
  },


  //获取位置授权
  getLocation: function() {
    let _this = this;
    wx.getLocation({
      success: function(res) {
        //判断微信版本是否支持蓝牙
        if (!wx.openBluetoothAdapter) {
          wx.showModal({
            title: '闹心啊！',
            content: '当前微信版本过低，请升级后再使用',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                setTimeout(function() {
                  wx.reLaunch({
                    url: '../businessAdmin/businessAdmin'
                  });
                  return;
                }, 300);
              }
            }
          });
          return;
        } else {
          _this.getSystemInfo();
        }
      },
      fail(res) {
        wx.removeStorageSync("hasLoginInfo");
        wx.showModal({
          title: '请允许授权',
          content: '打印需要获取您的位置信息，请重新关注小程序并授权',
          showCancel: false,
          success: function(res) {

          },
        });
      }
    });
  },

  //获取手机型号信息，判断是iPhone还是android
  getSystemInfo: function() {
    let _this = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.errMsg == 'getSystemInfo:ok') {
          _this.data.system = res.system.substring(0, 1).toUpperCase();
          setTimeout(function() {
            wx.showLoading({
              title: '设备连接中...',
              mask:true
            });
            //开启蓝牙模块
            _this.startBtooth();
          }, 1000);
        }
      },
    });
  },


  /*蓝牙、打印程序  开始*/
  //蓝牙模块
  startBtooth: function() {
    let _this = this;

    //初始化蓝牙
    if (_this.data.State == false) {
      wx.openBluetoothAdapter({
        success: function(res) {
          //初始化蓝牙适配器成功
        },
        complete: function(res) {
          _this.getBlueState();
          //监听蓝牙适配器状态变化事件
          wx.onBluetoothAdapterStateChange(function(res) {
            console.log('------------------------');
            console.log(res);
            if (res.available) {
              wx.showLoading({
                title: '设备连接中...',
                mask:true
              });
              setTimeout(function() {
                _this.connect();
              }, 2000);
            } else {
              //蓝牙不可用,关闭蓝牙模块
              wx.showModal({
                title: '闹啥闹！',
                content: '蓝牙不可用，请手动开启蓝牙后，重启小程序试试！',
                showCancel: false,
                cancelText: '马上重启'
              });
              _this.closeBtooth();
            }
          });
        }
      });
    } else {
      //已找到目标设备
      _this.connect();
    }
  },

  //获取本机蓝牙适配器状态
  getBlueState: function() {
    var _this = this;
    wx.getBluetoothAdapterState({
      complete: function(res) {
        //蓝牙状态完成
        if (!!res && res.available) { //蓝牙可用
          if (_this.data.State == false) {
            _this.startSearch();
          }
        } else {
          wx.showLoading({
            title: '请开/重启蓝牙',
          });
          _this.data.State = false;
        }
      }
    });
  },

  //开始搜索蓝牙 ,注只找到目标设备
  startSearch: function() {
    let _this = this;
    let PdeviceID = _this.data.deviceID;
    let Pname = _this.data.printName;
    let system = _this.data.system;

    wx.startBluetoothDevicesDiscovery({
      success: function(res) {
        //搜索蓝牙,找到目标设备,关闭搜索，连接
        wx.onBluetoothDeviceFound(function(res) {
          let deviceId = res.devices[0].deviceId;
          let name = res.devices[0].name;
          switch (system) {
            case 'A':
              if (PdeviceID == deviceId) {
                //找到目标设备，连接中
                _this.stopSearch();
                setTimeout(function() {
                  _this.connect();
                }, 2000);
              }
              break;
            case 'I':
              if (Pname == name) {
                _this.data.deviceID = deviceId;
                //找到目标设备，连接中
                _this.stopSearch();
                setTimeout(function() {
                  _this.connect();
                }, 2000);
              }
              break;
            default:
              _this.alertInfo("暂不支持除Android和ios以外系统");
              _this.closeBtooth();
              break;
          }
        });
      }
    });
  },

  //停止搜索蓝牙
  stopSearch: function() {
    let _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        //找到目标设备，停止搜索
        _this.data.State = true;
      },
    });
  },

  //连接目标蓝牙
  connect: function() {
    let _this = this;
    let deviceId = _this.data.deviceID;
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function(res) {
        console.log('connect success');
        console.log(res);
        _this.getAllService();
        setTimeout(function() {
          _this.data.connectState = true;
          wx.hideLoading();
          setTimeout(function() {
            _this.alertInfo("设备连接成功");
            app.globalData.connectedPrint = true;
            app.globalData.testData = {
              /*登陆者信息数据定义*/
              agentID: _this.data.agentID, //后台查询到的净哥哥id

              /*打印数据定义*/
              //苹果-打印机name,安卓-deviceID
              printName: _this.data.printName,
              deviceID: _this.data.deviceID,
              wAndnArr: _this.data.wAndnArr, //支持写和notify的主服务id和其对应的特征值的id

              //需要打印的数据
              printDataArr: _this.data.printDataArr,
              printType: _this.data.printType, //打印类型，（1用户，2净哥哥，3店铺）

              //获取订单数据定义
              page: _this.data.page, //当前页码
              pageSize: _this.data.pageSize, //每页显示数据量
              hasMoreData: _this.data.hasMoreData, //是否有更多的数据 ,true有
              contentlist: _this.data.contentlist, //获取到的(总的)数据列表

              /*其他数据定义*/
              getmore: _this.data.getmore, //当前详情点击下标
              system: _this.data.system, //操作系统 (A代表android，I代表ios)
              State: _this.data.State, //停止搜索后，强制关闭监听蓝牙状态
              connectState: _this.data.connectState, //连接成功后打印机全局状态
              printingOrderId: _this.data.printingOrderId, //当前打印订单的单号（注：不是订单编号）
              latitude: _this.data.latitude, //纬度
              longitude: _this.data.longitude, //经度
              isEnd: _this.data.isEnd //当前订单是否打印过（三种类型都完成）
            };
            // setTimeout(function() {
            //   wx.showLoading({
            //     title: '订单获取中...',
            //     success: function() {
            //       _this.getOrderList();
            //     }
            //   })
            // }, 2000);
          }, 100);
        }, 1000);
      },
      fail(res) {
        console.log('connect fail');
        console.log(res);
        _this.onBLEConnectionError();
      },
    });
  },

  //获取所有服务
  getAllService: function() {
    let _this = this;
    let deviceId = _this.data.deviceID;
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function(res) {
        console.log('get success');
        console.log(res);
        //过滤主服务（支持write、notify/indicate）
        let services = res.services;
        services.forEach(function(value) {
          if (value.isPrimary == true) {
            _this.getUUID(deviceId, value.uuid);
          }
        });
      },
    });
  },

  //获取某个主服务下属特征值
  getUUID: function(dId, sId) {
    let _this = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: dId,
      serviceId: sId,
      success: function(res) {
        let services = res.characteristics;
        services.forEach(function(value) {
          let notify = value.properties.notify;
          let write = value.properties.write;
          if (notify == true && write == true) {
            _this.data.wAndnArr.push({ "uuid": sId, "characteristicId": value.uuid });
          }
        });
      },
    });
  },

  //监听连接错误事件
  onBLEConnectionError: function() {
    let _this = this;
    let deviceId = _this.data.deviceID;
    wx.onBLEConnectionStateChange(function(res) {
      if (res.deviceId == '') {
        wx.showLoading({
          title: '失去目标设备',
        });
        app.globalData.connectedPrint = false;
      } else if (res.connected == false) {
        wx.showLoading({
          title: '重连中...',
          mask:true
        });
        _this.connect();
      }
    });
  },

  //断开连接
  unconnect: function() {
    let _this = this;
    let deviceId = _this.data.deviceID;
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function(res) {
        //断开连接成功
        app.globalData.connectedPrint = false;
      },
      complete: function(res) {
        _this.data.State = false;
      }
    });
  },

  //关闭蓝牙模块
  closeBtooth: function() {
    wx.closeBluetoothAdapter({
      success: function(res) {
        //关闭蓝牙成功
        app.globalData.connectedPrint = false;
      }
    });
  },

  //打印
  print: function() {
    let _this = this;
    let printData = _this.data.printDataArr;

    if (_this.data.connectState == false) {
      _this.onBLEConnectionError();
      return;
    } else {
      if (!printData) {
        _this.alertInfo("没有需要打印的数据");
        return;
      }
      //弹出确认框
      wx.showModal({
        title: '确认打印',
        content: '当前打印订单单号为：' + _this.data.printingOrderId,
        success: function(res) {
          if (res.confirm) {
            //用户点击确定
            //开始打印
            _this.startPrint();
            wx.showLoading({
              title: '打印中...',
              mask:true
            });
          } else if (res.cancel) {
            //用户点击取消
          }
        }
      });
    }
  },

  //开启notify，写入数据并打印，监听返回值
  /*
   * deviceId 蓝牙设备的deviceid
   * data 内含同时支持write和notify 的主服务uuid和其特征值id
   * printData  需要打印的数据，base64格式, 由接口调用处传入
   *
   */
  startPrint: function(writeNum) {
    let _this = this;
    let deviceId = _this.data.deviceID;
    let printData = _this.data.printDataArr;
    let serviceId = _this.data.wAndnArr[0].uuid;
    let characteristicId = _this.data.wAndnArr[0].characteristicId;
    if (writeNum == null) {
      var writeNum = 0;
    }

    //开启notify
    wx.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      state: true,
      success: function(res) {
        let arrayBuffer = wx.base64ToArrayBuffer(printData[writeNum]);
        setTimeout(function() {
          wx.writeBLECharacteristicValue({
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: characteristicId,
            value: arrayBuffer,
            success: function(res) {
              //写入成功
              writeNum++;
              if (writeNum < printData.length) {
                _this.startPrint(writeNum);
              } else {
                wx.onBLECharacteristicValueChange(function(res) {
                  if (res.deviceId == deviceId) {
                    let data = [];

                    data.push({ "printType": _this.data.printType }); //订单打印时间
                    data.push({ "latitude": _this.data.latitude });
                    data.push({ "longitude": _this.data.longitude });
                    data.push({ "agentID": _this.data.agentID }); //净哥哥id
                    data.push({ "orderID": _this.data.printingOrderId }); //单号orderid

                    _this.printSuccess(data);
                  }
                });
              }
            },
            fail(res) {
              //打印失败
              wx.hideLoading();
              wx.showModal({
                title: '打印失败',
                content: '请重试，如再次失败，请重启小程序',
                showCancel: false,
                cancelText: '确定'
              });
            },
          });
        }, 1500);
      }
    });
  },

  /*  打印、返回
   *
   * data array 打印结束向服务器提交成功数据：
   *            含：当前票据打印地址（经纬度）、打印单号（orderID）、打印者（净哥哥id）、订单打印时间
   *
   */
  printSuccess: function(data) {
    //打印失败
    wx.hideLoading();
    this.handleChangeStatus(tempPrintOrderData);
    wx.showToast({
      title: '打印成功',
      image: '../../assets/success.png',
      duration: 1500
    });
  },
  /*蓝牙、打印程序  结束*/

  /*页面函数  开始*/
  //①弹出提示框显示信息（2秒后自动关闭该提示）函数
  // param text string 需要显示的提示信息，（手机界面有限，长度为2-6个字符最佳）
  alertInfo: function(text) {
    wx.showToast({
      title: text,
      duration: 2000,
    });
    setTimeout(function() {
      wx.hideToast();
    }, 2000);
  },

  //连接打印机
  handleConnectPrientDev() {
    wx.showLoading({ title: '开始连接', mask: true });
    this.getLocation();
  },


  //打印订单
  handlePrintLaundryOrder(e) {
    let _this = this;
    if (!app.globalData.connectedPrint) {
      wx.showModal({
        title: '温馨提示!',
        content: '打印订单需要先连接打印机',
        confirmText: '立即连接',
        success: (res) => {
          if (res.confirm) {
            this.handleConnectPrientDev();
          }
        }
      });
    } else {
      tempPrintOrderData = {};
      let data = e.target.dataset;
      tempPrintOrderData = {
        target: {
          dataset: {
            msg: data.msg,
            targetstatus: data.targetstatus,
            orderid: data.orderid
          }
        }
      };
      console.log(data);
      _this.data.connectState = true;
      wx.showLoading({ title: '数据获取中', mask: true });
      wx.request({
        url: `${app.globalData.api}/admin/printOrder`,
        data: {
          shopId: app.globalData.business.shopId,
          orderId: data.orderid
        },
        success: res => {
          console.log(res);
          let printDataArr = [];
          printDataArr.push(res.data.data.clientBill);
          printDataArr.push(...res.data.data.agentBill);
          printDataArr.push(...res.data.data.storeBill);
          this.setData({
            printDataArr,
            printingOrderId: data.orderid
          });
          this.print();
        }
      });
    }

  }
});
