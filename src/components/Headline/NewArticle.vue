<template>
  <div class="article-page">
    <b class="title"> Post New Article:</b>&nbsp;&nbsp;
    <span v-if="itemId"><small>As Review on: &nbsp;</small>
      <router-link :to="'/item/' + itemId" target="_blank"
                  rel="noopener noreferrer" style="font-size:14px"
                  :title="currentItem.title || ''">
                  {{ (currentItem.title || ':::').slice(0, 64) }}
      </router-link>
    </span>
    <div>
      <headline-form class="article-form" :itemid="Number(itemId)"></headline-form>
    </div>
  </div>
</template>

<script>
import HeadlineForm from '@/components/Headline/HeadlineForm.vue'

export default {
  name: 'new-article',
  title: 'Post New Article',
  components: { HeadlineForm },
  data () {
    return {
      currentItem: this.$store.getters.currentItem,
      itemId: this.$route.params.id
    }
  }
}
</script>

<style lang="stylus" scoped>
.article-page
  padding 10px 120px
  position relative
  .article-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 20px
</style>