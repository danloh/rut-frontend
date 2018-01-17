<template>
  <div class="add-page">
    <div class="title"> 
      <b>Add Item To List:&nbsp;&nbsp;</b>{{ rutTitle }}&nbsp;&nbsp;<el-button type="text" @click="cancelnReturn">...Cancel and Back</el-button>
      <p style="color:green;font-size:0.8em">An Item can be anything: Book, Course, Documentary, Paper, Atlas, Place to visit, Exppriment to perform, etc.</p>
    </div>
    <spinner :show="loading"></spinner>
    <el-button size="small" type="primary">
      {{ show ? 'Add Item Info Manually' : 'Fetch Item Info via Spider' }}
    </el-button>
    <el-button size="mini" type="text" @click="show = !show">
      or {{ show ? 'Fetch Item Info via Spider' : 'Add Item Info Manually' }}
    </el-button>
    <!-- check via url spider or UID -->
    <el-form class="add-form" :model="checkForm" ref="checkForm" size="mini" v-show="!show">
      <el-form-item label="Amazon URL or ISBN-13" prop="url">
        <el-input type="textarea" v-model="checkForm.url" autosize></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onCheck('checkForm', checkForm)">Fetch Via Spider</el-button>
      </el-form-item>
    </el-form>
    <!-- add mannually -->
    <el-form class="add-form" :model="addForm" :rules="addRules" ref="addForm" label-width="120px" size="mini" v-show="show">
      <el-form-item label="Type" prop="cate">
        <el-radio-group v-model="addForm.cate">
          <el-radio-button label="Book"></el-radio-button>
          <el-radio-button label="Video"></el-radio-button>
          <el-radio-button label="Course"></el-radio-button>
          <el-radio-button label="Online"></el-radio-button>
          <el-radio-button label="Paper"></el-radio-button>
          <el-radio-button label="Atlas"></el-radio-button>
          <el-radio-button label="Album"></el-radio-button>
          <el-radio-button label="Place"></el-radio-button>
          <el-radio-button label="Other"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input v-model="addForm.title"></el-input>
      </el-form-item>
      <el-form-item label="UID*" prop="uid">
        <el-input v-model="addForm.uid" placeholder="Either of UID and URL is requied"></el-input>
      </el-form-item>
      <el-form-item label="Resource URL*" prop="resUrl">
        <el-input v-model="addForm.resUrl" placeholder="Either of UID and URL is requied"></el-input>
      </el-form-item>
      <el-form-item label="Byline" prop="byline">
        <el-input v-model="addForm.byline"></el-input>
      </el-form-item>
      <el-form-item label="Cover" prop="cover">
        <el-input v-model="addForm.cover"></el-input>
      </el-form-item>
      <el-form-item label="Tips" prop="tips">
        <el-input type="textarea" v-model="addForm.tips" :autosize="{minRows:6}"></el-input>
        <md-tool :pretext="addForm.tips" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item label="in Tips" prop="spoiler">
        <el-radio-group v-model="addForm.spoiler">
          <el-radio-button label="No Spoiler"></el-radio-button>
          <el-radio-button label="Spoiler Ahead"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onAdd('addForm', addForm)">Done and Add</el-button>
        <!-- <el-button @click="resetForm('addForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { checkItem, addItem, lockRut, unlockRut } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'
import Spinner from '@/components/Misc/Spinner.vue'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'add-rut',
  title: 'Add Item to Readup Tips',
  components: { Spinner, MdTool },
  data () {
    return {
      checkForm: {
        url: ''  // actually  url or uid
      },
      addForm: {
        cate: 'Book',
        title: '',
        uid: '',
        resUrl: '',
        byline: '',
        cover: '',
        tips: '',
        spoiler: 'No Spoiler'
      },
      addRules: {
        title: [
          { required: true, validator: trimValid, message: 'Please give a title', trigger: 'blur' },
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        tips: [
          { required: true, validator: trimValid, message: 'Required', trigger: 'blur' }
        ],
        resUrl: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        byline: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        cover: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ]
      },
      show: false,
      loading: false,
      rutId: null,
      rutTitle: null
    }
  },
  methods: {
    // via Spider
    onCheck (formName, form) {
      this.loading = true
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          if (!form.url.trim()) {
            this.loading = false
            this.$message('Please Input')
            return false
          }
          let data = {
            url: form.url.trim() // url or uid
          }
          checkItem(this.rutId, data)
          .then(resp => {
            let id = this.rutId
            unlockRut(id)
            if (resp.data === 'Back') {
              this.$message({
                showClose: true,
                message: 'Failed, Please change the URL or UID and Try again'
              })
            }
            this.loading = false
            this.$router.push(`/readuplist/${id}`)
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
    // manually add
    onAdd (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let uid = form.uid.trim()
          let resUrl = form.resUrl.trim()
          if (!uid && !resUrl) {
            this.$message({
              showClose: true,
              message: 'Either of UID and Resource URL is requied'
            })
            return false
          } else {
            let data = {
              title: form.title.trim(),
              uid: uid,
              resUrl: resUrl,
              byline: form.byline.trim(),
              cover: form.cover.trim(),
              tips: form.tips.trim(),
              spoiler: form.spoiler
            }
            addItem(this.rutId, data)
            .then(() => {
              let id = this.rutId
              unlockRut(id)
              this.$router.push(`/readuplist/${id}`)
            })
          }
        } else {
          this.$message({
            showClose: true,
            message: 'error!! Please Check'
          })
          return false
        }
      })
    },
    cancelnReturn () {
      let id = this.rutId
      unlockRut(id)
      this.$router.push(`/readuplist/${id}`)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    loadRutData () {
      let rut = this.$store.getters.rutDetail
      if (rut.id === Number(this.$route.params.id)) {
        this.rutId = rut.id
        this.rutTitle = rut.title
        lockRut(rut.id)
      }
    },
    updateM (data) {
      this.addForm.tips += data
    }
  },
  created () {
    this.loadRutData()
  }
}
</script>

<style lang="stylus" scoped>
.add-page
  padding 10px 120px 10px 80px
  position relative
  .add-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 20px
</style>