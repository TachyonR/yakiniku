// addtask.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const source = db.collection('source')
const tasks = db.collection('tasks')

const util = require('../../utils/util.js')

const loadLimit = 10

Page({
  data: {
    title: '',
    sourceList: [],
    showSourceDetail: false,
    detailedSourceIndex: -1,
    availableList: [],
    showAvailable: false,
    needEditing: false,
    edit: '',
    editStatus: false,
    needPostProcessing: false,
    postProcess: '',
    postProcessStatus: false,
    blockList: [],
    timeArray: {},
    useTimeRange: false,
    timeRange: [],
    comment: ''
  },
  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindNewSource: function () {
    qq.showLoading({
      title: '查询中',
    })
    source
    .where({
      characterList: app.globalData.currentGroup.name,
      suspended: false
    })
    .limit(loadLimit)
    .get()
    .then(res => {
      qq.hideLoading()
      if (!this.data.availableList.length) {
        this.setData({
          availableList: res.data.map(token => {
            return ({
              info: token,
              chosen: false
            })
          }),
        })
      }
      this.setData({
        showAvailable: true
      })
    })
  },
  bindLoadMore: function () {
    qq.showLoading({
      title: '查询中',
    })

    var _tasks = []
    var currentLength = this.data.availableList.length
    while (_tasks.length * loadLimit <= currentLength) {
      _tasks.push(
        source
        .where({
          characterList: app.globalData.currentGroup.name,
          suspended: false
        })
        .skip(_tasks.length * loadLimit)
        .limit(loadLimit)
        .get()
      )
    }

    Promise.all(_tasks).then(res => {
      qq.hideLoading()

      var _list = []
      for (var i = 0; i < _tasks.length; i++) {
        _list = [..._list, ...res[i].data]
      }
      
      _list = _list.map(token => {
        return ({
          info: token,
          chosen: false
        })
      })

      var _idList = this.data.availableList.map(token => {return token.chosen ? token.info._id : null})
      for (var i = 0; i < _list.length; i++) {
        if (_idList.indexOf(_list[i].info._id) != -1) {
          _list[i].chosen =  true
        }
      }

      this.setData({
        availableList: _list
      })
    })
  },
  bindToggleSource: function (e) {
    var index = e.currentTarget.dataset.index
    var _list = this.data.availableList
    _list[index].chosen = !_list[index].chosen
    this.setData({
      availableList: _list
    })
  },
  bindConfirmSource: function () {
    var _list = []
    for (var i = 0; i < this.data.availableList.length; i++) {
      if (this.data.availableList[i].chosen) {
        _list.push(this.data.availableList[i].info)
      }
    }
    this.setData({
      sourceList: _list,
      showAvailable: false
    })
  },
  bindToggleNeedEditing: function (e) {
    this.setData({
      needEditing: e.detail.value,
      edit: e.detail.value ? app.globalData.currentGroup.nickname : ''
    })
  },
  bindToggleEditStatus: function (e) {
    this.setData({
      editStatus: e.detail.value
    })
  },
  bindToggleNeedPostProcessing: function (e) {
    this.setData({
      needPostProcessing: e.detail.value,
      postProcess: e.detail.value ? app.globalData.currentGroup.nickname : ''
    })
  },
  bindTogglePostProcessStatus: function (e) {
    this.setData({
      postProcessStatus: e.detail.value
    })
  },
  bindComment: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  bindToggleTimeRange: function (e) {
    this.setData({
      useTimeRange: e.detail.value
    })
  },
  bindSourceDetail: function (e) {
    // use this as a function to show source detail
    this.setData({
      detailedSourceIndex: e.currentTarget.dataset.index,
      showSourceDetail: true
    })
  },
  bindSourceDetailBack: function (e) {
    this.setData({
      showSourceDetail: false
    })
  },
  bindSubtitleInput: function(e) {
    var index = e.currentTarget.dataset.index
    var _list = this.data.blockList
    _list[index].subtitle = e.detail.value
    this.setData({
        blockList: _list
    })
  },
  bindNewSubtask: function () {
    var _list = this.data.blockList
    var _timeRange = this.data.timeRange
    _list.push({
      subtitle: '',
      timing: '',
      timingStatus: false,
      translation: '',
      translationStatus: false,
      proofread: '',
      proofreadStatus: false,
    })
    _timeRange.push({hour: 0, minute: 0, second: 0})
    this.setData({
        blockList: _list,
        timeRange: _timeRange
    })
  },
  bindDelSubtask: function (e) {
    var _list = this.data.blockList
    var _timeRange = this.data.timeRange
    var index = e.currentTarget.dataset.index
    _list.splice(index,1)
    _timeRange.splice(index,1)
    this.setData({
      blockList: _list,
      timeRange: _timeRange
    })
  },
  bindTimePickerChange: function (e) {

    var _timeRange = this.data.timeRange
    var index = e.currentTarget.dataset.index
    _timeRange[index].hour = e.detail.value[0]
    _timeRange[index].minute = e.detail.value[1]
    _timeRange[index].second = e.detail.value[2]
    this.setData({
      timeRange: _timeRange
    })
  },
  bindConfirm: function (e) {
    if (this.data.title == '') {
      qq.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    if (!this.data.sourceList.length) {
      qq.showToast({
        title: '源不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    if (!this.data.blockList.length) {
      qq.showToast({
        title: '分段不能为空',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    tasks.add({
      data: {
        title: this.data.title,
        sources: this.data.sourceList,
        needEditing: this.data.needEditing,
        edit: this.data.edit,
        editStatus: this.data.editStatus,
        needPostProcessing: this.data.needPostProcessing,
        postProcess: this.data.postProcess,
        postProcessStatus: this.data.postProcessStatus,
        block: this.data.blockList,
        thumbnail: '', 
        thumbnailStatus: false,
        accomplished: false,
        uploaded: false,
        useTimeRange: this.data.useTimeRange,
        timeRange: this.data.timeRange,
        comment: this.data.comment     
      },
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
    qq.navigateBack({
      delta: 1
    })
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '添加稿件'
    })

    this.setData({
      timeArray: util.timeArray
    })
  }
})