<template>
  <div>
    <b>{{ searchItems.length | pluralise('Result') }}</b>
    <div class="result-list" v-if="type==='item'">
      <div class="result" v-for="item in searchItems" :key="item.id" :item="item" >
        <router-link :to="'/item/' + item.id" target="_blank" rel="noopener noreferrer">
          {{ item.title }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'search-result',
  props: {
    type: String // to be: item or rut
  },
  computed: {
    ...mapGetters([
      'searchItems'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.result-list
  width 80%
  margin-top 5px
  .result
    padding 8px 0
    border-bottom 2px solid #eee
</style>