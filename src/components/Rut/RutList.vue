<template>
  <div>
    <b v-if="action !== '0'">{{action.toUpperCase()}}: {{ totalCount }}</b>
    <div class="rut-list">
      <rut-sum v-for="rut in ruts" :key="rut.id" :rut="rut"></rut-sum>
    </div>
    <!-- <div v-if="hasMore">
      <el-button class="blockbtn" size="mini" 
                 @click="loadmoreRuts" :disabled="!hasMore">
                 Show More
      </el-button>
    </div> -->
  </div>
</template>

<script>
import RutSum from '../Rut/RutSum.vue'
import { fetchRuts } from '../../api'

export default {
  name: 'rut-list',
  props: {
    per: String,   // should be user,item,tag
    action: {type: String, default: '0'},
    id: String,
  },
  components: { RutSum },
  data () {
    return {
      totalCount: 0,
      ruts: [],
      currentPage: 0
    }
  },
  computed: {},
  methods: {
    loadmoreRuts () {}
  },
  created () {
    let perid = this.id ? this.id : this.$route.params.id
    fetchRuts(this.per, perid, this.action).then(resp => {
      this.ruts = resp.data.ruts
      this.$store.commit('SET_RUTS', this.ruts)  // as cache
      this.totalCount = resp.data.count
      this.currentPage = 1
    })
  }
}
</script>

<style scoped>
.rut-list {
  width: 100%;
  margin-top: 5px;
}
</style>
