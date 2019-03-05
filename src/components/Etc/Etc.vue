<template>
  <div class="etc-view">
    <div v-if="etc" class="etc">
      <div class="by" :id="'etc' + etcid">
        <router-link :to="'/p/' + etc.uname">
          <b>{{ creator.name }}</b>
        </router-link>
        &nbsp; {{ etc.timestamp | timeAgo }}
      </div>
      <div class="content" v-html="etcContent"></div>
      <el-button type="text" size="mini" @click="upEtc" title="like">
        <small style="color:#aaa">Like</small>
      </el-button>
      <el-button type="text" size="mini" @click="showRe = !showRe">
        <small style="color:#aaa">
          {{ showRe ? 'Hide' : childEtcs.length + '&nbsp; Reply' }}
        </small>
      </el-button>
      <div class="etc-children" v-show="showRe">
        <!--recursively use component-->
        <etc v-for="commt in childEtcs" :key="commt.id" :etc="commt"></etc>
        <reply class="reply" style="margin-left:5px"
              :refer="refer" 
              :show.sync="showRe" 
              @newreply="updateNew">
        </reply> <!--sync, hide input once submit-->
      </div>
    </div>
  </div>
</template>

<script>
import Reply from './Reply.vue'
import marked from '../../util/marked'
import { checkAuth } from '../../util/auth'
import { upvoteEtc } from '../../api'
import { regTag } from '../../util/constant'

export default {
  name: 'etc',
  props: ['etc'],
  components: { Reply },
  data () {
    return {
      showRe: false,
      hasChild: this.etc.children.length > 0,
      childEtcs: this.etc.children,
      etcid: this.etc.id,
      refer: { re: 'etc', id: this.etc.id } // Reply's prop
    }
  },
  computed: {
    creator () {
      return this.etc.creator
    },
    etcContent () {
      return marked(
        this.etc.body
      ).replace(regTag, ' <a href="/tag/$1"><small>#$1</small></a>')
    }
  },
  methods: {
    upEtc () {
      if (checkAuth()) {
        upvoteEtc(this.etc.id)
      }
    },
    updateNew (data) {
      this.childEtcs.unshift(data)
    }
  }
}
</script>

<style lang="stylus" scoped>
.etc-view
  background-color lighten(#f3f3ed, 75%)
  border-top 1px dashed #ddd
  padding 5px 2px 5px 5px
  position relative
  .avatar
    position absolute
    top 20px
    left 2px
  .etc
    padding 5px
    .by
      font-size 10px
      margin 2px 0
      color #bbb
      a
        color #828282
        text-decoration underline
    .content
      margin 0.2em 0
      a:hover
        color #ff6600
    .etc-children
      margin-left 0.5em
      border-left 0.5px solid #eee
</style>
