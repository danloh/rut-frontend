<template>
  <div class="rut-page" v-if="rut">
    <div class="rut-view">
      <div class="title">
        <h2>{{ rutTitle }}</h2>
        <p class="meta">
          <!-- <span v-if="rut.url">{{ rut.url }}</span> -->
          | Created: {{ rut.create_at | toMDY }} 
          <!-- <span v-if="rut.renewat"> | Updated: {{ rut.renewat | toMDY }}</span> -->
          | including {{ rut.item_count | pluralise('item') }} 
        </p>
      </div>
      <div class="content">
        <div v-html="md(rut.content)"></div>
      </div>
    </div>
    <div class="rut-side"></div>
  </div>
</template>

<script>
import marked from '../util/marked'

export default {
  name: 'rut-view',
  components: { },
  data () {
    return {
      rutTitle: '',
      rutid: ''
    }
  },
  computed: {
    rut () {
      return this.$store.state.rut.ruts[this.$route.params.id]
    }
  },
  title () {
    return this.rutTitle
  },
  methods: {
    loadRut () {
      let rid = this.$route.params.id
      this.$store.dispatch('getRut', rid).then(resp => {
        this.rutTitle = resp.title
      })
    },
    md (content) {
      return marked(content)
    }
  },
  watch: {
    '$route': 'loadRut' // render re-used component for addtorut
  },
  created () {
    this.loadRut()
  }
}
</script>

<style lang="stylus" scoped>
$bgcolor = lighten(#f6f6f1, 50%)
.rut-page
  padding 10px 250px 10px 0px
  position relative
  .rut-view
    background-color lighten(#eceef1, 50%)
    padding auto
    .title
      padding 0 10px
      .meta 
        color #828282
        font-size 12px
    .content
      background-color $bgcolor
      padding 5px 10px
      border-bottom 2px solid #eee
    .toolbar
      display flex
      justify-content flex-end
    .sharebar
      font-size 0.85em
      padding 5px
      text-align right
  .rut-side
    position absolute
    right 0
    top 10px
    width 240px
</style>
