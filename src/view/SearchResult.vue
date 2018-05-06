<template>
  <div class="search-result">
    <b>{{ searchItems.length | pluralise('Result') }} for Keyword: 
      <span style="color:#337ab7">{{ itemKeyword }}</span>
    </b>
    <div class="result-list" v-if="type==='item'">
      <div class="result" v-for="item in searchItems" :key="item.id" :item="item" >
        <b>{{ item.cate }}</b> 
        <router-link :to="'/item/' + item.id" 
                     target="_blank" rel="noopener noreferrer">
          {{ item.title }}
        </router-link>
      </div>
    </div>
    <el-button size="mini" @click="searchMoreItem" :disabled="!hasMore">
      Maybe More
    </el-button>
    <br>
    <b style="font-size:0.8em">No Result? You can help 
      <router-link to="/newitem" 
                   target="_blank" rel="noopener noreferrer">
                   Submit New Item
      </router-link>
    </b>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { searchItems } from '@/api/api'
import { checkAuth } from '@/util/auth'

export default {
  name: 'search-result',
  title: 'Search Items',
  props: {
    type: String // to be: item or rut
  },
  data () {
    return {
      currentPage: 1,
      hasMore: true
    }
  },
  computed: {
    ...mapGetters([
      'searchItems',
      'itemKeyword'
    ])
  },
  methods: {
    searchMoreItem () {
      if (checkAuth() && this.itemKeyword.trim()) {
        let param = {
          'uid_or_title': this.itemKeyword.trim(),
          'page': this.currentPage
        }
        searchItems(0, param).then(resp => {
          this.$store.commit('MORE_SEARCH_ITEMS', resp.data)
          this.currentPage += 1
          if (resp.data.items.length === 0) {
            this.hasMore = false
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-result
  margin-top 10px
.result-list
  width 80%
  margin-top 5px
  .result
    padding 8px 0
    border-bottom 2px dashed #ddd
</style>