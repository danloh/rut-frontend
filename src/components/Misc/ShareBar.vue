<template>
  <span id="social-share-bar">
    <small>Share:</small>
    <a title="Twitter" 
        rel="nofollow noopener noreferrer"
        class="share-link twitter"
        @click.prevent="shareWindow(`https://twitter.com/share?text=${title()}&url=${url}`)">
      <small class="icon">Tw</small>
    </a>
    <a title="Facebook" 
        rel="nofollow noopener noreferrer"
        class="share-link facebook"
        @click.prevent="shareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`)">
      <small class="icon">Fb</small>
    </a>
  </span>
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
      return this.passUrl || `https://ruthub.com${this.$route.fullPath}`
    }
  },
  methods: {
    title () {
      try {
        if (document) return this.prefix + (this.passTitle || document.title)
      } catch (err) { return 'RutHub' }
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

<style scoped>
#social-share-bar {
  padding: 5px;
  text-align: right;
}
#social-share-bar > .share-link {
    cursor: pointer;
    display: inline-block;
    text-align: center;
}

a.twitter:hover {
  background-color: #1da1f2;
}
a.facebook:hover {
  background-color: #3c5a98;
}
.icon {
  padding: 5px;
}
</style>
