// pages/sell/sell.js
const app = getApp();
import { formatDate } from '../../utils/util.js';
import updateImages from '../../request/updateImages.js';
let goodsID;
Page({

  data: {
    baseUrl: app.globalData.baseUrl,
    isSell: false,
    detail: {},
    fewNews: ['一成新', '二成新', '三成新', '四成新', '五成新', '六成新', '七成新', '八成新', '九成新', '十成新'],
    descLen: 0, //商品描述长度
    endTime: '', //买入时间的最大可选时间
    fewNew: '', //买入时间
    isExpress: false,
    delIndex: -1, //当前显示删除按钮的图片在files数组中的索引
    files: ['https://xiyi.honghuseo.cn/Upload/goods/2018-03/152023610912691526142103277940_thumb.jpg'] //商品图片
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {

    if (options.isSell == 1) {
      wx.setNavigationBarTitle({
        title: '出售商品'
      });
      this.setData({
        isSell: true
      });
    } else if (options.isSell == 2) {
      wx.setNavigationBarTitle({
        title: '商品流通'
      });
      this.setData({
        isSell: false,
        isExpress: true
      });
    }

    wx.request({
      url: `${app.globalData.api}/goods/goods_info`,
      data: {
        goodsId: options.id
      },
      success: res => {
        console.log(res);
        let i, saleTime = res.data.saleTime,
          index = '',
          files = [];
        for (i = 0; i < this.data.fewNews.length; i++) {
          if (this.data.fewNews[i] == saleTime) {
            index = i;
            break;
          }
        }
        let list = res.data.imageList || [];
        for (i = 0; i < list.length; i++) {
          files.push({
            url: list[i].goodsImg,
            id: list[i].id,
            isNews: false
          });
        }

        let tempData = res.data;
        if (tempData.marketPrice == '0.00') tempData.marketPrice = '';
        if (tempData.shopPrice == '0.00') tempData.shopPrice = '';
        this.setData({
          detail: tempData,
          fewNew: index,
          files
        });
      }
    });

    //设置买入时间的最大可选范围
    this.setData({
      endTime: formatDate(new Date())
    });
    goodsID = options.id;
  },

  //选择买入时间
  handleDateChange(e) {
    this.setData({
      fewNew: e.detail.value
    });
  },

  //商品描述信息
  handleGoodsDesc(e) {
    //记录商品描述长度
    this.setData({
      descLen: e.detail.value.length
    });
  },

  //显示提示信息
  showMsg(msg) {
    wx.showModal({
      content: msg,
      showCancel: false
    });
  },

  //提交
  handleFormSubmit(e) {
    let datas = e.detail.value,
      imgs = this.data.files;
    if (!this.data.isExpress) {
      if (!datas.goodsname) {
        this.showMsg('请输入商品名称');
      } else if (!this.data.fewNew) {
        this.showMsg('请选择新旧程度');
      } else if (!datas.size) {
        this.showMsg('请输入商品尺码');
      } else if (!datas.color) {
        this.showMsg('请输入商品颜色');
      } else if (!datas.oldprice) {
        this.showMsg('请输入商品原价');
      } else if (!datas.nowprice) {
        this.showMsg('请输入商品现价');
      } else if (!datas.desc) {
        this.showMsg('请输入商品描述');
      } else if (imgs.length < 1) {
        this.showMsg('请至少上传一张商品图片');
      } else {
        wx.showLoading({ title: '上传中' });
        //上传商品 首先上传标题等信息
        //如果上传成功 会返回一个商品id
        //再根据商品ID 上传商品图片
        //buyTime
        wx.request({
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          url: `${app.globalData.api}/goods/reputup`,
          data: {
            goodsType: 3,
            goodsStatus: 0,
            goodsId: goodsID,
            goodsName: datas.goodsname,
            goodsSize: datas.size,
            goodsColor: datas.color,
            originalPrice: datas.oldprice,
            presentPrice: datas.nowprice,
            buyTime: this.data.fewNews[this.data.fewNew],
            goodsDesc: datas.desc
          },
          success: res => {
            console.log('-------');
            console.log(res);
            console.log('-------');
            if (res.data.status == 1) {
              updateImages(imgs, goodsID, this.data.isSell ? '出售' : '修改');
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      }
    } else {
      if (!datas.uName) {
        this.showMsg('请填写收货人姓名');
      } else if (!datas.uPhone) {
        this.showMsg('请填写收货人手机号');
      } else if (!datas.addressDesc) {
        this.showMsg('请填写收货人详细地址');
      } else if (imgs.length < 1) {
        this.showMsg('请至少上传一张商品图片');
      } else {
        wx.request({
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          url: `${app.globalData.api}/goods/reputup`,
          data: {
            goodsType: 2,
            goodsStatus: 0,
            goodsId: goodsID,
            goodsName: datas.uName,
            goodsSize: datas.uPhone,
            goodsDesc: datas.addressDesc
          },
          success: res => {
            console.log('-------');
            console.log(res);
            console.log('-------');
            if (res.data.status == 1) {
              updateImages(imgs, goodsID, this.data.isSell ? '出售' : this.data.isExpress ? '流通' : '修改');
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '网络异常',
                image: '../../assets/warning.png',
                duration: 1500
              });
            }
          }
        });
      }
    }

  },

  //长按选择删除图片
  handleShowDelImage(e) {
    this.setData({
      delIndex: e.currentTarget.id
    });
  },

  //点击删除按钮下的遮罩层 隐藏删除按钮
  handleHideDelImage() {
    this.setData({
      delIndex: -1
    });
  },

  //点击按钮删除图标
  handleDelImage() {
    let files = this.data.files,
      index = this.data.delIndex;
    if (files[index].isNews) {
      files.splice(index, 1);
      this.setData({
        delIndex: -1,
        files
      });
    } else {
      wx.showLoading({ title: '删除中', mask: true });
      console.log(files[index].id);
      wx.request({
        url: `${app.globalData.api}/goods/deleteImg`,
        data: {
          imageId: files[index].id
        },
        success: res => {
          wx.hideLoading();
          if (res.data.status == 1) {
            wx.showToast({
              title: '删除成功',
              image: '../../assets/success.png',
              duration: 1500
            });
            files.splice(index, 1);
            this.setData({
              delIndex: -1,
              files
            });
          }
        },
        fail() {
          wx.hideLoading();
        }
      });
    }

  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFilePaths);
        let files = this.data.files;
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          files.push({
            url: res.tempFilePaths[i],
            isNews: true
          });
        }
        if (files.length >= 8) {
          files.splice(8);
        }
        this.setData({ files });
        console.log(this.data.files);
      }
    });
  },

  //预览图片
  previewImage(e) {
    let files = this.data.files,
      tempFiles = [],
      baseUrl = this.data.baseUrl;
    files.forEach(function(item) {
      tempFiles.push(item.isNews ? item.url : baseUrl + item.url);
    });
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: tempFiles // 需要预览的图片http链接列表
    });
  }
});
