<template>
  <div class="article-list">
    <b>ARTICLES / REVIEWS {{ totalArticles }}</b>
    <article-list :param="listParam"></article-list>
  </div>
</template>

<script>
import ArticleList from '@/components/Article/ArticleList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'profile-article',
  components: { ArticleList },
  data () {
    return {
      listParam: {}
    }
  },
  computed: {
    ...mapGetters(['totalArticles'])
  },
  created () {
    this.listParam = {userid: this.$store.getters.currentUserID}
  }
}
</script>

<style lang="stylus" scoped>
.article-list
  padding auto
</style>
