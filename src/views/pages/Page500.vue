<template>
  <div class="app flex-row align-items-center" style="color:white;">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">500</h1>
            <h4 class="pt-3">Houston, we have a problem! 对不起，页面加载出现问题！当前页面内容暂时无法访问！</h4>
            <p class="text-muted">The page you are looking for is temporarily unavailable.</p>
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
</template>

<script>
  export default {
    name: 'Page500',
    methods: {
      backToDashBoard() {
        this.$router.push({path: '/dashboard'})
      }
    }
  }
</script>
