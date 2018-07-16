<template>
  <div class="item-page" v-if="currentItem.id">
    <div class="item-main">
      <item-sum :item="currentItem" :out="true" :key="currentItem.id"></item-sum> <!--key to re-render-->
      <div>
        <b>More Details</b>
        <span style="float:right">
          <a :href="currentItem.submitor.id ? '/profile/' + currentItem.submitor.id : '#'">
            <small style="color:#999;font-size:10px">Sumited by {{currentItem.submitor.name}}</small>
          </a>
          <el-button class="editlink" type="text" @click="toEditItem" v-if="canEdit">
           &nbsp;&nbsp;...Edit &nbsp;
          </el-button>
        </span>
      </div>
      <div class="item-detail">
        <div v-html="itemDetail || '...'"></div>
        <el-button type="text" size="mini" @click="showShort=false" v-if="showShort">
          ...More
        </el-button>
      </div>
      <br>
      <!-- <div class="clip-row" v-if="currentItem.clipcount > 0">
        <b>{{currentItem.clipcount | pluralise(' Quote')}}</b>
      </div> -->
      <clip-list :param="cliplistParam" :ShowI="false"></clip-list>
      <!-- <div class="article-row" v-if="currentItem.reviewcount > 0">
        <b>{{currentItem.reviewcount | pluralise(' Review')}}</b>
      </div> -->
      <article-list :param="reviewsParam"></article-list>
      <!-- <div class="inrut-row" v-if="currentItem.rutcount > 0">
        <b>{{currentItem.rutcount | pluralise(' List')}}</b>
      </div> -->
      <div class="include" v-if="currentItem.rutcount > 0">
        <div v-for="(rut, index) in inRuts" :key="index" :rut="rut" class="in-rut">
          <router-link :to="'/readlist/' + rut.id" :title="rut.title">
            {{ rut.title.slice(0, 82) }} ...
          </router-link>
          <tip-sum class="tip" :tip="rut.itemtip" :less="true" :key="index"></tip-sum>
        </div>
        <div v-if="hasMoreRut && canEdit" style="text-align:right">
          <el-button type="text" @click="loadmoreRuts" :disabled="!hasMoreRut">
            Show More
          </el-button>
        </div>
      </div>
    </div>
    <div class="item-side">
      <div class="tags">
        <b>Tags</b>
        <el-button class="editlink" type="text" style="float:right"
                   @click="showAdd=!showAdd" v-if="canEdit">
                   {{ showAdd ? '..Cancel': '...Add' }}
        </el-button>
        <el-input size="mini" v-model="newTags" v-show="showAdd" 
                  @keyup.enter.native="addTags" 
                  placeholder="Input Tag, then Press Enter">
        </el-input>
        <br>
        <span class="tag" v-for="(t, index) in itemTags" :key="index">
          <a :href="'/tag/' + t.tagname">
            <small>{{ t.tagname }}</small>
          </a>
        </span>&nbsp;&nbsp;
      </div>
      <router-link :to="'/myrc/item/' + currentItem.id">
        <b>My Track</b>
      </router-link><br>
      <router-link class="editlink" to="/challenge">...Excerpt Quote</router-link><br>
      <router-link class="editlink" :to="'/newarticle/' + currentItem.id">
        ...Post Review
      </router-link>
    </div>
  </div>
</template>

<script>
import ItemSum from '@/components/Item/ItemSum.vue'
import ArticleList from '@/components/Article/ArticleList.vue'
import ClipList from '@/components/Challenge/ClipList.vue'
import TipSum from '@/components/Rut/TipSum.vue'
import { fetchInRuts, checkItemLocked, lockItem, addItemTag } from '@/api/api'
import marked from '@/util/marked'
import { checkAuth } from '@/util/auth'
import { showLess } from '@/util/filters'

export default {
  name: 'item-view',
  title () {
    return this.currentItem.title
  },
  components: { ItemSum, ClipList, ArticleList, TipSum },
  data () {
    return {
      canEdit: checkAuth(), // if load reviews / clips
      cliplistParam: {},
      reviewsParam: {},
      currentPage: 1,
      currentItem: {},
      showShort: true, // show less detail
      inRuts: [],
      itemTags: [],
      showAdd: false,
      newTags: ''
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
      this.reviewsParam = {'itemid': itemid, 'ref': 'top'}
      this.$store.dispatch('getItem', itemid).then(resp => {
        let data = resp.data
        this.currentItem = data
        this.inRuts = data.inruts
        this.itemTags = data.tags
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
    },
    addTags () {
      if (!this.newTags.trim()) return
      let itemid = this.$route.params.id
      let param = {'tags': this.newTags.trim()}
      addItemTag(itemid, param).then(resp => {
        this.showAdd = false
        if (!resp.data) return
        this.itemTags = resp.data
      })
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
      padding 10px
      background-color lighten(#f0f3f0, 45%)
      .in-rut
        border-bottom 1px dashed #ddd
      .tip
        background-color lighten(#e0e6da, 70%)
        padding 5px
        font-size 16px
    .inrut-row, .article-row, .clip-row
      color green
      margin 5px 0
      padding 5px
      border-bottom 1px solid #eee
  .editlink
    font-size 12px
    color #409eff
  .item-side
    position absolute
    top 10px
    right 0
    width 245px
    .tags
      background-color lighten(#e5ebe4, 50%)
      margin-bottom 10px
      .tag
        background-color #eee
        padding 2px
        margin-right 5px
        a
          &:hover
            background-color #ddd
            padding 2px
</style>
