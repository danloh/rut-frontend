<template>
  <div>
    <b>{{action.toUpperCase()}}: {{totalRuts}}</b>
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
  name: 'profile-ruts',
  props: { action: String }, // to be: create, star
  components: { RutSum },
  data () {
    return {
      totalRuts: 0,
      ruts: [],
      //currentPage: 0
    }
  },
  computed: {},
  methods: {
    loadmoreRuts () {
      let action = this.action
      let userid = this.$route.params.id
      let param = {'page': this.currentPage}
      // let params = {'action': action, 'userid': userid, 'param': param}
      fetchRuts(action, userid, param).then(resp => {
        this.currentRuts.push(...resp.data.ruts)
        this.currentPage += 1
      })
    }
  },
  created () {
    let action = this.action
    let userid = this.$route.params.id
    fetchRuts('user', userid, action).then(resp => {
      this.ruts = resp.data.ruts
      this.totalRuts = resp.data.count
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
