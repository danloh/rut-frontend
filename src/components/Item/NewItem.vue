<template>
  <div class="new-page">
    <div class="title"> <b>Submit New Item</b>&nbsp;</div>
    <p style="color:green;font-size:16px;text-align:center">
      An Item can be Anything: Book, Course, Documentary, Paper, Podcast, Atlas, Place, etc.
    </p>
    <spinner :show="loading"></spinner>
    <el-button size="small" type="primary">
      {{ show ? 'Add Item Information Manually' : 'Fetch Item Information via Spider' }}
    </el-button>
    <el-button size="mini" type="text" @click="show = !show">
      or {{ show ? 'Fetch Item Information via Spider' : 'Add Item Information Manually' }}
    </el-button>
    <!-- check via url spider or UID -->
    <el-form class="check-form" size="mini" 
             :model="checkForm" ref="checkForm" 
             v-show="!show">
      <el-form-item label="Input URL : e.g. Amazon Book Url or Coursera Link" prop="url">
        <el-input type="textarea" v-model="checkForm.url" autosize></el-input>
      </el-form-item>
      <el-form-item label="Flag as" prop="flag">
        <el-radio-group v-model="checkForm.flag">
          <el-radio-button label="Have Done"></el-radio-button>
          <el-radio-button label="Schedule"></el-radio-button>
          <el-radio-button label="Working On"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" class="blockbtn"
                   @click="onCheck('checkForm', checkForm)"
                   :disabled="!checkForm.url">
                   Fetch Information Via Spider
        </el-button>
      </el-form-item>
    </el-form>
    <!-- add mannually -->
    <el-form class="new-form" 
             :model="itemForm" 
             :rules="rules" 
             ref="itemForm" 
             label-width="130px" size="mini" 
             v-show="show">
      <el-form-item label="Type" prop="cate">
        <el-radio-group v-model="itemForm.cate">
          <el-radio-button label="Book"></el-radio-button>
          <el-radio-button label="Course"></el-radio-button>
          <el-radio-button label="Video"></el-radio-button>
          <el-radio-button label="Online"></el-radio-button>
          <el-radio-button label="Paper"></el-radio-button>
          <el-radio-button label="Atlas"></el-radio-button>
          <el-radio-button label="Album"></el-radio-button>
          <el-radio-button label="Podcast"></el-radio-button>
          <el-radio-button label="Other"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Title" prop="title">
        <el-input type="textarea" autosize v-model="itemForm.title"></el-input>
      </el-form-item>
      <el-form-item label="UID*" prop="uid">
        <el-input v-model="itemForm.uid" 
                  placeholder="either UID. e.g. ISBN, etc. ">
        </el-input>
      </el-form-item>
      <el-form-item label="Resource URL*" prop="resurl">
        <el-input type="textarea" autosize 
                  v-model="itemForm.resUrl" 
                  placeholder="or URL. e.g. a online course link, etc. ">
        </el-input>
      </el-form-item>
      <el-form-item label="Byline" prop="byline">
        <el-input v-model="itemForm.byline" 
                  placeholder="Auther or Instructor, etc.">
        </el-input>
      </el-form-item>
      <el-form-item label="Cover / Logo" prop="cover">
        <el-input type="textarea" autosize 
                  v-model="itemForm.cover" 
                  placeholder="Image URL">
        </el-input>
      </el-form-item>
      <el-form-item label="Language" prop="language">
        <el-input v-model="itemForm.language"></el-input>
      </el-form-item>
      <el-form-item label="Publisher" prop="publisher">
        <el-input v-model="itemForm.publisher"></el-input>
      </el-form-item>
      <el-form-item label="Publish Date" prop="publishDate">
        <el-input v-model="itemForm.publishDate" 
                  placeholder="Book Publish date or Start date of a Course">
        </el-input>
      </el-form-item>
      <el-form-item label="Page / Duration" prop="page">
        <el-input v-model="itemForm.page" 
                  placeholder="Pages of Book or Duration of video / course">
        </el-input>
      </el-form-item>
      <el-form-item label="Level" prop="level">
        <el-input v-model="itemForm.level"></el-input>
      </el-form-item>
      <el-form-item label="Binding / Format" prop="binding">
        <el-input v-model="itemForm.binding"></el-input>
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input v-model="itemForm.price"></el-input>
      </el-form-item>
      <el-form-item label="More Details" prop="details">
        <el-input type="textarea" :autosize="{minRows:3}" 
                  v-model="itemForm.details">
        </el-input>
        <md-tool :pretext="itemForm.details" @insertmd="updateN"></md-tool>
      </el-form-item>
      <el-form-item label="Flag as" prop="flag">
        <el-radio-group v-model="itemForm.flag">
          <el-radio-button label="Have Done"></el-radio-button>
          <el-radio-button label="Schedule"></el-radio-button>
          <el-radio-button label="Working On"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="mini" class="blockbtn"
                   @click="onNewItem('itemForm', itemForm)">
                   Done and Submit
        </el-button>
      </el-form-item>
    </el-form>
    <div class="submits">
      <el-button size="mini" @click="getSubmits">
        Items Submitted By Me
      </el-button>
      <p v-for="(item, index) in submits" :key="index" style="font-size:14px">
        {{item.cate}} <a :href="'/item/' + item.id" target="_blank">{{item.title}}</a>
      </p>
    </div>
  </div>
