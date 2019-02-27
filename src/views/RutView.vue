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
    <div class="item" v-for="i in collects" :key="i.id">
      <div>
        <b class="indicator">#{{i.item_order}}&nbsp;</b> 
        <router-link :to="'/item/' + i.id">{{ i.title }}</router-link>
      </div>
      <div v-html="md(i.content)"></div>
    </div>
    <div class="sharebar">
      <share-bar></share-bar>
    </div>
    <div class="rut-side">
      <router-link :to="'/update/r/' + rutid">Edit...</router-link>
      <router-link :to="'/collect/' + rutid">Add...</router-link>
    </div>
  </div>
</template>

<script>
import { fetchPerItems, fetchCollect } from '../api'
import marked from '../util/marked'
import ShareBar from '@/components/Misc/ShareBar.vue'

export default {
  name: 'rut-view',
  components: { ShareBar },
  data () {
    return {
      rutTitle: '',
      rutid: '',
      items: [],
      collects: []
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
      let rid = this.rutid =  this.$route.params.id
      this.$store.dispatch('getRut', rid).then(resp => {
        this.rutTitle = resp.title
        this.loadItems(rid)
      })
    },
    loadItems (rutid) { // can be async??
      fetchPerItems('rut', rutid).then(resp => {
        let item_data = resp.data.items
        this.items = item_data
        for (let i of item_data) {
          let itemid = i.id
          fetchCollect(rutid, itemid).then(resp => {
            let data = resp.data.collects[0]
            let clct = {
              rutid: data.rut_id,
              item_order: data.item_order,
              content: data.content,
            }
            Object.assign(clct, i)
            this.collects.push(clct)
          })
        }
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
