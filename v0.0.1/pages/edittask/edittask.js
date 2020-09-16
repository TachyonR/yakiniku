// edittask.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const source = db.collection('source')
const tasks = db.collection('tasks')

const util = require('../../utils/util.js')

const loadLimit = 10

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Page({
  data: {
    useStartDate: false,
    startDate: '',
    useEndDate: false,
    endDate: '',
    showTaskDetail: false,
    taskList: [],

    _id: '',
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
    thumbnail: '',
    thumbnailStatus: false,
    accomplished: false,
    uploaded: false,
    comment: ''
  },
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  bindToggleStartDate(e) {
    this.setData({
      useStartDate: e.detail.value
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindToggleEndDate(e) {
    this.setData({
      useEndDate: e.detail.value
    })
  },
  getAvailableList: function (_availableList) {
    // Get new avaiable sources until all chosen sources are in the list
    return new Promise((resolve, reject) => {
      source
      .where({
        characterList: app.globalData.currentGroup.name,
        suspended: false
      })
      .skip(_availableList.length)
      .limit(loadLimit)
      .get()
      .then(res => {
        _availableList = [..._availableList, ...res.data.map(token => {
          return ({
            info: token,
            chosen: false
          })
        })]

        var flag = true

        for (var i = 0; i < this.data.sourceList.length; i++) {
          var inList = false
          for (var j = 0; j < _availableList.length; j++) {
            if (_availableList[j].info._id == this.data.sourceList[i]._id) {
              inList = true
              _availableList[j].chosen = true
              break
            }
          }
          if (!inList) {
            flag = false
            break
          }
        }

        return resolve(flag)
      })
    })
    .then(res => {
      if (res) {
        return _availableList
      }
      else {
        return this.getAvailableList(_availableList)
      }
    }) 
  },
  bindEnterTaskDetail: function (e) {
    var index = e.currentTarget.dataset.index
    var currentTask = this.data.taskList[index]

    this.setData({
      _id: currentTask._id,
      title: currentTask.title,
      sourceList: currentTask.sources,

      needEditing: currentTask.needEditing,
      edit: currentTask.edit,
      editStatus: currentTask.editStatus,
      needPostProcessing: currentTask.needPostProcessing,
      postProcess: currentTask.postProcess,
      postProcessStatus: currentTask.postProcessStatus,
      blockList: currentTask.block,
      useTimeRange: currentTask.useTimeRange,
      timeRange: currentTask.timeRange,
      thumbnail: currentTask.thumbnail,
      thumbnailStatus: currentTask.thumbnailStatus,
      accomplished: currentTask.accomplished,
      uploaded: currentTask.uploaded,
      comment: currentTask.comment,

      showTaskDetail: true
    })

    this.getAvailableList([]).then(res => {
      this.setData({
        availableList: res
      })
    })
  },
  bindExitTaskDetail: function () {
    this.setData({
      showTaskDetail: false
    })
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
    var _list = this.data.blockList;
    var _timeRange = this.data.timeRange
    _list.push('');
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
  bindDelete: function () {
    var that = this

    qq.showActionSheet({
      itemList: ['确认删除'],
      itemColor: 'red',
      success(res) {
        tasks
        .doc(that.data._id)
        .remove()
        .then(res => {
          that.setData({
            showTaskDetail: false
          })
          that.updateLists()
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
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

    tasks
    .doc(this.data._id)
    .update({
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
        thumbnail: this.data.thumbnail, 
        thumbnailStatus: this.data.thumbnailStatus,
        accomplished: this.data.accomplished,
        uploaded: this.data.uploaded,
        useTimeRange: this.data.useTimeRange,
        timeRange: this.data.timeRange,
        comment: this.data.comment     
      },
    })
    .then(res => {
      this.setData({
        showTaskDetail: false
      })
      this.updateLists()
    })
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '编辑稿件信息'
    })

    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var dateString = [year, month, day].map(formatNumber).join('-')

    this.setData({
      startDate: dateString,
      endDate: dateString
    })

    this.updateLists()

    this.setData({
      timeArray: util.timeArray
    })
  },
  updateLists: function () {
    if (this.data.useStartDate && this.data.useEndDate && this.data.startDate > this.data.endDate) {
      qq.showToast({
        title: '起止日期交叉',
        icon: 'none',
        duration: 2000
      }) 
      return
    }

    var criteria = {'sources.characterList': app.globalData.currentGroup.name}

    if (this.data.useStartDate && !this.data.useEndDate) {
      criteria['sources.date'] = db.command.gte(this.data.startDate)
    }
    if (this.data.useEndDate && !this.data.useStartDate) {
      criteria['sources.date'] = db.command.lte(this.data.endDate)
    }
    if (this.data.useStartDate && this.data.useEndDate) {
      criteria['sources.date'] = db.command.gte(this.data.startDate).and(db.command.lte(this.data.endDate))
    }

    qq.showLoading({
      title: '加载中',
    })
    tasks
    .where(criteria)
    .limit(loadLimit)
    .get()
    .then(res => {
      qq.hideLoading()
      this.setData({
        taskList: res.data
      })
    })
  }
})