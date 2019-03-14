<template>
  <div class="update-page">
    <div class="title">
      <span>Update An Item </span>
      <small style="color:green;font-size:0.8em;">books, courses, etc.</small> 
    </div>
    <v-form ref="form" class="update-form">
      <v-textarea
        v-model= "title"
        label= "Title"
        :counter = "120"
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
        :counter= "120"
        :rules= "titleRule"
      ></v-text-field>
      <v-textarea
        v-model="cover"
        label = "Cover Image URL"
        :counter = "120"
        :rules = "lenRule"
        :rows = "1"
        auto-grow
      ></v-textarea>
      <v-textarea
        v-model="url"
        label = "Resource URL"
        :counter = "120"
        :rules = "lenRule"
        :rows = "1"
        auto-grow
      ></v-textarea>
      <v-text-field
        v-model="edition"
        label="Edition"
        :counter = "120"
        :rules="lenRule"
      ></v-text-field>
      <v-text-field
        v-model= "pubDate"
        label= "Publish Date"
      ></v-text-field>
      <v-text-field
        v-model= "publisher"
        label= "Publisher"
        :counter = "120"
        :rules= "lenRule"
      ></v-text-field>
      <v-text-field
        v-model="category"
        label="Category"
      ></v-text-field>
      <v-textarea
        v-model="detail"
        label="Detail"
        counter
        auto-grow
      ></v-textarea>
    </v-form>
    <el-button class="blockbtn" type="primary" size="small"
               @click="onUpdate">Done and Update
    </el-button>
  </div>
</template>

<script>
import { updateItem } from '../../api'
import { checkAuth } from '../../util/auth'
import { regUiid } from '../../util/constant'

export default {
  name: 'update-item',
  title: 'Update An Item',
  components: { },
  data () {
    return {
      itemid: '',
      title: '',
      uiid: '',
      authors: '',
      pubDate: '',
      publisher: '',
      category: 'Book',
      url: '',
      cover: '',
      edition: '',
      detail: '',
      mustRule: [ v => !!v || 'required' ],
      lenRule: [ v => v.length <= 120 || 'Must be less than 120 characters' ]
    }
  },
  computed: {
    titleRule () { 
      return this.mustRule.concat(this.lenRule)
    }
  },
  methods: {
    onUpdate () {
      if (!this.$refs.form.validate() || !checkAuth()) {
        this.$message("Invalid Input or Need to Log in")
        return
      }
      let _uiid = this.uiid.replace(regUiid, '')
      let data = {
        id: this.itemid.trim(),
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
      updateItem(this.itemid, data).then(resp => {
        let id = resp.data.item.id
        let updateTime = {'itemid':id, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_ITEMS', updateTime)
        this.$router.push(`/item/${id}`)
      })
    },
    loadItem () {
      let itemid = this.itemid = this.$route.params.id
      this.$store.dispatch('getItem', itemid).then(resp => {
        this.title = resp.title
        this.uiid = resp.uiid
        this.authors = resp.authors
        this.pubDate = resp.pub_at
        this.publisher = resp.publisher
        this.category = resp.category
        this.url = resp.url
        this.cover = resp.cover
        this.edition = resp.edition
        this.detail = resp.detail
      })
    }
  },
  created () {
    this.loadItem()
  }
}
</script>

<style scoped>
.update-page {
  padding: 20px 120px 20px 120px;
  position: relative;
}
.title {
  padding-bottom: 10px;
}
.update-form {
  padding: 20px;
  border: 1px dotted #689f38;
}
</style>
