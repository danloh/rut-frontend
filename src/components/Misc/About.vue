<template>
  <div class="about-page">
    <div class="intro">
      <h2>About Readup.Tips</h2>
      <p>A Service for Sharing Read List or Learning Roadmaps, to share and grow the knowledge 
      about how to grow knowledge, on the assumption: 
      the best way to grow one's knowledge is reading.<br>
      We are eager for good books who are eager to find good us too.
      Let the books and the readers find each other with the help from who have read them.</p>
    </div>
    <div class="terms">
      <h2>Terms of Service</h2>
      <p>Thank you for using Readup.Tips('the Service').
        <br> 
        Your access to and use of the Service is conditioned on your acceptance 
        of and compliance with the Terms of service. 
        The terms of service may change over time. </p>
        <ul>We won't collect or store any private information. The email you provided 
        will be used for account confirmation or password ressetting only,
        We will never send you any spams.</ul>
        <ul>We don't use cookies to collect data. However, 
        some services may not function properly if you disable cookies.
        You can set web browsers to accept cookies automatically 
        or enable cookies on demand. </ul>
        <ul>You own and are responsible for your contents and 
        grant us a license to use your contents.</ul>
        <ul>If you believe that your content has been used in a way that 
        constitutes copyright infringement, Please contact us to claim.</ul>
      <p>We will keep our best effort to make sure the service is reliable. But it may break sometimes.</p>
    </div>
    <div class="contact">
      <h2>Contact</h2>
      <p>If any questions or suggestion, can always send an email at
      <a href="mailto:readup.tips@gmail.com?subject=Feedback...">here</a>,
      Any feedback is appreciated.</p>
    </div>
    <div class="about-side">
      <a href="/register">Sign up now</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about-page',
  title: 'About'
}
</script>

<style lang="stylus" scoped>
.about-page
  padding 10px 240px 10px 0px
  margin-top 10px
  .about-side
    position absolute
    top 10px
    right 120px
</style>
