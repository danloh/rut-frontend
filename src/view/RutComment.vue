<template>
  <div class="rut-comment">
    <div class="comment-main">
      <b style="font-size: 1.5em">Discuss: &nbsp;&nbsp;</b><router-link :to="'/readuplist/' + rut.id">{{ rut.title }}</router-link>
    </div>
    <b>{{ commentCount | pluralise('comment') }}</b>
    <div v-for="comment in comments" :key="comment.id">
      <comment :comment="comment"></comment>
    </div>
    <div v-if="hasMoreComment">
      <el-button class="blockbtn" size="mini" @click="loadmoreComment" :disabled="!hasMoreComment">Show More Comments</el-button>
    </div>
    <div class="comment">
      <reply class="reply" :refer="refer" :show="true" @newreply="updateNew"></reply>
    </div>
    <div v-if="hasChallenge">
      <challenge-list></challenge-list>
    </div>
    <div class="circle-side">
      <b style="font-size:1.2em">Circles</b>
      <circle-list :circles="circles"></circle-list>
      <div v-if="hasMoreCircle">
        <el-button class="blockbtn" size="mini" @click="loadmoreCircle" :disabled="!hasMoreCircle">Show More Circles</el-button>
      </div>
      <el-button type="text" @click="openDialog=true">...Launch Circle</el-button>
      <!-- dialog -->
      <el-dialog title="Launch Circle" :visible.sync="openDialog" width="40%">
        <el-form :model="circleForm" :rules="rules" ref="circleForm" size="mini">
          <el-form-item prop="name">
            <el-input v-model="circleForm.name" placeholder="Name"></el-input>
          </el-form-item>
          <el-form-item prop="address">
            <el-input v-model="circleForm.address" placeholder="Detail Address"></el-input>
          </el-form-item>
          <el-form-item prop="area">
            <el-input v-model="circleForm.area" placeholder="Area, like: Bayarea SF"></el-input>
          </el-form-item>
          <el-form-item prop="time">
            <el-input v-model="circleForm.time" placeholder="Time, like: Every Sat. 2PM - 4PM"></el-input>
          </el-form-item>
          <el-form-item prop="note">
            <el-input type="textarea" v-model="circleForm.note" :autosize="{minRows:3}" placeholder="Here just show basic info, You can provide more info by linking to detail page"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="openDialog=false">Cancel</el-button>
          <el-button type="success" @click="newCircle('circleForm', circleForm)">Launch</el-button>
        </div>
      </el-dialog>
      <!-- dialog end -->
    </div>
  </div>
</template>

<script>
import { fetchRutComments, fetchRutCircles, postCircle } from '@/api/api'
import Comment from '@/components/Comment/Comment.vue'
import Reply from '@/components/Comment/Reply.vue'
import ChallengeList from '@/components/Rut/ChallengeList.vue'
import CircleList from '@/components/Rut/CircleList.vue'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'rut-comment',
  title () {
    return 'Discuss: ' + this.rut.title
  },
  components: { Comment, Reply, ChallengeList, CircleList },
  data () {
    return {
      rut: {},
      comments: [],
      commentCount: 0,
      currentPage: 1,
      circles: [],
      circleCount: 0,
      currentC: 1,
      refer: { re: 'rut', id: this.$route.params.id },
      openDialog: false,
      circleForm: {
        name: '',
        address: '',
        area: '',
        time: '',
        note: ''
      },
      rules: {
        name: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        address: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 120, message: 'Max Length should be 120', trigger: 'blur' }
        ],
        area: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        time: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        note: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 120, message: 'Max Length should be 200', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    hasMoreComment () {
      return this.comments.length < this.commentCount
    },
    hasMoreCircle () {
      return this.circles.length < this.circleCount
    },
    hasChallenge () {
      return this.rut.challengecount > 0
    }
  },
  methods: {
    loadCommentData () {
      let rutid = this.$route.params.id
      fetchRutComments(rutid)
      .then(resp => {
        let data = resp.data
        this.rut = data
        this.comments = data.comments
        this.commentCount = data.commentcount
      })
    },
    loadmoreComment () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentPage}
      fetchRutComments(rutid, params)
      .then(resp => {
        this.comments.push(...resp.data.comments)
        this.currentPage += 1
      })
    },
    loadCircles () {
      let rutid = this.$route.params.id
      fetchRutCircles(rutid)
      .then(resp => {
        let data = resp.data
        this.circles = data.circles
        this.circleCount = data.circlecount
      })
    },
    loadmoreCircle () {
      let rutid = this.$route.params.id
      let params = {'page': this.currentC}
      fetchRutCircles(rutid, params)
      .then(resp => {
        this.circles.push(...resp.data.circles)
        this.currentC += 1
      })
    },
    updateNew (data) {
      this.comments.unshift(data)
    },
    newCircle (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            address: form.address.trim(),
            area: form.area.trim(),
            time: form.time.trim(),
            note: form.note.trim()
          }
          let rutid = this.rut.id
          postCircle(rutid, data).then(resp => {
            this.openDialog = false
            this.circles.push(resp.data)
          })
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Please Log in to Continue'
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
    this.loadCommentData()
    this.loadCircles()
  }
}
</script>

<style lang="stylus" scoped>
.rut-comment
  padding 5px 315px 10px 0px
  position relative
  .comment-main
    padding 5px
  .circle-side
    position absolute
    top 10px
    right 0
    width 300px
</style>
