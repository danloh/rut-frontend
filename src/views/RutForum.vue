<template>
  <div class="rut-forum" v-if="rutTitle">
    <div class="forum-main">
      <small>Forum {{ rut.comment_count}}: </small>
      <router-link :to="'/r/' + rutID">{{ rutTitle }}</router-link>
    </div>
    <etc-list :refer="refer"></etc-list>
  </div>
</template>

<script>
import EtcList from '../components/Etc/EtcList.vue'

export default {
  name: 'rut-forum',
  title () {
    return 'Forum: ' + this.rutTitle
  },
  components: { EtcList },
  data () {
    return {
      rut: {},
      rutID: '',
      rutTitle: '',
      refer: {},
    }
  },
  methods: {
    loadRut () {
      let rutid = this.$route.params.id
      this.$store.dispatch('getRut', rutid).then(resp => {
        this.rut = resp
        this.rutID = resp.id
        this.refer = { per: 'rut', perid: resp.id }
        this.rutTitle = resp.title
      })
    },
  },
  created () {
    this.loadRut()
  }
}
</script>

<style scoped>
.rut-forum {
  padding: 5px 240px 10px 0px;
  position: relative;
}
</style>
