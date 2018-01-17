<template>
  <div class="create-page">
    <h3 class="title">Create New Readup Tips</h3>
    <p v-if="demandid"> As Answer To The 
      <router-link :to="'/demand/' + demandid" target="_blank" rel="nofollow noopener noreferrer">
      {{ 'Request:  ' + demandBody || 'Request' }}
      </router-link>
    </p>
    <el-form class="create-form" :model="createForm" :rules="rules" ref="createForm" label-width="120px" size="mini">
      <el-form-item label="Title" prop="title">
        <el-input v-model="createForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Tags" prop="tag">
        <el-input v-model="createForm.tag" clearable placeholder="Comma can be as Separator"></el-input>
      </el-form-item>
      <el-form-item label="Preface" prop="intro">
        <el-input type="textarea" v-model="createForm.intro" :autosize="{minRows:5}"></el-input>
        <md-tool :pretext="createForm.intro" @insertmd="updateM"></md-tool>
      </el-form-item>
      <el-form-item label="Credential" prop="credential">
        <el-input v-model="createForm.credential" placeholder="Help readers understand your experience"></el-input>
      </el-form-item>
      <el-form-item label="Suitable for" prop="rating">
        <el-select v-model="createForm.rating">
          <el-option v-for="r in ratings" :key="r.value" :label="r.label" :value="r.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Who Can Edit?" prop="editable">
        <el-radio-group v-model="createForm.editable">
          <el-radio-button label="Creator"></el-radio-button>
          <!-- <el-radio-button label="Contributors"></el-radio-button> -->
          <el-radio-button label="Everyone"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onCreate('createForm', createForm)">Create New Then Add Items</el-button>
        <!-- <el-button @click="resetForm('createForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newRut, fetchOnlyDemand } from '@/api/api'
import { trimValid } from '@/util/filters'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'create',
  title: 'Create New',
  components: { MdTool },
  data () {
    return {
      createForm: {
        title: '',
        intro: '',
        tag: '',
        rating: 'All',
        credential: '',
        editable: 'Creator'
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Please Name it', trigger: 'blur' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        intro: [
          { required: true, validator: trimValid, message: 'Need an introduction', trigger: 'blur' }
        ],
        tag: [
          { required: true, validator: trimValid, message: 'Please set some tags', trigger: 'blur' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        credential: [
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ]
      },
      ratings: [
        {value: 'All', label: 'All'}, {value: 'Secondary', label: 'Secondary'},
        {value: 'College', label: 'College'}, {value: 'Elementary', label: 'Elementary'},
        {value: 'Preschool', label: 'Preschool'}, {value: 'Professional', label: 'Professional'}
      ],
      demandid: this.$route.params.id || '',
      demandBody: ''
    }
  },
  methods: {
    onCreate (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            title: form.title.trim(),
            intro: form.intro.trim(),
            tag: form.tag.trim(),
            rating: form.rating,
            credential: form.credential.trim(),
            editable: 'Creator' // form.editable
          }
          let demandid = this.$route.params.id || ''
          return newRut(data, demandid)
          .then((resp) => {
            let id = resp.data.id
            this.$router.push(`/readuplist/${id}`)
            this.$message({
              showClose: true,
              message: 'New List Created, Now Add item to it'
            })
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    updateM (data) {
      this.createForm.intro += data
    },
    loadDemand () {
      let demandid = this.$route.params.id
      if (!demandid) {
        return
      } else {
        let demandG = this.$store.getters.demandDetail
        if (demandG && demandG.id === Number(demandid)) {
          this.demandBody = demandG.body.slice(0, 142)
        } else {
          fetchOnlyDemand(demandid).then(resp => {
            this.demandBody = resp.data.body.slice(0, 142)
          })
        }
      }
    }
  },
  created () {
    this.loadDemand()
  }
}
</script>

<style lang="stylus" scoped>
.create-page
  padding 10px 120px 10px 80px
  position relative
  .create-form
    padding 20px
    border 1px dotted #689f38
  .title
    text-align center
    margin-bottom 20px
</style>