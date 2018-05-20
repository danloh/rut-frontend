<template>
  <div>
    <div class="comment-list">
      <comment v-for="comment in comments" :key="comment.id" :comment="comment"></comment>
    </div>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreComments" :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
    <div class="discuss">
      <reply class="reply" 
             :refer="refer" :tagsuf="' #' + tagname" :show="true" 
             @newreply="updateNew">
      </reply>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import { fetchTagComments } from '@/api/api'

export default {
  name: 'tag-comments',
  components: { Comment, Reply },
  data () {
    return {
      tagname: null,
      refer: { re: 'tag', id: '' },
      commentCount: 0,
      comments: [],
      currentPage: 1
    }
  },
  computed: {
    hasMore () {
      return this.comments.length < this.commentCount
    }
  },
  methods: {
    loadComments () {
      this.tagname = this.$route.params.name
      fetchTagComments(this.tagname).then(resp => {
        let data = resp.data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComments () {
      let param = {'page': this.currentPage}
      fetchTagComments(this.tagname, param).then(resp => {
        this.comments.push(...resp.data.comments)
        this.currentPage += 1
      })
    },
    updateNew (data) {
      this.comments.unshift(data)
      this.commentCount += 1
    }
  },
  // watch: {
  //   '$route.params.name': 'loadComments'
  // },
  created () {
    this.loadComments()
  }
}
</script>

<style lang="stylus" scoped>
.comment-list
  width 100%
  margin-top 5px
</style>