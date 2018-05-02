import marked from 'marked'
// import { regTag } from '@/util/constant'

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

const paragraphParse = text => `<p>\n${text}</p>`

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

const headingParse = (text, level, raw) => {
  let realLevel = level + 2
  // if (this.options.headerIds) {
  //   return '<h' + realLevel + ' id="' + this.options.headerPrefix +
  //    raw.toLowerCase().replace(/[^\w]+/g, '-') + '">' +
  //    text + '</h' + realLevel + '>\n'
  // }
  // ignore IDs
  return '<h' + realLevel + '>' + text + '</h' + realLevel + '>\n'
}

renderer.link = linkParse
renderer.image = imageParse
renderer.paragraph = paragraphParse
renderer.heading = headingParse

export default (content) => {
  // console.log('content', content)
  if (typeof content !== 'string') {
    return ''
  }
  return marked(
    content, { renderer }
  ) // .replace(regTag, '<a href="/tag/$1"><small>#$1</small></a>')
}
