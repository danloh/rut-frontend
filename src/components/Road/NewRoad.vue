<template>
  <div class="road-page">
    <h3 class="title">New Road Map</h3>
    <el-form class="road-form" 
             :model="roadForm" 
             :rules="rules" 
             ref="roadForm" 
             label-width="110px" 
             size="mini">
      <el-form-item label="Title" prop="title">
        <el-input type="textarea" v-model="roadForm.title" autosize></el-input>
      </el-form-item>
      <el-form-item label="Introduction" prop="intro">
        <el-input type="textarea" v-model="roadForm.intro" 
                  :autosize="{minRows:5}">
        </el-input>
        <md-tool :pretext="roadForm.intro" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item label="Set Deadline" prop="deadline">
        <el-date-picker
          v-model="roadForm.deadline"
          type="date"
          size="mini"
          placeholder="Pick a day"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" 
                   @click="onCreate('roadForm', roadForm)">
                   New RoadMap, Add Item Later
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newRoad } from '@/api/api'
import { trimValid } from '@/util/filters'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'new-road',
  title: 'New Road',
  components: { MdTool },
  data () {
    return {
      roadForm: {
        title: '',
        intro: '',
        deadline: null
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Please Name it', trigger: 'blur' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        intro: [
          { required: true, validator: trimValid, message: 'Need an introduction', trigger: 'blur' }
        ],
        deadline: [
          { required: true, message: 'Required', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onCreate (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            title: form.title.trim(),
            intro: form.intro.trim(),
            deadline: form.deadline
          }
          newRoad(data).then(resp => {
            let id = resp.data.id
            this.$router.push(`/roadmap/${id}`)
          })
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    updateM (data) {
      this.roadForm.intro += data
    }
  }
}
</script>

<style lang="stylus" scoped>
.road-page
  padding 10px 200px 10px 80px
  position relative
  .road-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>