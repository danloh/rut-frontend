<template>
  <div class="rut-forum">
    <etc-list :refer="refer"></etc-list>
  </div>
</template>

<script>
import EtcList from '../components/Etc/EtcList.vue'

export default {
  name: 'rut-forum',
  props: { rutid: String,},
  components: { EtcList },
  data () {
    return { refer: {} }
  },
  created () {
    this.refer = { per: 'rut', perid: this.rutid }
  }
}
</script>

<style scoped>
.rut-forum {
  padding: 5px;
  position: relative;
}
</style>
