<template>
  <div>
    <b>{{flag.toUpperCase()}} {{totalItems}}</b>
    <div class="item-list">
      <item-list :items="currentItems" @loadmore="loadmoreItems"></item-list>
    </div>
  </div>
</template>

<script>
import ItemList from '@/components/Item/ItemList.vue'
import { mapGetters } from 'vuex'
import { fetchProfileItems } from '@/api/api'

export default {
  name: 'profile-items',
  props: {
    flag: String // tobe: doing, todo, done
  },
  components: { ItemList },
  computed: {
    ...mapGetters([
      'totalItems',
      'currentItems',
      'currentR'
    ])
  },
  methods: {
    loadmoreItems () {
      let flag = this.flag
      let userid = this.$route.params.id
      let param = {'page': this.currentR}
      fetchProfileItems(flag, userid, param)
      .then(resp => {
        this.$store.commit('MORE_ITEMS', resp.data.items)
      })
    }
  },
  created () {
    let flag = this.flag
    let userid = this.$route.params.id
    let params = {'flag': flag, 'userid': userid}
    this.$store.dispatch('getItems', params)
  }
}
</script>

<style lang="stylus" scoped>
.item-list
  width 100%
  margin-top 5px
</style>