</template>

<script>
import { newItem, fetchSubmits } from '@/api/api'
import { checkAuth } from '@/util/auth'
import { trimValid } from '@/util/filters'
import Spinner from '@/components/Misc/Spinner.vue'
import MdTool from '@/components/Misc/MdTool.vue'

export default {
  name: 'new-item',
  title: 'Sumbit New Item',
  components: { Spinner, MdTool },
  data () {
    return {
      checkForm: {
        url: '',
        flag: ''
      },
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
        details: '',
        flag: ''
      },
      rules: {
        title: [
          { required: true, validator: trimValid, message: 'Please give a title', trigger: 'blur' },
          { max: 500, message: 'Max Length should be 500', trigger: 'blur' }
        ],
        uid: [
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
      show: false,
      loading: false,
      submits: []
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
            this.$message('Please Input Url')
            return false
          }
          let data = {
            resUrl: form.url.trim(),
            flag: form.flag.trim(),
            how: 'spider'
          }
          newItem(data).then(resp => {
            this.loading = false
            let id = resp.data
            let nexturl = id ? `/item/${id}` : '/'
            this.$router.push(nexturl)
          })
        }
      })
    },
    // manually
    onNewItem (formName, form) {
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
              cate: form.cate,
              title: form.title.trim(),
              uid: uid,
              resUrl: resUrl,
              byline: form.byline.trim(),
              cover: form.cover.trim(),
              Language: form.language.trim(),
              Publisher: form.publisher.trim(),
              PublishDate: form.publishDate.trim(),
              Level: form.level.trim(),
              binding: form.binding.trim(),
              page: form.page.trim(),
              price: form.price.trim(),
              details: form.details.trim(),
              flag: form.flag.trim()
            }
            newItem(data).then(resp => {
              let id = resp.data
              this.$router.push(`/item/${id}`)
            })
          }
        }
      })
    },
    checkAuthed () {
      if (!checkAuth()) {
        this.$message({
          showClose: true,
          message: 'Should Log in to Continue'
        })
        this.$router.push({
          path: '/login',
          query: {redirect: this.$route.fullPath}
        })
      }
    },
    updateN (data) {
      this.itemForm.details += data
    },
    getSubmits () {
      fetchSubmits().then(resp => {
        this.submits = resp.data
      })
    }
  },
  created () {
    this.checkAuthed()
  }
}
</script>

<style lang="stylus" scoped>
.new-page
  padding 10px 100px 10px 80px
  position relative
  .new-form, .check-form
    padding 20px
    border 1px dotted #689f38
  .title
    margin-bottom 10px
    text-align center
</style>