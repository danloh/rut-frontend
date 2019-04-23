<template>
  <div class="submit-page">
    <div class="title">
      <span>Submit A New Item </span>
      <small class="help-tips">book, course, documentary, etc.</small> 
    </div>
    <v-form ref="form" class="submit-form">
      <v-textarea
        v-model= "title"
        label= "Title"
        :counter = "256"
        :rules= "titleRule"
        :rows= "1"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model= "uiid"
        label= "UID: ISBN.."
      ></v-text-field>
      <v-text-field
        v-model= "authors"
        label= "Author or Instructor"
        :counter= "256"
        :rules= "titleRule"
      ></v-text-field>
      <v-textarea
        v-model="cover"
        label = "Cover Image Url"
        :counter = "256"
        :rules = "lenRule"
        :rows = "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label = "Resource URL"
        :counter = "256"
        :rules = "lenRule"
        :rows = "1"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model="edition"
        label="Edition"
        :counter = "256"
        :rules="lenRule"
      ></v-text-field>
      <v-text-field
        v-model= "pubDate"
        label= "Publish Date"
      ></v-text-field>
      <v-text-field
        v-model= "publisher"
        label= "Publisher"
        :counter = "256"
        :rules= "lenRule"
      ></v-text-field>
      <v-textarea
        v-model="detail"
        label="Detail"
        counter
        auto-grow
      ></v-textarea>
      <el-select v-model="category" size="mini" filterable allow-create placeholder="Select Category">
        <el-option v-for="c in cates" :key="c" :label="c" :value="c"></el-option>
      </el-select>
    </v-form>
    <el-button class="blockbtn" type="primary" @click="onSubmit">
      Submit New Item
    </el-button>
  </div>
</template>

<script>
import { newItem } from '../../api'
import { checkAuth } from '../../util/auth'
import { regUiid } from '../../util/constant'

export default {
  name: 'new-item',
  title: 'Submit New Item',
  components: { },
  data () {
    return {
      title: '',
      uiid: '',
      authors: '',
      pubDate: '',
      publisher: '',
      category: 'Book',
      cates: ['Book','Documentary','Movie','Course','Paper','WebPage'],
      url: '',
      cover: '',
      edition: '',
      detail: '',
      mustRule: [ v => !!v || 'required' ],
      lenRule: [ v => v.length <= 256 || 'Must be less than 256 characters' ]
    }
  },
  computed: {
    titleRule () { 
      return this.mustRule.concat(this.lenRule)
    }
  },
  methods: {
    onSubmit () {
      if (!this.$refs.form.validate() || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let _uiid = this.uiid.replace(regUiid, '')
      let data = {
        title: this.title.trim(),
        uiid: _uiid,
        authors: this.authors.trim(),
        pub_at: this.pubDate.trim(),
        publisher: this.publisher.trim(),
        category: this.category.trim(),
        url: this.url.trim(),
        cover: this.cover.trim(),
        edition: this.edition.trim(),
        detail: this.detail.trim()
      }
      newItem(data).then(resp => {
        let slug = resp.data.item.slug
        this.$router.push(`/item/${slug}`)
      })
    }
  }
}
</script>

<style scoped>
.submit-page {
  padding: 20px 180px 20px 120px;
  position: relative;
}
.title {
  padding-bottom: 10px;
}
.submit-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
</style>