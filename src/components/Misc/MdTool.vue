<template>
  <div class="md-editor">
    <div class="md-tools">
      <a href="" title="Bold" @click.stop.prevent="insertContent('bold')">
        <b>B </b>
      </a>
      <a href="" title="image" @click.stop.prevent="insertContent('image')">
        <i class="el-icon-picture"></i>
      </a>
      <a href="" title="link" @click.stop.prevent="insertContent('link')">
        <i class="el-icon-plus"></i>
      </a>
      <a href="" title="code" @click.stop.prevent="insertContent('code')">
        <i class="el-icon-tickets"></i>
      </a>
      <a href="" title="preview" @click.stop.prevent="togglePreviewMode">
        <i class="el-icon-view"></i>
      </a>
    </div>
    <div v-show="previewMode" v-html="previewContent"></div>
  </div>
</template>

<script>
  import marked from '@/util/marked'
  export default {
    name: 'md-tool',
    data () {
      return {
        previewContent: '',
        previewMode: false
      }
    },
    props: {
      pretext: {
        type: String,
        default: ' '
      }
    },
    methods: {
      insertContent (type) {
        const contents = {
          bold: '** **',
          image: '![](https://)',
          link: '[](https://)',
          code: '\n```python\n \n```'
        }
        this.$emit('insertmd', contents[type])
      },
      togglePreviewMode () {
        this.previewContent = marked(this.pretext)
        this.previewMode = !this.previewMode
      }
    }
  }
</script>
