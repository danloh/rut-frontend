// pluralise
export function pluralise (n, unit) {
  return n + ' ' + unit + (n <= 1 ? '' : 's')
}
// time ago formating
export function timeAgo (date, rep = true) {
  // compatibility AND timezone: YYYY-MM-DDTHH:mm:ss.sssZ
  let repDate = rep ? date.replace(/\s+/g, 'T').concat('Z') : date
  let realDate = new Date(repDate)
  let time = realDate.getTime()
  let offset = 0 // new Date().getTimezoneOffset() * 60
  const delta = Number(Date.now()) / 1000 + offset - Number(time) / 1000
  if (delta < 3600) {
    if (Object.is(~~(delta / 60), 0)) return 'just now'
    return pluralise(~~(delta / 60), 'minute') + ' ago' // double bitwise NOT -> floor
  } else if (delta < 86400) {
    return pluralise(~~(delta / 3600), 'hour') + ' ago'
  } else if (delta < 2592000) {
    return pluralise(~~(delta / 86400), 'day') + ' ago'
  } else if (delta < 31104000) {
    return pluralise(~~(delta / 2592000), 'month') + ' ago'
  } else {
    return pluralise(~~(delta / 31104000), 'year') + ' ago'
  }
}
// time gap
export function timeGap (date, rep = true) {
  let repDate = rep ? date.replace(/\s+/g, 'T').concat('Z') : date
  let realDate = new Date(repDate)
  let time = realDate.getTime()
  const gap = Number(Date.now()) / 1000 - Number(time) / 1000
  let days = pluralise(~~(Math.abs(gap) / 86400), 'day')
  if (gap < 0) {
    return days + ' Left'
  } else {
    return days + ' Past'
  }
}
// to local formating
export function toLocal (date, rep = true) {
  let repDate = rep ? date.replace(/\s+/g, 'T').concat('Z') : date
  return date
             ? new Date(repDate).toLocaleString()
             : date
}
// MDY time formating
const mapMon = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'}
export function toMDY (date, rep = true) {
  if (!date) return date
  let repDate = rep ? date.replace(/\s+/g, 'T').concat('Z') : date
  date = new Date(repDate)
  return `${mapMon[date.getMonth() + 1]} ${date.getDate()},${date.getFullYear()}` // ${date.getHours() > 11 ? 'PM' : 'AM'}
}

// showLess
export function showLess (content, least = 155, less = true) {
  if (!content) return ''
  if (content.length > least && less) {
    let lessContent = content.substring(0, least)
    let lastLinkIndex = lessContent.lastIndexOf('<a')
    let lastEndlinkIndex = lessContent.lastIndexOf('</a>')
    let actIndex = lastLinkIndex > lastEndlinkIndex ? lastLinkIndex : least // avoid to cut tag !!
    lessContent = lessContent.substring(0, actIndex) + ' ...'
    return lessContent
  } else {
    return content
  }
}

// trim input and valid
export function trimValid (rule, value, callback) {
  if (value.trim() === '') {
    callback(new Error('Blank Value'))
  } else {
    callback()
  }
}

// extract host
export function host (url) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

// uniq
export function uniq (arr) {
  let result = {}
  let final = []
  for (let i = 0; i < arr.length; i++) {
    result[arr[i].id] = arr[i]
  }
  for (let t in result) {
    final.push(result[t])
  }
  return final
}
