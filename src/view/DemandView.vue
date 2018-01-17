<template>
  <div class="demand-page">
    <div class="demand-main">
      <demand :demand="demandDetail" :key="demandDetail.id"></demand>
      <div class="answer">
        <b>Answers to This Demand:</b>
        <el-button size="mini" type="text" @click="loadCreatedThenAsAnswer">...Link To Answer</el-button>
        <div class="title" v-for="(rut, index) in answers" :key="index" :rut="rut">
          -- <router-link :to="'/readuplist/' + rut.id" :title="rut.title"><b>{{ rut.title.slice(0, 142) }} ...</b></router-link>
          <!-- <p v-html="rut.intro"></p> -->
        </div>
        <div v-if="hasMoreAnswer">
          <el-button size="mini" @click="loadmoreAnswer" :disabled="!hasMoreAnswer">Show More</el-button>
        </div>
      </div>
      <div class="share">
        <share-bar :prefix="'Would you like answer this question:  '"></share-bar>
      </div>
      <!-- link to a rut as answer dialog -->
      <el-dialog title="Link A list as Answer" :visible.sync="showDialog" width="45%">
        <el-form :model="asForm" ref="asForm">
          <el-form-item prop="rut">
            <el-select v-model="asForm.selectRutID">
              <el-option v-for="r in createdRuts" :key="r.id" :label="r.title" :value="r.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showDialog = false">Cancel</el-button>
          <el-button size="mini" type="success" @click="asAnswer('asForm', asForm)">As Answer</el-button>
        </div>
      </el-dialog>
      <!-- dialog end -->
      <b>Discuss</b>
      <div v-for="comment in comments" :key="comment.id">
        <comment :comment="comment"></comment>
      </div>
      <div v-if="hasMoreComment">
        <el-button class="blockbtn" size="mini" @click="loadmoreComment" :disabled="!hasMoreComment">Show More Comments</el-button>
      </div>
      <div class="comment">
        <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
      </div>
    </div>
    <div class="demand-side"></div>
  </div>
</template>

<script>
import Demand from '@/components/Demand/Demand.vue'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import ShareBar from '@/components/Misc/ShareBar.vue'
import { fetchProfileRuts, rutAsAnswer, fetchDemandComments, fetchDemandAnswers } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'demand-view',
  title () {
    return this.demandDetail.body
  },
  components: { Demand, Comment, Reply, ShareBar },
  data () {
    return {
      refer: { re: 'demand', id: this.$route.params.id },
      answers: [],
      answerCount: 0,
      currentaPage: 1,
      comments: [],
      commentCount: 0,
      currentPage: 1,
      showDialog: false,
      asForm: {
        selectRutID: null
      },
      createdRuts: []
    }
  },
  computed: {
    ...mapGetters([
      'demandDetail'
    ]),
    hasMoreComment () {
      return this.comments.length < this.commentCount
    },
    hasMoreAnswer () {
      return this.answers.length < this.answerCount
    }
  },
  methods: {
    loadDemandData () {
      let demandid = this.$route.params.id
      this.$store.dispatch('getDemand', demandid)
      .then(resp => {
        let data = resp.data
        this.answers = data.answers
        this.answerCount = data.answercount
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    updateNew (data) {
      this.comments.unshift(data)
    },
    loadmoreComment () {
      let params = {'page': this.currentPage}
      fetchDemandComments(this.demandDetail.id, params)
      .then(resp => {
        this.comments.push(...resp.data)
        this.currentPage += 1
      })
    },
    loadmoreAnswer () {
      let params = {'page': this.currentaPage}
      fetchDemandAnswers(this.demandDetail.id, params)
      .then(resp => {
        this.answers.push(...resp.data)
        this.currentaPage += 1
      })
    },
    // get created ruts then link to demand as answer
    loadCreatedThenAsAnswer () {
      if (checkAuth()) {
        let userid = this.$store.getters.currentUserID
        return fetchProfileRuts('created', userid)
        .then(resp => {
          this.createdRuts = resp.data.ruts
          this.showDialog = true
        })
      } else {
        this.showDialog = false
        this.$message({
          showClose: true,
          message: 'Should Log in to Access'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    asAnswer (formName, form) {
      if (!form.selectRutID) {
        this.$message({
          showClose: true,
          message: 'Please Select One'
        })
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let rutid = form.selectRutID
          let demandid = this.demandDetail.id
          return rutAsAnswer(rutid, demandid)
          .then((resp) => {
            this.showDialog = false
            this.$message({
              showClose: true,
              message: 'Link a New Answer, Done',
              type: 'success'
            })
            this.answers.push(resp.data)
          })
        } else if (!checkAuth()) {
          this.showDialog = false
          this.$message({
            showClose: true,
            message: 'Should Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
          })
        }
      })
    }
  },
  created () {
    this.loadDemandData()
  }
}
</script>

<style lang="stylus" scoped>
.demand-page
  padding 10px 260px 10px 0px
  position relative
  .demand-main
    padding auto
    .answer
      background-color white
      padding 5px
      margin-bottom 5px
      .title
        a
          &:hover
            color #ff6600
  .demand-side
    position absolute
    top 10px
    right 0
    width 240px
.el-select
  width 100%
</style>
