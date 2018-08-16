<template>
  <div class="app flex-row align-items-center" style="color:white;">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">401</h1>
            <h4 class="pt-3">Oops! You don't have permission. 对不起，您没有访问权限!</h4>
            <p class="text-muted">You are not permitted to view the content.</p>
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
    name: 'Page401',
    methods: {
      backToDashBoard() {
        this.$router.push({path: '/dashboard'})
      }
    }
  }
</script>
