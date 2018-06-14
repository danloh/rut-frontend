<template>
  <div class="init-avatar" :style="style">
    <span v-if="!this.src">{{ userInitial }}</span>
  </div>
</template>

<script>
// refer to vue-avatar
export default {
  name: 'avatar',
  props: {
    username: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    inline: {
      type: Boolean
    },
    size: {
      type: Number,
      default: 40
    },
    src: {
      type: String
    },
    rounded: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      backgroundColors: [
        '#F48FB1', '#FF4081', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#795548', '#9E9E9E',
        '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#B3E5FC', '#607D8B']
    }
  },
  computed: {
    background () {
      return this.randomBackgroundColor(this.username.length, this.backgroundColors)
    },
    fontColor () {
      return this.color
    },
    isImage () {
      return Boolean(this.src)
    },
    style () {
      const style = {
        width: `${this.size}px`,
        height: `${this.size}px`,
        borderRadius: this.rounded ? '50%' : 0
      }
      const imgBackgroundAndFontStyle = {
        background: `transparent url('${this.src}') no-repeat scroll 0% 0% / ${this.size}px ${this.size}px content-box border-box`,
        referrerPolicy: 'no-referrer'
      }
      const initialBackgroundAndFontStyle = {
        backgroundColor: this.background,
        font: Math.floor(this.size / 2.4) + 'px/100px Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        lineHeight: `${(this.size + Math.floor(this.size / 20))}px`,
        display: this.inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: this.fontColor
      }
      const backgroundAndFontStyle = (this.isImage)
        ? imgBackgroundAndFontStyle
        : initialBackgroundAndFontStyle
      Object.assign(style, backgroundAndFontStyle)
      return style
    },
    userInitial () {
      const initials = this.initial(this.username)
      return initials
    }
  },
  methods: {
    initial (username) {
      let parts = username.split(/[ _-]/)
      let initials = ''
      for (var i = 0; i < parts.length; i++) {
        initials += parts[i].charAt(0)
      }
      if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
        initials = initials.replace(/[a-z]+/g, '')
      }
      initials = initials.substr(0, 3).toUpperCase()
      return initials
    },
    randomBackgroundColor (seed, colors) {
      return colors[seed % (colors.length)]
    }
  }
}
</script>
