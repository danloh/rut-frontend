<template>
  <div class="headline" v-if="submitor">
    <el-button class="vote" type="text" @click="upheadline" title="upvote">
      <i class="el-icon-caret-top" style="color:#ff6600"></i>
    </el-button>
    <div class="headline-main">
      <div class="headline-title">
        <template v-if="headline.url">
          <a :href="headline.url" 
             target="_blank" rel="nofollow noopener noreferrer">
             <b>{{ headline.title }}</b>
          </a>
          <span class="host"> ({{ headline.url | host }})</span>
        </template>
        <template v-else>
          <router-link :to="'/headline/' + headline.id">
            <b>{{ headline.title }}</b>
          </router-link>
        </template>
      </div>
      <div class="content" v-if="showCon" v-html="headlineContent"></div>
      <div class="headline-bar">
        By
        <router-link :to="'/profile/' + submitor.id">
          {{ submitor.name }}
        </router-link>
        {{ headline.timestamp | timeAgo }}
        | {{ vote }}
        <el-button type="text" @click="upheadline">vote</el-button>
        | {{headline.commentcount}}&nbsp;
        <router-link :to="'/headline/' + headline.id">
          Comment
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { upvoteHeadline } from '@/api/api'
import { checkAuth } from '@/util/auth'
import marked from '@/util/marked'

export default {
  name: 'headline',
  props: ['headline', 'showCon'],
  data () {
    return {
      vote: this.headline.vote
    }
  },
  computed: {
    submitor () {
      return this.headline.submitor
    },
    headlineContent () {
      let content = this.headline.content
      return content ? marked(content) : ''
    }
  },
  methods: {
    upheadline () {
      if (checkAuth()) {
        let headlineid = this.headline.id
        upvoteHeadline(headlineid).then(resp => {
          this.vote = resp.data
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.headline
  padding 5px 5px 5px 10px
  position relative
  background-color lighten(#f1f3f5, 50%)
  border-bottom 1px solid #eee
  .vote
    position absolute
    top 5px
    left 2px
    text-align center
  .headline-main
    padding 5px
    .headline-title
      padding 0 5px
      font-size 1.1em
      a
        &:hover
          color #409eff
    .content
      padding auto
    .headline-bar, .host
      color #828282
      font-size 0.75em
</style>