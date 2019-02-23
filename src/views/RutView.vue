<template>
  <div class="rut-page" v-if="rut">
    <div class="rut-view">
      <div class="title">
        <h2>{{ rutTitle }}</h2>
        <p class="meta">
          <span v-if="rut.author_id">{{ rut.author_id }}</span>
          | Created: {{ rut.create_at | toMDY }} 
          <!-- <span v-if="rut.renewat"> | Updated: {{ rut.renewat | toMDY }}</span> -->
          | including {{ rut.item_count | pluralise('item') }} 
        </p>
      </div>
      <div class="content">
        <div v-html="md(rut.content)"></div>
      </div>
    </div>
    <div class="sharebar">
      <share-bar></share-bar>
    </div>
    <div class="rut-side"></div>
  </div>
</template>

<script>
import marked from '../util/marked'
import ShareBar from '@/components/Misc/ShareBar.vue'

export default {
  name: 'rut-view',
  components: { ShareBar },
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

<style scoped>
.rut-page {
  padding: 10px 250px 10px 0px;
  position: relative;
}
.rut-page .rut-view {
  background-color: #f5f7f8;
  padding: auto;
}
.rut-view .title {
    padding: 0 10px;
}
.rut-view .title .meta {
  color: #828282;
  font-size: 12px;
}
.rut-view .content, 
.rut-view .itemtip {
  background-color: #fbfbf8;
  padding: 5px 10px;
  border-bottom: 2px solid #eee;
}
.rut-view .sharebar {
  font-size: .85em;
  padding: 5px;
  text-align: right;
}
.rut-page .rut-side {
  position: absolute;
  right: 0;
  top: 10px;
  width: 240px;
}
</style>
