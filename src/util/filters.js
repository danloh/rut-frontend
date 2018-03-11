function pluralize (time, label) {
  if (time === 1) {
    return time + label + ' ago'
  }
  return time + label + 's' + ' ago'
}
// time ago formating
export function timeAgo (date, rep = true) {
  // compatibility AND timezone: YYYY-MM-DDTHH:mm:ss.sssZ
  let repDate = rep ? date.replace(/\s+/g, 'T').concat('Z') : date
  let realDate = new Date(repDate)
  let time = realDate.getTime()
  let offset = 0 // new Date().getTimezoneOffset() * 60
  const between = Number(Date.now()) / 1000 + offset - Number(time) / 1000
  if (between < 3600) {
    if (Object.is(~~(between / 60), 0)) return 'just now'
    return pluralize(~~(between / 60), ' minute') // double bitwise NOT -> floor
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
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

// pluralise
export function pluralise (n, unit) {
  return n + ' ' + unit + (n <= 1 ? '' : 's')
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
