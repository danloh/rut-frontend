<template>
  <div class="view-main">
    <b> My Reviews / Excerpts On:</b>
    <router-link :to="'/item/' + itemid" style="font-size:14px">
      {{ (currentItem.title || ':::').slice(0, 64) }}
    </router-link>
    <div class="submenu">
      <b style="color: orange">Reviews</b>
      <router-link class="editlink" :to="'/review/item/' + itemid" style="float:right">
        ...Post Review
      </router-link>
    </div>
    <review-list :param="listParam"></review-list>
    <div class="submenu">
      <b style="color: orange">Quotes</b>
      <router-link class="editlink" to="/challenge" style="float:right">...Excerpt Quote</router-link>
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
    border-bottom 1px solid #eee
.editlink
  font-size 12px
  font-weight 600
</style>
