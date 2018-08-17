<template>
  <div v-if="isInvalid" class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">404</h1>
            <h4 class="pt-3">Oops! You're lost. 对不起，您所访问的页面不存在！</h4>
            <p class="text-muted">The page you are looking for was not found.</p>
          </div>
          <b-input-group>
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-arrow-left"></i>
              </span>
            </div>
            <div class="input-group-append">
              <b-button variant="info" @click="backToDashBoard">返回主页</b-button>
            </div>
          </b-input-group>
        </b-col>
      </b-row>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>

  export default {
    name: 'app',
    computed: {
      isInvalid() {
        return (!this.$route.matched || this.$route.matched.length === 0)
      }
    },
    methods: {
      backToDashBoard() {
        this.$router.push({path: '/dashboard'})
      }
    }
  }
</script>

<style>
  /* Import Font Awesome Icons Set */
  $
  fa-font-path:

  '~font-awesome/fonts/'
  ;
  @import '~font-awesome/css/font-awesome.min.css';
  /* Import Simple Line Icons Set */
  $
  simple-line-font-path:

  '~simple-line-icons/fonts/'
  ;
  @import '~simple-line-icons/css/simple-line-icons.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
</style>
<style lang="scss">
  // Import Main styles for this application
  @import './scss/style';
</style>
