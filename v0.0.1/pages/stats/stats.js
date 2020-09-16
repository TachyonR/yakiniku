//index.js
//获取应用实例
const app = getApp()

const db = qq.cloud.database({
  env: 'yakiniku-aa7a46'
})
const groups = db.collection('groups')
const tasks = db.collection('tasks')

const $ = db.command.aggregate
const thisSecond = $.arrayElemAt(['$timeRange.second', '$blockIndex'])
const prevSecond = $.cond([$.eq(['$blockIndex', 0]), 0, $.arrayElemAt(['$timeRange.second', $.subtract(['$blockIndex', 1])])])
const deltaSecond = $.subtract([thisSecond, prevSecond])
const thisMinute = $.arrayElemAt(['$timeRange.minute', '$blockIndex'])
const prevMinute = $.cond([$.eq(['$blockIndex', 0]), 0, $.arrayElemAt(['$timeRange.minute', $.subtract(['$blockIndex', 1])])])
const deltaMinute = $.subtract([thisMinute, prevMinute])
const thisHour = $.arrayElemAt(['$timeRange.hour', '$blockIndex'])
const prevHour = $.cond([$.eq(['$blockIndex', 0]), 0, $.arrayElemAt(['$timeRange.hour', $.subtract(['$blockIndex', 1])])])
const deltaHour = $.subtract([thisHour, prevHour])
const deltaTime = $.add([$.multiply([3600, deltaHour]), $.multiply([60, deltaMinute]), deltaSecond])

Page({
  data: {
    myNickname: '',
    useTimeList: false,
    timeList: [],
    numList: []
  },
  bindToggleTimeList: function (e) {
    this.setData({
      useTimeList: e.detail.value
    })
  },
  onLoad: function (){
    qq.setNavigationBarTitle({
      title: '统计信息'
    })

    this.setData({
      myNickname: app.globalData.currentGroup.nickname
    })

    qq.showLoading({
      title: '查询中',
    })

    var queryList = []

    queryList.push(
      tasks
      .aggregate()
      .match({'sources.characterList': app.globalData.currentGroup.name})
      .unwind({
        path: '$block',
        includeArrayIndex: 'blockIndex'
      })
      .group({
        _id: '$block.timing',
        num: $.sum(1),
        time: $.sum($.cond(['$block.timingStatus', deltaTime, 0]))
      })
      .sort({time: -1})
      .limit(200)
      .end()
    )

    queryList.push(
      tasks
      .aggregate()
      .match({'sources.characterList': app.globalData.currentGroup.name})
      .unwind({
        path: '$block',
        includeArrayIndex: 'blockIndex'
      })
      .group({
        _id: '$block.translation',
        num: $.sum(1),
        time: $.sum($.cond(['$block.translationStatus', deltaTime, 0]))
      })
      .limit(200)
      .end()
    )

    queryList.push(
      tasks
      .aggregate()
      .match({'sources.characterList': app.globalData.currentGroup.name})
      .unwind({
        path: '$block',
        includeArrayIndex: 'blockIndex'
      })
      .group({
        _id: '$block.proofread',
        num: $.sum(1),
        time: $.sum($.cond(['$block.proofreadStatus', deltaTime, 0]))
      })
      .limit(200)
      .end()
    )

    queryList.push(
      tasks
      .aggregate()
      .match({
        'sources.characterList': app.globalData.currentGroup.name,
        needEditing: true,
        editStatus: true
      })
      .group({
        _id: '$edit',
        num: $.sum(1),
        time: $.sum(0)
      })
      .limit(200)
      .end()
    )

    queryList.push(
      tasks
      .aggregate()
      .match({
        'sources.characterList': app.globalData.currentGroup.name,
        needPostProcessing: true,
        postProcessStatus: true
      })
      .group({
        _id: '$postProcess',
        num: $.sum(1),
        time: $.sum(0)
      })
      .limit(200)
      .end()
    )

    queryList.push(
      tasks
      .aggregate()
      .match({
        'sources.characterList': app.globalData.currentGroup.name,
        thumbnailStatus: true
      })
      .group({
        _id: '$thumbnail',
        num: $.sum(1),
        time: $.sum(0)
      })
      .limit(200)
      .end()
    )

    var statList = []

    Promise.all(queryList).then(res => {
      for (var q = 0; q < res.length; q++) {
        for (var i = 0; i < res[q].data.length; i++) {
          var flag = false
          for (var j = 0; j < statList.length; j++) {
            if (statList[j]._id == res[q].data[i]._id) {
              statList[j].time += res[q].data[i].time
              statList[j].num += res[q].data[i].num
              flag = true
              break
            }
          }

          if (!flag) {
            statList.push({
              _id: res[q].data[i]._id,
              time: res[q].data[i].time,
              num: res[q].data[i].num
            })
          }
        }
      }

      qq.hideLoading()
      
      this.setData({
        timeList: statList.sort((a, b) => b.time - a.time).filter(elem => elem._id != ''),
        numList: statList.sort((a, b) => b.num - a.num).filter(elem => elem._id != '')
      })
    })
  }
})