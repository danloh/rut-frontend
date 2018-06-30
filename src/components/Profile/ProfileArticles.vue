<template>
  <div class="article-list">
    <b>ARTICLES / REVIEWS {{ totalHeadlines }}</b>
    <headline-list :param="listParam"></headline-list>
  </div>
</template>

<script>
import HeadlineList from '@/components/Headline/HeadlineList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'profile-article',
  components: { HeadlineList },
  data () {
    return {
      listParam: {}
    }
  },
  computed: {
    ...mapGetters(['totalHeadlines'])
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
