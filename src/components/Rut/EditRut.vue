<template>
  <div class="edit-page">
    <div class="title"> <b>Edit List:&nbsp;&nbsp;</b>
      {{ rutTitle }}&nbsp;&nbsp;<el-button type="text" @click="cancelnReturn">...Cancel Edit and Back</el-button>
    </div>
    <el-form class="edit-form" :model="editForm" :rules="rules" ref="editForm" label-width="120px" size="mini">
      <el-form-item label="Title" prop="title">
        <el-input v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item label="Preface" prop="intro">
        <el-input type="textarea" v-model="editForm.intro" :autosize="{minRows:6}"></el-input>
      </el-form-item>
      <el-form-item label="Credential" prop="credential">
        <el-input v-model="editForm.credential"></el-input>
      </el-form-item>
      <el-form-item label="Epilog" prop="epilog">
        <el-input type="textarea" v-model="editForm.epilog" :autosize="{minRows:6}"></el-input>
      </el-form-item>
      <el-form-item label="Who Can Edit?" prop="editable">
        <el-radio-group v-model="editForm.editable">
          <el-radio-button label="Creator"></el-radio-button>
          <!-- <el-radio-button label="Contributors"></el-radio-button> -->
          <el-radio-button label="Everyone"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Rating" prop="rating">
        <el-select v-model="editForm.rating">
          <el-option v-for="r in ratings" :key="r.value" :label="r.label" :value="r.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onEdit('editForm', editForm)">Done and Submit</el-button>
        <!-- <el-button @click="resetForm('editForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editRut, lockRut, unlockRut } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'edit-rut',
  title: 'Edit Readup Tips',
  data () {
    return {
      editForm: {
        title: '',
        intro: '',
        rating: '',
        credential: '',
        epilog: '',
        editable: ''
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Please give a title', trigger: 'blur' },
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        intro: [
          { required: true, validator: trimValid, message: 'Need an introduction', trigger: 'blur' }
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
      rutId: null,
      rutTitle: null
    }
  },
  methods: {
    onEdit (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            title: form.title.trim(),
            intro: form.intro.trim(),
            rating: form.rating,
            editable: form.editable,
            credential: form.credential.trim(),
            epilog: form.epilog.trim()
          }
          editRut(this.rutId, data)
          .then(() => {
            let id = this.rutId
            unlockRut(id)
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    cancelnReturn () {
      let id = this.rutId
      unlockRut(id)
      this.$router.push(`/readuplist/${id}`)
    },
    loadRutData () {
      let rut = this.$store.getters.rutDetail
      if (rut.id === Number(this.$route.params.id)) {
        this.editForm.title = rut.title
        this.editForm.intro = rut.intro
        this.editForm.rating = rut.rating
        this.editForm.editable = rut.editable
        this.editForm.credential = rut.credential
        this.editForm.epilog = rut.epilog
        this.rutId = rut.id
        this.rutTitle = rut.title
        lockRut(rut.id)
      }
    }
  },
  created () {
    this.loadRutData()
  }
}
</script>

<style lang="stylus" scoped>
.edit-page
  padding 10px 120px 10px 80px
  position relative
  .edit-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 20px
</style>