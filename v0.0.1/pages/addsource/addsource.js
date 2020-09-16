// addsource.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const source = db.collection('source')

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Page({
  data: {
    date: '',
    title: '',
    themeList: [],
    characterList: [],
    suspended: false,
    uploaded: false,
    comment: ''
  },
  bindTitleConfirm: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  addTheme: function () {
    var _list = this.data.themeList;
    _list.push('');
    this.setData({
       themeList: _list
    })
  },
  delTheme: function (e) {
    var _list = this.data.themeList;
    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
        themeList: _list
    })
  },
  bindAddTheme: function (e) {
    var _list = this.data.themeList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      themeList: _list
    })
  },
  addCharacter: function () {
    var _list = this.data.characterList;
    _list.push('');
    this.setData({
       characterList: _list
    })
  },
  delCharacter: function (e) {
    var _list = this.data.characterList;

    if (_list.length == 1) {
      qq.showToast({
        title: '角色不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    _list.splice(e.currentTarget.dataset.index,1);
    this.setData({
        characterList: _list
    })
  },
  bindAddCharacter: function (e) {
    var _list = this.data.characterList;
    _list[e.currentTarget.dataset.index] = e.detail.value;
    this.setData({
      characterList: _list
    })
  },
  bindSuspended: function (e) {
    this.setData({
      suspended: e.detail.value
    })
  },
  bindUploaded: function (e) {
    this.setData({
      uploaded: e.detail.value
    })
  },
  bindComment: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  bindConfirm: function() {
    if (this.data.title == '') {
      qq.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    source.add({
      data: {
        date: this.data.date,
        title: this.data.title,
        themeList: this.data.themeList,
        characterList: this.data.characterList,
        suspended: this.data.suspended,
        uploaded: this.data.uploaded,
        comment: this.data.comment
      },
    })
    .then(res => {
      qq.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      }) 
      qq.navigateBack({
        delta: 1
      })
    })
    .catch(console.error);
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '添加源'
    })

    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var dateString = [year, month, day].map(formatNumber).join('-')

    this.setData({
      date: dateString,
      characterList: [app.globalData.currentGroup.name]
    })
  }
})