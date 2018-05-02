<template>
  <div class="rut-page">
    <div class="rut-view">
      <h2>{{ rutDetail.title }}</h2>
      <div v-html="md(intro)"></div>
      <br>
      <div v-for="tip in tips" :key="tip.cid">
        <b>#{{tip.order}}&nbsp;&nbsp;{{tip.item.title}}</b>
        <a :href="'https://www.google.com/search?q=' + tip.item.title" target="_blank"
           style="color:#999;font-size:14px">
           ({{tip.item.byline}}&nbsp;#{{tip.item.uid}})
        </a>
        <div v-html="md(tip.tip)"></div>
      </div>
      <br>
      <div v-html="md(epilog)"></div>
    </div>
    <div class="rut-side"></div>
  </div>
</template>

<script>
import marked from '@/util/marked'

export default {
  name: 'rut-read',
  data () {
    return {
      rutDetail: {},
      rutid: '',
      intro: '',
      tips: [],
      epilog: '',
      creatorname: ''
    }
  },
  title () {
    return this.rutDetail.title
  },
  methods: {
    loadRutData () {
      let data = this.$store.getters.rutDetail
      if (data.id) {
        this.rutDetail = data
        this.rutid = data.id
        this.creatorname = data.creator.name
        this.intro = data.intro
        this.tips = data.tips
        this.epilog = data.epilog
      } else {
        let rutid = this.$route.params.id
        this.$router.push(`/readlist/${rutid}`)
      }
    },
    md (content) {
      return marked(content)
    }
  },
  created () {
    this.loadRutData()
  }
}
</script>

<style lang="stylus" scoped>
.rut-page
  padding 10px 250px 10px 0px
  position relative
  background-color lighten(#eceef1, 50%)
  .rut-view
    padding 10px 30px
    background-color lighten(#f6f6f1, 50%)
  .rut-side
    position absolute
</style>
