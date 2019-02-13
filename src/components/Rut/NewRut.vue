<template>
  <div class="create-page">
    <div class="title">
      <span>Create: </span>
      <small style="color:green;font-size:0.8em;">collection of books, courses, etc.</small> 
    </div>
    <form class="create-form">
      <v-text-field
        v-model="title"
        label="Title"
        counter
        maxlength="120"
      ></v-text-field>
      <v-text-field
        v-model="url"
        label="URL"
        counter
        maxlength="120"
      ></v-text-field>
      <v-textarea
        v-model="content"
        label="Content"
        counter
        auto-grow
      ></v-textarea>
    </form>
    <v-btn @click="onCreate">Create</v-btn>
  </div>
</template>

<script>
import { newRut } from '../../api'
import { trimValid } from '../../util/filters'

export default {
  name: 'new-rut',
  title: 'Create New',
  components: { },
  data () {
    return {
      title: '',
      url: '',
      content: '',
      editable: 'Creator'
    }
  },
  methods: {
    onCreate () {
      let data = {
        title: this.title.trim(),
        content: this.content.trim(),
        url: this.url.trim(),
        user_id: '1fa',
        user_intro: 'hello'
      }
      newRut(data).then(resp => {
        let id = resp.data.rut.id
        this.$router.push(`/r/${id}`)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.create-page
  padding 10px 160px 10px 120px
  position relative
  .title
    padding-bottom 10px
    border-bottom  1px dotted
  .create-form
    padding 10px
</style>