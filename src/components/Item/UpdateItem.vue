<template>
  <div class="update-page">
    <div class="title">
      <b>Updating Item: </b><small>{{ title }}</small> 
    </div>
    <v-form ref="form" class="update-form">
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
        label = "Cover Image URL"
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
      updateItem(data).then(resp => {
        let slug = resp.data.item.slug
        let updateTime = {'itemslug': slug, 'lastUpdate':0, 'ref':'lastUpdate'}
        this.$store.commit('RENEW_ITEM', updateTime)
        this.$router.push(`/item/${slug}`)
      })
    },
    loadItem () {
      let itemslug = this.$route.params.slug
      this.$store.dispatch('getItem', itemslug).then(resp => {
        this.itemid = resp.id
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
  padding: 20px 180px 20px 120px;
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
