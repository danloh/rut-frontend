<template>
  <div class="view-main">
    <b style="font-size: 1.2em">MY REVIEWS AND QUOTES ON THE ITEM:</b>
    <router-link :to="'/item/' + itemid">{{currentItem.title || '......'}}</router-link>
    <div class="submenu">
      <b>>></b>&nbsp;&nbsp;<b style="color: orange">Reviews</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <router-link class="editlink" :to="'/review/item/' + itemid">...Post Review</router-link>
    </div>
    <review-list :param="listParam"></review-list>
    <div class="submenu">
      <b>>></b>&nbsp;&nbsp;<b style="color: orange">Clips</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <router-link class="editlink" to="/challenge">...Excerpt Quote</router-link>
    </div>
    <clip-list :param="listParam"></clip-list>
  </div>
</template>

<script>
import ReviewList from '@/components/Item/ReviewList.vue'
import ClipList from '@/components/Challenge/ClipList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'my-item-view',
  title: 'My Reviews and Quotes',
  components: { ClipList, ReviewList },
  props: ['itemid'],
  computed: {
    ...mapGetters([
      'currentItem'
    ]),
    listParam () {
      let userid = this.$store.getters.currentUserID
      return {'itemid': this.itemid, 'userid': userid}
    }
  }
}
</script>

<style lang="stylus" scoped>
.view-main
  padding 10px 255px 10px 0px
  .submenu
      margin 5px 0
      padding 5px
.editlink
  font-size 0.75em
  font-weight 600
</style>
