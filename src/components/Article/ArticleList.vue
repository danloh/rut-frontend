<template>
  <div class="article-list">
    <article-sum v-for="art in currentArticles" 
             :key="art.id" 
             :article="art" 
             :showCon="false">
    </article-sum>
    <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreArticle" 
                 :disabled="!hasMore">
                 Show More
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ArticleSum from '@/components/Article/ArticleSum.vue'

export default {
  name: 'article-list',
  props: { param: Object },
  components: { ArticleSum },
  computed: {
    ...mapGetters([
      'currentArticles',
      'currentH',
      'maxH'
    ]),
    hasMore () {
      return this.currentH < this.maxH
    }
  },
  methods: {
    loadData () {
      let params = this.param
      this.$store.dispatch('getArticles', params)
    },
    loadmoreArticle () {
      let params = Object.assign({'page': this.currentH}, this.param)
      this.$store.dispatch('moreArticles', params)
    }
  },
  created () {
    this.loadData()
  }
}
</script>

<style lang="stylus" scoped>
.article-list
  padding auto
</style>