<template>
  <div class="item-page">
    <div class="item-main">
      <item-sum :item="currentItem" :key="currentItem.id"></item-sum> <!--key to re-render-->
      <div>
        <b>>></b>&nbsp;&nbsp;<b>More Details</b> &nbsp;&nbsp;&nbsp;
        <el-button type="text" @click="toEditItem"> ...Edit Detail</el-button>
      </div>
      <div class="item-detail">
        <div v-html="itemDetail"></div>
      </div>
      <div class="submenu">
        <b>>></b>&nbsp;&nbsp;<b style="color: orange">Reviews</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" :to="'/review/item/' + currentItem.id">...Post Review</router-link>
      </div>
      <review-list :param="reviewsParam"></review-list>
      <div class="submenu">
        <b>>></b>&nbsp;&nbsp;<b style="color: orange">Clips</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <router-link class="editlink" to="/challenge">...Excerpt Quote</router-link>
      </div>
      <clip-list :param="cliplistParam"></clip-list>
    </div>
    <div class="item-side">
      <div class="include">
        <b class="in-title">Included in {{currentItem.rutcount | pluralise('List')}}</b>
        <p class="in-item" v-for="(rut, index) in inRuts" :key="index" :rut="rut">
          - <router-link :to="'/readuplist/' + rut.id" :title="rut.title"> {{ rut.title.slice(0, 42) }}...</router-link>
        </p>
        <div v-if="hasMoreRut">
          <el-button class="blockbtn" size="mini" @click="loadmoreRuts" :disabled="!hasMoreRut">Show More</el-button>
        </div>
        <br>
        <router-link :to="'/myrc/item/' + currentItem.id">My Reviews or Quotes</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import ReviewList from '@/components/Item/ReviewList.vue'
import ClipList from '@/components/Challenge/ClipList.vue'
import { fetchInRuts, checkItemLocked, lockItem } from '@/api/api'
import marked from '@/util/marked'
import { checkAuth } from '@/util/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'item-view',
  title () {
    return this.currentItem.title
  },
  components: { ItemSum, ClipList, ReviewList },
  data () {
    return {
      cliplistParam: {},
      reviewsParam: {},
      currentPage: 1
    }
  },
  computed: {
    ...mapGetters([
      'currentItem',
      'inRuts'
    ]),
    itemDetail () {
      return marked(this.currentItem.details)
    },
    hasMoreRut () {
      return this.inRuts.length < this.currentItem.rutcount
    }
  },
  methods: {
    loadmoreRuts () {
      let itemid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchInRuts(itemid, params)
      .then(resp => {
        this.$store.commit('MORE_INRUTS', resp.data)
        this.currentPage += 1
      })
    },
    toEditItem () {
      let currentUserID = this.$store.getters.currentUserID
      if (!currentUserID || !checkAuth()) { // utilize short-circle to set default auth
        this.$message('Please Log in to Continue')
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      } else {
        let itemid = this.$route.params.id
        checkItemLocked(currentUserID, itemid).then(resp => {
          if (!resp.data) {
            lockItem(itemid)
            this.$router.push(`/edit/item/${itemid}`)
          } else {
            this.$message('in Editing...Please Try Later')
          }
        })
      }
    }
  },
  created () {
    let itemid = this.$route.params.id
    this.cliplistParam = {'itemid': itemid}
    this.reviewsParam = {'itemid': itemid, 'ref': 'hot'}
    this.$store.dispatch('getItem', itemid)
  }
}
</script>

<style lang="stylus" scoped>
.item-page
  padding 10px 255px 10px 0px
  position relative
  .item-main
    padding auto
    .item-detail
      background-color lighten(#f0f3f0, 45%)
      padding 5px
    .submenu
        margin 5px 0
        padding 5px
  .editlink
    font-size 0.75em
    font-weight 600
  .item-side
    position absolute
    top 10px
    right 0
    width 245px
    .include
      margin-top 0px
      padding 5px
      background-color #f0f3f0
      .in-title
        padding 2px 5px
        color green
      .in-item
        padding 2px 5px
        font-size 0.85em
        background-color lighten(#f0f3f0, 45%)
        a
          &:hover
            color #ff6600
</style>
