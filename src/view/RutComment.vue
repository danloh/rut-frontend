<template>
  <div class="rut-comment">
    <div class="comment-main">
      <b style="font-size:1.2em">{{ commentCount | pluralise('Comment') }} on List: &nbsp;</b>
      <router-link :to="'/readlist/' + rut.id">
        {{ rut.title }}
      </router-link>
    </div>
    <div v-for="comment in comments" :key="comment.id">
      <comment :comment="comment"></comment>
    </div>
    <div v-if="hasMoreComment">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreComment" 
                 :disabled="!hasMoreComment">
                 Show More Comments
      </el-button>
    </div>
    <div class="comment">
      <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
    </div>
    <div class="rcomment-side"></div>
  </div>
</template>

<script>
import { fetchRutComments } from '@/api/api'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'

export default {
  name: 'rut-comment',
  title () {
    return 'Discuss: ' + this.rut.title
  },
  components: { Comment, Reply },
  data () {
    return {
      rut: {},
      comments: [],
      commentCount: 0,
      currentPage: 1,
      refer: { re: 'rut', id: this.$route.params.id }
    }
  },
  computed: {
    hasMoreComment () {
      return this.comments.length < this.commentCount
    }
  },
  methods: {
    loadCommentData () {
      let rutid = this.$route.params.id
      fetchRutComments(rutid).then(resp => {
        let data = resp.data
        this.rut = data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComment () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchRutComments(rutid, params).then(resp => {
        this.comments.push(...resp.data.comments)
        this.currentPage += 1
      })
    },
    updateNew (data) {
      this.comments.unshift(data)
      this.commentCount += 1
    }
  },
  created () {
    this.loadCommentData()
  }
}
</script>

<style lang="stylus" scoped>
.rut-comment
  padding 5px 180px 10px 0px
  position relative
  .comment-main
    padding 10px
  .rcomment-side
    position absolute
    top 10px
    right 0
    width 300px
</style>
