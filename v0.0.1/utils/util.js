const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var timeArray = {hour : [], minute : [], second : []}

for (var i = 0; i < 24; i++) timeArray.hour.push(formatNumber(i))
for (var i = 0; i < 60; i++) timeArray.minute.push(formatNumber(i))
for (var i = 0; i < 60; i++) timeArray.second.push(formatNumber(i))

module.exports = {
  formatTime: formatTime,
  timeArray: timeArray
}
