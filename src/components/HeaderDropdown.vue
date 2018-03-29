<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <img :src="profilePath" class="img-avatar">
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>账户 Account</strong></b-dropdown-header>
        <b-dropdown-item><i class="fa fa-bell-o"></i> 更新<b-badge variant="info">{{itemsCount}}</b-badge></b-dropdown-item>
        <b-dropdown-item><i class="fa fa-user"></i> 个人资料</b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item><i class="fa fa-shield"></i> 账户上锁</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> 登出</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
  import axios from 'axios'
  import decode from 'jwt-decode'
  import auth0 from 'auth0-js'

  export default {
    name: 'header-dropdown',
    data: () => {
      return {
        user: {
        userId: '',
        createTime: '',
        updateTime: '',
        status: '',
        userInfo: '',
        roleId: '',
        type: '',
        info: '',
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        weChat: '',
        qq: '',
        tel: '',
        birthday: '',
        gender: '',
        comment: '',
        profile: '',
        address: ''
      },
        itemsCount: 42,
        profilePath: ''
      }
    },
    mounted: function () {
      const decoded_token = decode(window.localStorage.getItem('access_token'))
      axios.get('/user/' + decoded_token.sub).then((response) => {
        this.user = response.data.data
        if (isNotEmpty(this.user.profile)) {
          this.user.profile = JSON.parse(this.user.profile)
          this.profilePath = basePath + '/pioneer' + this.user.profile.path
        }
      })
    },
    methods:{
      logout (){
        window.localStorage.clear()
        this.$router.push({path: "/"})
      }
    }
  }
</script>

