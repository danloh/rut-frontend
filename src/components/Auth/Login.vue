<template>
  <div class="login-page">
    <login-form></login-form>
  </div>
</template>

<script>
import LoginForm from './LoginForm.vue'

export default {
  name: 'login',
  title: 'Log in',
  components: { LoginForm }
}
</script>

<style scoped>
.login-page {
  padding: 10px 250px 10px 250px;
  position: relative;
}
</style>