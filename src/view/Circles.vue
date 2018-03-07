<template>
  <div class="circle">
    <div class="circle-main">
      <b style="font-size:1.2em">Circles</b>
      <br>
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
      <el-button type="text" @click="openDialog=true">...Launch Circle</el-button>
      <!-- dialog -->
      <el-dialog title="Launch Circle" :visible.sync="openDialog" width="40%">
      <el-form :model="circleForm" :rules="rules" ref="circleForm" size="mini">
          <el-form-item prop="name">
          <el-input v-model="circleForm.name" placeholder="Name"></el-input>
          </el-form-item>
          <el-form-item prop="address">
          <el-input v-model="circleForm.address" 
                      placeholder="Detail Address">
          </el-input>
          </el-form-item>
          <el-form-item prop="area">
          <el-input v-model="circleForm.area" 
                      placeholder="Area, like: BayArea SF">
          </el-input>
          </el-form-item>
          <el-form-item prop="time">
          <el-input v-model="circleForm.time" 
                      placeholder="Time, like: Every Sat. 2PM - 4PM">
          </el-input>
          </el-form-item>
          <el-form-item prop="note">
          <el-input type="textarea" v-model="circleForm.note" 
                      :autosize="{minRows:3}" 
                      placeholder="Can provide more info by linking to a detail page">
          </el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="openDialog=false">Cancel</el-button>
          <el-button type="success" 
                      @click="newCircle('circleForm', circleForm)">
                      Launch
          </el-button>
      </div>
      </el-dialog>
      <!-- dialog end -->
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
  title () {
    return 'Circles'
  },
  components: { CircleList },
  data () {
    return {
      circles: [],
      circleCount: 0,
      currentC: 1,
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
    hasMoreCircle () {
      return this.circles.length < this.circleCount
    }
  },
  methods: {
    loadCircles () {
      fetchCircles()
      .then(resp => {
        let data = resp.data
        this.circles = data.circles
        this.circleCount = data.circlecount
      })
    },
    loadmoreCircle () {
      let params = {'page': this.currentC}
      fetchCircles(params)
      .then(resp => {
        this.circles.push(...resp.data.circles)
        this.currentC += 1
      })
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
          postCircle(data).then(resp => {
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
    this.loadCircles()
  }
}
</script>

<style lang="stylus" scoped>
.circle
  padding 5px 280px 10px 0px
  position relative
  .circle-main
    padding auto
  .circle-side
    position absolute
    top 10px
    right 0
    width 240px
</style>
