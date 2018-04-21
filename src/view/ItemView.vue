<template>
  <div class="item-page" v-if="currentItem.id">
    <div class="item-main">
      <item-sum :item="currentItem" :out="true" :key="currentItem.id"></item-sum> <!--key to re-render-->
      <div>
        <b>More Details</b> &nbsp;&nbsp;&nbsp;
        <el-button class="editlink" type="text" @click="toEditItem" v-if="canEdit">
           ...Edit
        </el-button>
      </div>
      <div class="item-detail">
        <div v-html="itemDetail || '...'"></div>
        <el-button type="text" size="mini" @click="showShort=false" v-if="showShort">
          ...More
        </el-button>
      </div>
      <div class="review-clip" v-if="canEdit">
        <div class="review-row">
          <b>Reviews</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link class="editlink" :to="'/review/item/' + currentItem.id">
            ...Post Review
          </router-link>
        </div>
        <review-list :param="reviewsParam"></review-list>
        <div class="clip-row">
          <b>Quotes</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <router-link class="editlink" to="/challenge">...Excerpt Quote</router-link>
        </div>
        <clip-list :param="cliplistParam"></clip-list>
      </div>
      <div class="include">
        <div class="inrut-row">
          <b>In {{currentItem.rutcount | pluralise('List')}}</b>
        </div>
        <div v-for="(rut, index) in inRuts" :key="index" :rut="rut"
             :class="[index % 2 == 0 ? 'odd-in-rut' : '', 'in-rut']">
          {{ index +1 }}. 
          <router-link :to="'/readlist/' + rut.id" :title="rut.title">
            {{ rut.title.slice(0, 120) }} ...
          </router-link>
        </div>
        <div v-if="hasMoreRut && canEdit" style="text-align:right">
          <el-button type="text" @click="loadmoreRuts" :disabled="!hasMoreRut">
            Show More
          </el-button>
        </div>
      </div>
    </div>
    <div class="item-side">
      <router-link :to="'/myrc/item/' + currentItem.id">
        <b style="font-size:0.8em">&nbsp;My Reviews or Excerpts</b>
      </router-link>
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
import { showLess } from '@/util/filters'

export default {
  name: 'item-view',
  title () {
    return this.currentItem.title
  },
  components: { ItemSum, ClipList, ReviewList },
  data () {
    return {
      canEdit: checkAuth(), // if load reviews / clips
      cliplistParam: {},
      reviewsParam: {},
      currentPage: 1,
      currentItem: {},
      showShort: true, // show less detail
      inRuts: []
    }
  },
  computed: {
    itemDetail () {
      let content = marked(this.currentItem.details)
      let least = 255
      let less = content.length > least && this.showShort
      if (less) {
        return showLess(content, least)
      } else {
        this.showShort = false
        return content
      }
    },
    hasMoreRut () {
      return this.inRuts.length < this.currentItem.rutcount
    }
  },
  methods: {
    loadItemData () {
      let itemid = this.$route.params.id
      this.cliplistParam = {'itemid': itemid}
      this.reviewsParam = {'itemid': itemid, 'ref': 'hot'}
      this.$store.dispatch('getItem', itemid).then(resp => {
        this.currentItem = resp.data
        this.inRuts = resp.data.inruts
      })
    },
    loadmoreRuts () {
      let itemid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchInRuts(itemid, params).then(resp => {
        this.inRuts.push(...resp.data)
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
    this.loadItemData()
  }
}
</script>

<style lang="stylus" scoped>
.item-page
  padding 10px 255px 10px 0px
  position relative
  .item-main
    margin-top 5px
    .item-detail
      background-color lighten(#f0f3f0, 45%)
      padding 5px
    .include
      padding 5px
      background-color lighten(#f0f3f0, 45%)
      .in-rut
        padding 5px
        a
          &:hover
            color #ff6600
      .odd-in-rut
        background-color lighten(#e0e6da, 55%)
    .inrut-row, .review-row, .clip-row
      color green
      margin 5px 0
      padding 5px
  .editlink
    font-size 0.75em
    font-weight 600
    color #409eff
  .item-side
    position absolute
    top 10px
    right 0
    width 245px   
</style>
