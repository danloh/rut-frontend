<template>
  <div id="social-share-bar">
    <a title="Twitter" 
        rel="nofollow noopener"
        class="share-link twitter"
        @click.prevent="shareWindow(`http://twitter.com/share?text=${title()}&url=${url}`)">
      <img alt="TW" src="/static/pic/twitter.svg" class="icon">
    </a>
    <a title="Facebook" 
        rel="nofollow noopener"
        class="share-link facebook"
        @click.prevent="shareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`)">
      <img alt="FB" src="/static/pic/facebook.svg" class="icon">
    </a>
    <a title="Linkedin" 
        rel="nofollow noopener"
        class="share-link linkedin"
        @click.prevent="shareWindow(`http://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title()}`)">
      <img alt="Linkedin" src="/static/pic/linkedin.svg" class="icon">
    </a>
    <a title="Google+" 
        rel="nofollow noopener"
        class="share-link google-plus"
        @click.prevent="shareWindow(`https://plus.google.com/share?url=${url}`)">
      <img alt="G+" src="/static/pic/gplus.svg" class="icon">
    </a>
    <a title="Evernote" 
        rel="nofollow noopener"
        class="share-link evernote"
        @click.prevent="shareWindow(`https://www.evernote.com/clip.action?url=${url}&title=${title()}`)">
      <img alt="Evernote" src="/static/pic/evernote.svg" class="icon">
    </a>
  </div>
</template>

<script>
export default {
  name: 'share-bar',
  props: {
    passUrl: String,
    passTitle: String,
    prefix: {
      type: String,
      default: ''
    }
  },
  computed: {
    url () {
      return this.passUrl || `https://readup.tips${this.$route.fullPath}`
    }
  },
  methods: {
    title () {
      try {
        if (document) return this.prefix + (this.passTitle || document.title)
      } catch (err) { return 'Readup.Tips' }
    },
    shareWindow (url) {
      url = encodeURI(url)
      console.log(url)
      let winName = 'newWin'
      let awidth = screen.availWidth / 2
      let aheight = screen.availHeight / 5 * 2
      let atop = (screen.availHeight - aheight) / 2
      let aleft = (screen.availWidth - awidth) / 2
      let param0 = 'scrollbars=0,status=0,menubar=0,resizable=2,location=0'
      let params = `top=${atop},left=${aleft},width=${awidth},height=${aheight},${param0}`
      const win = window.open(url, winName, params)
      win.focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
#social-share-bar
  text-align right
  > .share-link
    cursor: pointer
    display: inline-block
    text-align: center
    &.evernote:hover
      background-color: rgb(139, 224, 86)
    &.twitter:hover
      background-color: rgb(85, 172, 238)
    &.facebook:hover
      background-color: rgb(59, 89, 152)
    &.google-plus:hover
      background-color: rgb(221, 75, 57)
    &.linkedin:hover
      background-color: rgb(0, 123, 181)
    .icon
      padding 5px
      width 16px
      height 16px
</style>
