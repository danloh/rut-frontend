<template>
  <div class="login-page">
    <h3 class="title">Please Log in</h3>
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
  padding: 10px 280px 10px 200px;
  position: relative;
}
.title {
  text-align: center;
  margin-bottom: 10px;
}
</style>