<template>
  <div class="challenge-page">
    <div class="challenge-view">
      <div>
        <el-form :model="clipForm" :rules="rules" ref="clipForm">
          <el-form-item prop="clip" style="margin-bottom:16px">
            <el-input type="textarea" v-model="clipForm.clip" :autosize="{minRows:3}" placeholder="Excerpt quotes %^&1:First Chapter,Page two:2"></el-input>
          </el-form-item>
          <el-form-item prop="doing" style="margin-bottom:8px" v-show="clipForm.clip.trim()">
            <el-select class="selectItem" v-model="clipForm.doingItemID" placeholder="Pick an item which you are working on">
              <el-option v-for="i in doingItems" :key="i.id" :label="i.title" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="clipForm.clip.trim()">
            <el-button type="success" size="mini" @click="submitClip('clipForm', clipForm)" :disabled="!clipForm.clip.trim()">Submit</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="submenu">
        <router-link to="/challenge/allclip">All Clips</router-link>
        <router-link to="/challenge/hotclip">Popular Clips</router-link>
        <router-link to="/challenge/myclip">My Clips</router-link>
      </div>
      <div class="clip-view">
        <router-view></router-view>
      </div>
    </div>
    <div class="challenge-side">
      <div class="right-title">
        <b>Working on Challenge:</b>
        <br>
        <router-link :to="'/readuplist/' + challengeRut.id"> {{ challengeRut.title || '...' }}</router-link>
        <br>
        <b class="deadline">Deadline: {{ dueDate | toMDY }} <el-button type="text" @click="showPicker=true">..Set</el-button></b>
        <br>
        <div class="datePick" v-show="showPicker">
          <el-date-picker
            v-model="pickDate"
            type="date"
            size="mini"
            placeholder="Pick a day"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button type="text" @click="setDue">OK</el-button>
        </div>
        <b>Including Items:</b>
      </div>
      <p class="right-item" v-for="(item, index) in items" :key="index" :item="item">
        <b>{{ item.cate }}</b> <router-link :to="'/item/' + item.id" :title="item.title"> {{ item.title.slice(0, 42) }}...</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import ClipList from '@/components/Challenge/ClipList.vue'
import { fetchChallengeItems, fetchChallengeRut, setDeadline } from '@/api/api'

export default {
  name: 'challenge',
  title: 'Readup.Tips - Challenge To Reading Anything',
  components: { ClipList },
  data () {
    return {
      clipForm: {
        clip: '',
        doingItemID: null
      },
      rules: {
        clip: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        doingItemID: [
          { required: true, message: 'Required', trigger: 'change' }
        ]
      },
      challengeRut: {},
      items: [], // items in challenge rut
      dueDate: '',
      doingItems: [],
      showPicker: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now()
        }
      },
      pickDate: null
    }
  },
  methods: {
    submitClip (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && form.clip.trim() && form.doingItemID !== null) {
          let data = { clip: form.clip.trim(), itemid: form.doingItemID }
          this.$store.dispatch('postClip', data)
          this.resetForm(formName)
        } else {
          this.$message({
            showClose: true,
            message: 'Something Wrong, Please Check'
          })
          return false
        }
      })
    },
    getChallengeRut () {
      return fetchChallengeRut()
      .then(resp => {
        this.challengeRut = resp.data.rut
        this.items = resp.data.items
        this.dueDate = resp.data.deadline
      })
    },
    getChallengeItems () {
      return fetchChallengeItems()
      .then(resp => {
        this.doingItems = resp.data
      })
    },
    setDue () {
      let params = {'date': this.pickDate}
      return setDeadline(params)
      .then((resp) => {
        this.showPicker = false
        this.dueDate = resp.data
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.getChallengeRut()
    this.getChallengeItems()
  }
}
</script>

<style lang="stylus" scoped>
.challenge-page
  padding 10px 285px 10px 0px
  position relative
  .challenge-view
    padding auto
    .selectItem
      width 100%
    .submenu
      margin-bottom 5px
      a
        color grey
        margin-right 0.85em
        &:hover
          color darkgreen
        &.router-link-active
          color orange
          font-weight 800
  .challenge-side
    position absolute
    top 10px
    right 0
    width 270px
    background-color #f0f3f0
    padding 5px
    .right-title
      padding 0px 5px
      b
        font-size 0.85em
      .deadline
          color: red
    .right-item
      padding 0 0 0 10px
      font-size 0.85em
      background-color lighten(#f0f3f0, 45%)
    a
      &:hover
        color #ff6600
</style>