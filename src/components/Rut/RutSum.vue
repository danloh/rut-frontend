<template>
  <div class="rut-sum">
    <router-link :to="'/readlist/' + rut.id">
      <span>
        <img class="cover" :src="cover" referrerPolicy="no-referrer" alt="Cover">
      </span>
      <span class="title">
        <router-link :to="'/readlist/' + rut.id"> {{ rut.title }}</router-link>
      </span>
      <div class="intro" v-html="intro"></div>
    </router-link>
    <span class="meta">
      <span>  including {{ rut.itemcount | pluralise('item') }}  
              | <router-link :to="'/readlist/' + rut.id">...See Detail</router-link>
      </span>
    </span>
  </div>
</template>

<script>
import { showLess } from '@/util/filters'
import marked from '@/util/marked'

export default {
  name: 'rut-sum',
  props: ['rut'],
  computed: {
    cover () {
      return this.rut.cover
    },
    intro () {
      let content = marked(this.rut.intro)
      return showLess(content)
    }
  }
}
</script>

<style lang="stylus" scoped>
.rut-sum
  background-color lighten(#e5ebe4, 90%)
  min-height 120px
  padding 10px 30px 10px 100px
  border-bottom 1px dashed #ddd
  position relative
  &:hover
    background-color lighten(#f3f3ed, 60%)
  .cover
    position absolute
    max-width 80px
    max-height 100px
    top 10px
    left 5px
  .title
    font-size 20px
    font-weight 700
    padding-top 10px
    a
      &:hover
        color #ff6600
  .intro
    color #828282
    font-size: 16px
  .meta
    font-size 14px
    color #337ab7
</style>