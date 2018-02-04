<template>
  <div class="headline-comment">
    <headline :headline="headline" :key="headline.id" :showCon="true"></headline>
    <b>{{ commentCount | pluralise('comment') }}</b>
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
  </div>
</template>

<script>
import { fetchHlComments } from '@/api/api'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import Headline from '@/components/Headline/Headline.vue'

export default {
  name: 'headline-comment',
  title () {
    return 'Discuss: ' + this.headline.title
  },
  components: { Headline, Comment, Reply },
  data () {
    return {
      headline: {},
      comments: [],
      commentCount: 0,
      currentPage: 1,
      refer: { re: 'headline', id: this.$route.params.id }
    }
  },
  computed: {
    hasMoreComment () {
      return this.comments.length < this.commentCount
    },
    submitor () {
      return this.headline.submitor
    }
  },
  methods: {
    loadCommentData () {
      let headlineid = this.$route.params.id
      fetchHlComments(headlineid)
      .then(resp => {
        let data = resp.data
        this.headline = data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComment () {
      let headlineid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchHlComments(headlineid, params)
      .then(resp => {
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
.headline-comment
  padding 5px 200px 10px 0px
  position relative
  .headline-main
    padding 5px
    .meta 
      color #828282
      font-size 0.8em
  .circle-side
    position absolute
    top 10px
    right 0
    width 300px
</style>
