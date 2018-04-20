<template>
  <div class="clip-main">
    <div class="clipbody">
      <span class="quoteleft">“</span>
      <span v-html="clipContent"></span>
    </div>
    <div class="meta">
      ~ {{ clip.chapnum && clip.sectnum && clip.pagenum 
            ? 'Ch' + clip.chapnum + ':' + clip.sectnum + 'P' + clip.pagenum 
            : '' }}
      <router-link :to="'/item/' + fromitem.id" :title="fromitem.title">
        {{ fromitem.title.slice(0, 42) }}...
      </router-link>
      via 
      <router-link :to="'/profile/' + creator.id">
        {{ creator.name.slice(0, 15) }}
      </router-link>
      | {{ clip.timestamp | toMDY }}
      | {{ vote }}&nbsp;<el-button type="text" @click="upClip">Like</el-button>
    </div>
  </div>
</template>

<script>
import { upvoteClip } from '@/api/api'
import { checkAuth } from '@/util/auth'
import marked from '@/util/marked'

export default {
  name: 'clip',
  props: ['clip'],
  data () {
    return {
      vote: this.clip.vote
    }
  },
  computed: {
    creator () {
      return this.clip.creator
    },
    fromitem () {
      return this.clip.fromitem
    },
    clipContent () {
      return marked(this.clip.body)
    }
  },
  methods: {
    upClip () {
      if (checkAuth()) {
        let clipid = this.clip.id
        upvoteClip(clipid).then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.clip-main
  background-color lighten(#f6f6f1, 50%)
  padding 5px
  border-bottom 2px solid #eee
  position relative
  .meta
    font-size .75em
    text-align right
    a
      &:hover
        color red
  .clipbody
    padding 0px 10px
    font-size 1.05em
    color #2b2117
    position relative
    .quoteleft
      position absolute
      top 0px
      left 0px
      color grey
</style>