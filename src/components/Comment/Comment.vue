<template>
  <div class="comment-view">
    <!-- <img class="avatar" style="width:25px;height:25px;border-radius:25%" 
         :src="creator.avatar" referrerPolicy="no-referrer" alt="Avatar"> -->
    <div v-if="comment" class="comment">
      <div class="by" :id="'comment' + commentid">
        <router-link :to="'/profile/' + creator.id">
          <b>{{ creator.name }}</b>
        </router-link>
        &nbsp; {{ comment.timestamp | timeAgo }}
      </div>
      <div class="content" v-html="commentContent"></div>
      <el-button type="text" size="mini" @click="upComment" title="like">
        <i class="el-icon-caret-top" style="color:grey"></i>
      </el-button>
      <el-button type="text" size="mini" @click="showRe = !showRe">
        <small style="color:#aaa">{{ showRe ? 'hide' : 'reply' }}</small>
      </el-button>
      <span class="toggle" :class="{ open }" v-if="hasChild">
        <a @click="open = !open">
          {{ open ? '[-] fold' : '[+] ' + childComments.length + ' collapsed' }} 
        </a>
      </span>
      <reply class="reply" 
            :refer="refer" 
            :show.sync="showRe" 
            @newreply="updateNew">
      </reply> <!--sync, hide input once submit-->
      <div class="comment-children" v-show="open">
        <!--recursively use component-->
        <comment v-for="commt in childComments" :key="commt.id" :comment="commt"></comment>
      </div>
    </div>
  </div>
</template>

<script>
import Reply from '@/components/Comment/Reply.vue'
import marked from '@/util/marked'
import { checkAuth } from '@/util/auth'
import { upvoteComment } from '@/api/api'

export default {
  name: 'comment',
  props: ['comment'],
  components: { Reply },
  data () {
    return {
      open: false,
      showRe: false,
      hasChild: this.comment.children.length > 0,
      childComments: this.comment.children,
      commentid: this.comment.id,
      refer: { re: 'comment', id: this.comment.id } // Reply's prop
    }
  },
  computed: {
    creator () {
      return this.comment.creator
    },
    commentContent () {
      return marked(
        this.comment.body
      ).replace(/ #(\w+)/g, ' <a href="/tag/@$1"><small>#$1</small></a>')
    }
  },
  methods: {
    upComment () {
      if (checkAuth()) {
        upvoteComment(this.comment.id)
      }
    },
    updateNew (data) {
      this.open = true
      this.childComments.unshift(data)
    }
  }
}
</script>

<style lang="stylus" scoped>
.comment-view
  background-color lighten(#f3f3ed, 75%)
  border-top 1px solid #eee
  padding 5px 2px 5px 5px
  position relative
  .avatar
    position absolute
    top 20px
    left 2px
  .comment
    padding 5px
    .by, .toggle
      font-size 10px
      margin 2px 0
    .by
      color #bbb
      a
        color #828282
        text-decoration underline
    .content
      margin 0.2em 0
      a:hover
        color #ff6600
    .toggle
      background-color #eef2f5
      padding 0.1em 0.5em
      border-radius 4px
      a
        color #828282
        cursor pointer
      &.open
        padding 0
        background-color transparent
        margin-bottom -0.5em
    .comment-children
      margin-left 0.5em
</style>
