<template>
  <div class="circle">
    <div class="circle-main">
      <b>Get-Together With Readers&nbsp;&nbsp;</b>
      <b style="color:grey">Circles</b>
      <b style="color:orange">&nbsp;&nbsp;{{ areaKeyword }}</b>
    </div>
    <div class="circle-view">
      <circle-list :circles="circles"></circle-list>
      <div v-if="hasMoreCircle">
        <el-button size="mini" 
                  @click="loadmoreCircle" 
                  :disabled="!hasMoreCircle">
                  Show More Circles
        </el-button>
      </div>
    </div>
    <div class="circle-side">
      <el-button type="text" @click="openDialog=true">...Launch Circle</el-button><br>
      <el-input size="mini" v-model="areaKeyword" clearable
                @keyup.enter.native="loadCircles" placeholder="Search Area; []">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <br><br>
      <a style="cursor:pointer" @click="localCircle" title="myLocal">
        {{ myLocal.slice(0, 32) }}
      </a>
      <!-- launch dialog -->
      <el-dialog title="Launch Circle" width="520px" 
                 :visible.sync="openDialog">
        <el-form :model="circleForm" :rules="rules" ref="circleForm" size="mini">
          <el-form-item prop="name">
            <el-input type="textarea" autosize v-model="circleForm.name" placeholder="Name"></el-input>
          </el-form-item>
          <el-form-item prop="address">
            <el-input type="textarea" autosize v-model="circleForm.address" placeholder="Address"></el-input>
          </el-form-item>
          <el-form-item prop="time">
            <el-input v-model="circleForm.time" placeholder="Time, like: Every Sat. 2PM - 4PM"></el-input>
          </el-form-item>
          <el-form-item prop="note">
            <el-input type="textarea" :autosize="{minRows:3}" v-model="circleForm.note"  
                      placeholder="Can provide more info by linking to a detail page">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="newCircle('circleForm', circleForm)">
            Launch
          </el-button>
        </div>
      </el-dialog>
      <!-- end launch dialog -->
    </div>
  </div>
</template>

<script>
import { fetchCircles, postCircle } from '@/api/api'
import CircleList from '@/components/Circle/CircleList.vue'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'circles',
  title: 'Get-Together With Readers',
  components: { CircleList },
  data () {
    return {
      circles: [],
      circleCount: 0,
      currentC: 1,
      openDialog: false,
      areaKeyword: '',
      myLocal: this.$store.getters.currentUser.location || '',
      circleForm: {
        name: '',
        address: '',
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
          { max: 200, message: 'Max Length should be 200', trigger: 'blur' }
        ],
        time: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' },
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        note: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    hasMoreCircle () {
      return this.circles.length < this.circleCount
    }
  },
  methods: {
    loadCircles () {
      this.currentC = 1 // init page num for each search
      let params = {'area': this.areaKeyword}
      fetchCircles(params).then(resp => {
        let data = resp.data
        this.circles = data.circles
        this.circleCount = data.circlecount
      })
    },
    loadmoreCircle () {
      let params = {
        'page': this.currentC,
        'area': this.areaKeyword
      }
      fetchCircles(params).then(resp => {
        this.circles.push(...resp.data.circles)
        this.currentC += 1
      })
    },
    localCircle () {
      this.areaKeyword = this.myLocal
      this.loadCircles()
    },
    newCircle (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            name: form.name.trim(),
            address: form.address.trim(),
            time: form.time.trim(),
            note: form.note.trim()
          }
          postCircle(data).then(resp => {
            this.openDialog = false
            this.circles.unshift(resp.data)
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
    this.loadCircles()
  }
}
</script>

<style lang="stylus" scoped>
.circle
  padding 10px 260px 10px 0px
  position relative
  .circle-main
    margin-bottom 5px
  .circle-side
    position absolute
    top 10px
    right 0
    width 240px
</style>
