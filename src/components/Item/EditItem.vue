<template>
  <div class="edit-page">
    <div class="title"> <b>Edit Item:</b>&nbsp;
      {{ itemTitle }}<el-button type="text" @click="cancelnBack"> ...Cancel Edit</el-button>
    </div>
    <el-form class="edit-form" :model="itemForm" :rules="rules" ref="itemForm" label-width="120px" size="mini">
      <el-form-item label="Type" prop="cate">
        <el-radio-group v-model="itemForm.cate">
          <el-radio-button label="Book"></el-radio-button>
          <el-radio-button label="Video"></el-radio-button>
          <el-radio-button label="Online"></el-radio-button>
          <el-radio-button label="Album"></el-radio-button>
          <el-radio-button label="Other"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input v-model="itemForm.title"></el-input>
      </el-form-item>
      <el-form-item label="UID" prop="uid">
        <el-input v-model="itemForm.uid"></el-input>
      </el-form-item>
      <el-form-item label="Resource URL" prop="resurl">
        <el-input v-model="itemForm.resUrl"></el-input>
      </el-form-item>
      <el-form-item label="Byline" prop="byline">
        <el-input v-model="itemForm.byline"></el-input>
      </el-form-item>
      <el-form-item label="Cover" prop="cover">
        <el-input v-model="itemForm.cover"></el-input>
      </el-form-item>
      <el-form-item label="Language" prop="language">
        <el-input v-model="itemForm.language"></el-input>
      </el-form-item>
      <el-form-item label="Publisher" prop="publisher">
        <el-input v-model="itemForm.publisher"></el-input>
      </el-form-item>
      <el-form-item label="Publish Date" prop="publishDate">
        <el-input v-model="itemForm.publishDate"></el-input>
      </el-form-item>
      <el-form-item label="Page" prop="page">
        <el-input v-model="itemForm.page"></el-input>
      </el-form-item>
      <el-form-item label="Level" prop="level">
        <el-input v-model="itemForm.level"></el-input>
      </el-form-item>
      <el-form-item label="Binding" prop="binding">
        <el-input v-model="itemForm.binding"></el-input>
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input v-model="itemForm.price"></el-input>
      </el-form-item>
      <el-form-item label="More Details" prop="details">
        <el-input type="textarea" v-model="itemForm.details" :autosize="{minRows:3}"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" size="medium" @click="onEditItem('itemForm', itemForm)">Done and Add</el-button>
        <!-- <el-button @click="resetForm('itemForm')">Reset</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editItem, unlockItem } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'

export default {
  name: 'edit-item',
  title: 'Edit Item',
  data () {
    return {
      itemForm: {
        cate: 'Book',
        title: '',
        uid: '',
        resUrl: '',
        byline: '',
        cover: '',
        language: '',
        publisher: '',
        publishDate: '',
        level: '',
        binding: '',
        page: '',
        price: '',
        details: ''
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Please give a title', trigger: 'blur' },
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        uid: [
          { required: true, validator: trimValid, message: 'Need an uid', trigger: 'blur' },
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ],
        resUrl: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        byline: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        cover: [
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        language: [
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ],
        publishDate: [
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ],
        publisher: [
          { max: 255, message: 'Max Length should be 255', trigger: 'blur' }
        ],
        page: [
          { max: 64, message: 'Max Length should be 64', trigger: 'blur' }
        ],
        level: [
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ],
        binding: [
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ],
        price: [
          { max: 128, message: 'Max Length should be 128', trigger: 'blur' }
        ]
      },
      itemId: null,
      itemTitle: null
    }
  },
  methods: {
    onEditItem (formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid && checkAuth()) {
          let data = {
            cate: form.cate,
            title: form.title.trim(),
            uid: form.uid.trim(),
            resUrl: form.resUrl.trim(),
            byline: form.byline.trim(),
            cover: form.cover.trim(),
            language: form.language.trim(),
            publisher: form.publisher.trim(),
            publishDate: form.publishDate.trim(),
            level: form.level.trim(),
            binding: form.binding.trim(),
            page: form.page.trim(),
            price: form.price.trim(),
            details: form.details.trim()
          }
          editItem(this.itemId, data)
          .then((resp) => {
            let id = this.itemId
            unlockItem(id)
            this.$router.push(`/item/${id}`)
            this.$message({
              showClose: true,
              message: resp.data,
              type: 'success'
            })
          })
        } else if (!checkAuth()) {
          this.$message({
            showClose: true,
            message: 'Should Log in to Continue'
          })
          this.$router.push({
            path: '/login',
            query: {redirect: this.$route.fullPath}
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
    cancelnBack () {
      let id = this.itemId
      unlockItem(id)
      this.$router.push(`/item/${id}`)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    setFormData (item) {
      this.itemForm.cate = item.cate
      this.itemForm.title = item.title
      this.itemForm.uid = item.uid
      this.itemForm.resUrl = item.resurl
      this.itemForm.byline = item.byline
      this.itemForm.cover = item.cover
      this.itemForm.language = item.language
      this.itemForm.publisher = item.publisher
      this.itemForm.publishDate = item.pubdate
      this.itemForm.level = item.level
      this.itemForm.binding = item.binding
      this.itemForm.price = item.price
      this.itemForm.page = item.page
      this.itemForm.details = item.details
      this.itemId = item.id
      this.itemTitle = item.title
    },
    loadItemData () {
      let itemG = this.$store.getters.currentItem
      let itemid = this.$route.params.id
      if (itemG && itemG.id === Number(itemid)) {
        let item = itemG
        this.setFormData(item)
      } else {
        unlockItem(itemid)
        this.$router.push(`/item/${itemid}`)
      }
    }
  },
  created () {
    this.loadItemData()
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