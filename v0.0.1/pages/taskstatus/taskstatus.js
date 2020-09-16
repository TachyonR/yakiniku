// taskstatus.js

const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const tasks = db.collection('tasks')

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
    redList: [],
    yellowList: [],
    greenList: [],
    currentList: '',
    taskDetail: false,
    detailedTask: {}
  },
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value,
      currentList: '',
      redList: [],
      yellowList: [],
      greenList: []
    })
  },
  bindToggleStartDate(e) {
    this.setData({
      useStartDate: e.detail.value,
      currentList: '',
      redList: [],
      yellowList: [],
      greenList: []
    })
  },
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value,
      currentList: '',
      redList: [],
      yellowList: [],
      greenList: []
    })
  },
  bindToggleEndDate(e) {
    this.setData({
      useEndDate: e.detail.value,
      currentList: '',
      redList: [],
      yellowList: [],
      greenList: []
    })
  },
  bindRed: function () {
    this.setData({
      currentList: 'red'
    })
    this.updateLists()
  },
  bindYellow: function () {
    this.setData({
      currentList: 'yellow'
    })
    this.updateLists()
  },
  bindGreen: function () {
    this.setData({
      currentList: 'green'
    })
    this.updateLists()
  },
  bindBack: function () {
    this.setData({
      taskDetail: false,
      detailedTask: {}
    })
  },
  bindDetail: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      taskDetail: true
    })
    switch(this.data.currentList) {
      case 'red':
        this.setData({
          detailedTask: this.data.redList[index]
        })
        break
      case 'yellow':
        this.setData({
          detailedTask: this.data.yellowList[index]
        })
        break
      case 'green':
        this.setData({
          detailedTask: this.data.greenList[index]
        })
        break
    }
  },
  bindToGreen: function () {
    tasks
    .doc(this.data.detailedTask._id)
    .update({
      data: {
        uploaded: true
      }
    })
    .then(res => {
      this.updateLists()
      this.setData({
        taskDetail: false
      })
    })
  },
  bindToYellow: function () {
    tasks
    .doc(this.data.detailedTask._id)
    .update({
      data: {
        uploaded: false
      }
    })
    .then(res => {
      this.updateLists()
      this.setData({
        taskDetail: false
      })
    })
  },
  onLoad: function () {
    qq.setNavigationBarTitle({
      title: '发布状况'
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

    this.setData({
      redList: [],
      yellowList: [],
      greenList: []
    })

    var redCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      accomplished: false
    }
    var yellowCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      accomplished: true,
      uploaded: false
    }
    var greenCriteria = {
      'sources.characterList': app.globalData.currentGroup.name,
      uploaded: true
    }

    if (this.data.useStartDate && !this.data.useEndDate) {
      redCriteria['sources.date'] = yellowCriteria['sources.date'] = greenCriteria[['sources.date']] = db.command.gte(this.data.startDate)
    }
    if (this.data.useEndDate && !this.data.useStartDate) {
      redCriteria['sources.date'] = yellowCriteria['sources.date'] = greenCriteria[['sources.date']] = db.command.lte(this.data.endDate)
    }
    if (this.data.useStartDate && this.data.useEndDate) {
      redCriteria['sources.date'] = yellowCriteria['sources.date'] = greenCriteria[['sources.date']] = db.command.gte(this.data.startDate).and(db.command.lte(this.data.endDate))
    }

    qq.showLoading({
      title: '查询中',
    })
    tasks
    .where(redCriteria)
    .get()
    .then(res => {
      this.setData({
        redList: res.data
      })
      if (this.data.currentList == 'red') qq.hideLoading()
    })
    tasks
    .where(yellowCriteria)
    .get()
    .then(res => {
      this.setData({
        yellowList: res.data
      })
      if (this.data.currentList == 'yellow') qq.hideLoading()
    })
    tasks
    .where(greenCriteria)
    .get()
    .then(res => {
      this.setData({
        greenList: res.data
      })
      if (this.data.currentList == 'green') qq.hideLoading()
    })
    if (this.data.currentList == '') qq.hideLoading()
  }
})