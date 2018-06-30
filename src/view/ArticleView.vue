<template>
  <div class="article-comment">
    <article-sum :article="article" :key="article.id" :showCon="true"></article-sum>
    <div class="share">
      <share-bar></share-bar>
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
  </div>
</template>

<script>
import { fetchArticle, fetchHlComments } from '@/api/api'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import ArticleSum from '@/components/Article/ArticleSum.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'

export default {
  name: 'article-comment',
  title () {
    return 'Discuss: ' + this.article.title
  },
  components: { ArticleSum, Comment, Reply, ShareBar },
  data () {
    return {
      article: {},
      comments: [],
      commentCount: 0,
      currentPage: 1,
      refer: { re: 'article', id: this.$route.params.id }
    }
  },
  computed: {
    hasMoreComment () {
      return this.comments.length < this.commentCount
    },
    submitor () {
      return this.article.submitor
    }
  },
  methods: {
    loadData () {
      let articleid = this.$route.params.id
      let articleG = this.$store.getters.currentArticle
      if (articleG.id === Number(articleid)) {
        this.article = articleG
      } else {
        fetchArticle(articleid).then(resp => {
          this.article = resp.data
          this.$store.commit('SET_ARTICLE', resp.data)
        })
      }
      fetchHlComments(articleid).then(resp => {
        let data = resp.data
        // this.article = data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComment () {
      let articleid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchHlComments(articleid, params).then(resp => {
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
    this.loadData()
  }
}
</script>

<style lang="stylus" scoped>
.article-comment
  padding 5px 200px 10px 0px
  position relative
  .article-main
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
