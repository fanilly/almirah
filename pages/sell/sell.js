// pages/sell/sell.js
const app = getApp();
import { formatDate } from '../../utils/util.js';
import uploadImages from '../../request/uploadImages.js';
let goodsID, ID, shopID, flag;
Page({

  data: {
    fewNews: ['一成新', '二成新', '三成新', '四成新', '五成新', '六成新', '七成新', '八成新', '九成新', '十成新'],
    descLen: 0, //商品描述长度
    endTime: '', //买入时间的最大可选时间
    fewNew: '', //买入时间
    delIndex: -1, //当前显示删除按钮的图片在files数组中的索引
    files: [], //商品图片
    isSell: false,
    flag: 'sell'
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    goodsID = options.goodsID;
    ID = options.ID;
    shopID = options.shopID;
    flag = options.flag;
    //设置买入时间的最大可选范围
    this.setData({
      endTime: formatDate(new Date()),
      isSell: flag == 'sell' ? true : false,
      flag: flag,
      orderId: options.orderId || false
    });
    if (flag == 'storage') {
      wx.setNavigationBarTitle({ title: '商品存储' });
    } else if (flag == 'express') {
      wx.setNavigationBarTitle({ title: '商品流通' });
    }
  },

  //过滤特殊字符
  handleFilter(e) {
    let value = e.detail.value;
    // [^\u4E00-\u9FA5]/g
    return {
      value: value.replace(/[~'!@#$%^&*()-+_=:]/g, '')
    };
  },

  //只能为汉字
  handleFilter1(e) {
    let value = e.detail.value;
    console.log(e);
    // [^\u4E00-\u9FA5]/g
    return {
      value: value.replace(/[^\u4E00-\u9FA5]/g, '')
    };
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
    if (this.data.flag == 'sell') { //出售
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
      } else if (datas.nowprice * 1 > datas.oldprice * 1) {
        this.showMsg('商品现价不可大于原价');
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
          url: `${app.globalData.api}/goods/putup`,
          data: {
            goodsType: 3,
            goodsStatus: 0,
            goodsCat: goodsID,
            userId: app.globalData.userID,
            shopId: shopID,
            goodsName: datas.goodsname,
            goodsSize: datas.size,
            goodsColor: datas.color,
            originalPrice: datas.oldprice,
            presentPrice: datas.nowprice,
            buyTime: this.data.fewNews[this.data.fewNew],
            goodsDesc: datas.desc
          },
          success: res => {
            console.log(res);
            if (res.data.status == 1) {
              uploadImages(imgs, res.data.data);
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
    } else if (this.data.flag == 'storage') { //存储
      if (imgs.length < 3) {
        this.showMsg('请至少上传三张图片（注：一张为整体照片、一张为细节照片、一张为商标照片）')
      } else {
        wx.showModal({
          title: '衣物存储须知',
          content: '1、本公司进行定位管理即不同衣物、不同价值衣物会进行分类分区管理存放。2、存放位置区域确定后将于平台体现并公布。3、衣物储存保证干燥整洁、温度适宜、无阳光直射。延长衣物使用寿命。鞋包储存保证干燥整洁、温度适宜、无阳光直射外合理进行定型以延长使用寿命。',
          success: res => {
            if (res.confirm) {
              wx.showLoading({ title: '上传中' });
              wx.request({
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                url: `${app.globalData.api}/goods/putup`,
                data: {
                  goodsType: 1,
                  goodsStatus: 0,
                  goodsCat: goodsID,
                  userId: app.globalData.userID,
                  shopId: shopID
                },
                success: res => {
                  console.log(res);
                  if (res.data.status == 1) {
                    uploadImages(imgs, res.data.data, 'storage');
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
        this.showMsg('请至少上传一张图片');
      } else {
        wx.showLoading({ title: '上传中' });
        wx.request({
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          url: `${app.globalData.api}/goods/putup`,
          data: {
            goodsType: 2,
            goodsStatus: 0,
            goodsCat: goodsID,
            userId: app.globalData.userID,
            shopId: shopID,
            goodsName: datas.uName,
            goodsSize: datas.uPhone,
            goodsDesc: datas.addressDesc
          },
          success: res => {
            console.log(res);
            if (res.data.status == 1) {
              uploadImages(imgs, res.data.data, 'express');
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
    let temp = this.data.files;
    temp.splice(this.data.delIndex, 1);
    this.setData({
      delIndex: -1,
      files: temp
    });
  },

  //选择图片
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          files: this.data.files.concat(res.tempFilePaths)
        });
        console.log(this.data.files);
        if (this.data.files.length >= 8) {
          let temp = this.data.files;
          temp.splice(8);
          this.setData({
            files: temp
          });
        }
      }
    });
  },

  //预览图片
  previewImage(e) {
    console.log(e);
    wx.previewImage({
      current: this.data.files[e.currentTarget.id], // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    });
  }
});
