import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

const renderer = new marked.Renderer()

const paragraphParse = text => `<p>${text}</p>`

const linkParse = (href, title, text) => {
  const isSelf = href.includes('readup.tips')
  const textIsImage = text.includes('<img')
  return `<a href="${href}" target="_blank"
             title="${title || (textIsImage ? href : text)}" 
             ${isSelf ? '' : 'rel="external nofollow noopener noreferrer"'}>
             ${text}</a>`.replace(/\s+/g, ' ').replace('\n', '')
}

const imageParse = (src, title, alt) => {
  return `<a href="${src}" 
             target="_blank" rel="nofollow noopener noreferrer">
            <img src="${src}" 
                referrerPolicy="no-referrer" 
                title="${title || alt || 'readup.tips'}" 
                style="width:10%; height:15%"
                alt="${alt || title || src}"/>
          </a>`.replace(/\s+/g, ' ').replace('\n', '')
}

// const headingParse = (text, level, raw) => {
//   if (level === 1) {
//     let url = '/tag/' + text
//     let tag = '#' + text
//     return `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">
//                ${tag}
//             </a>`.replace(/\s+/g, ' ').replace('\n', '')
//   } else {
//     // ignore IDs
//     return '<h' + level + '>' + text + '</h' + level + '>\n'
//   }
// }

renderer.link = linkParse
renderer.image = imageParse
renderer.paragraph = paragraphParse
// renderer.heading = headingParse

export default (content) => {
  // console.log('content', content)
  if (typeof content !== 'string') {
    return ''
  }
  return marked(content, { renderer })
}
