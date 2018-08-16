<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <small class="d-md-down-none"> 欢迎回来 {{user.lastName}}, {{user.firstName}}</small>
      <img :src="profilePath" class="img-avatar">
    </template>

    <b-dropdown-header tag="div" class="text-center"><strong>用户 {{user.userId}}</strong>
    </b-dropdown-header>
    <b-dropdown-item @click="viewProfile"><i class="fa fa-user"></i> 个人资料</b-dropdown-item>
    <!--<b-dropdown-item @click="logout"><i class="fa fa-lock"></i> 账户上锁</b-dropdown-item>-->
    <b-dropdown-item @click="logout"><i class="fa fa-power-off"></i> 登出</b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
  import axios from 'axios'
  import decode from 'jwt-decode'

  export default {
    name: 'header-dropdown',
    data: () => {
      return {
        user: '',
        profile: '',
        itemsCount: 42,
        profilePath: ''
      }
    },
    mounted: function () {
      const decoded_token = decode(window.localStorage.getItem('access_token'));
      axios.get('/user/' + decoded_token.sub).then((response) => {
        this.user = response.data.data;
        if (isNotEmpty(this.user.profile)) {
          this.profile = JSON.parse(this.user.profile);
          this.profilePath = basePath + '/static' + this.profile.path
        }
      })
    },
    methods: {
      logout() {
        window.localStorage.clear();
        this.$router.push({path: "/"})
      },
      viewProfile() {
        this.$router.push({path: "/profile"})
      }
    }
  }
</script>

