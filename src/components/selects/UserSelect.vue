<template>
  <b-form-group>
    <v-select v-model="user" :filterable="false" :options="userOptions"
              @search="userList">
      <template slot="option" slot-scope="option">
        <img class="img-avatar" style="width:30px; height: 30px;" :src="option.profile">
        {{ option.label }}
      </template>
    </v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-userSelect',
    props: ['mode'],
    data () {
      return {
        user: {
          label: '---选择用户---',
          profile: basePath + '/static/img/logo.png',
          value: ''
        },
        userOptions: [{
          label: '---选择用户---',
          profile: basePath + '/static/img/logo.png',
          value: ''
        }],
      }
    },
    watch: {
      user: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted () {
      axios.get('/user/search?status=1&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let profilePath = basePath + '/static/img/logo.png'
          if (isNotEmpty(response.data.data[i].profile)) {
            let profile = JSON.parse(response.data.data[i].profile)
            profilePath = basePath + '/static' + profile.path
          }
          let item = {
            label: name,
            profile: profilePath,
            value: response.data.data[i].userId
          }
          this.userOptions.push(item)
        }
      })
    },
    methods: {
      userList (search, loading) {
        loading(true)
        this.userOptions = []
        axios.get('/user/search?status=1&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let profilePath = basePath + '/static/img/logo.png'
            if (isNotEmpty(response.data.data[i].profile)) {
              let profile = JSON.parse(response.data.data[i].profile)
              profilePath = basePath + '/static' + profile.path
            }
            let item = {
              label: name,
              profile: profilePath,
              value: response.data.data[i].userId
            }
            this.userOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

