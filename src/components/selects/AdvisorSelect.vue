<template>
  <b-form-group>
    <b-input-group>
      <b-input-group-button>
        <b-button disabled>导师</b-button>
      </b-input-group-button>
      <v-select v-model="advisor" :filterable="false" :options="advisorOptions" :placeholder="'输入搜索'"
                @search="advisorList">
        <template slot="option" slot-scope="option">
          <img class="img-avatar" style="width:30px; height: 30px;" :src="option.profile">
          {{ option.label }}
        </template>
      </v-select>
    </b-input-group>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-advisorSelect',
    data() {
      return {
        advisor: '',
        advisorOptions: [],
      }
    },
    watch: {
      advisor: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted() {
      axios.get('/user/search?status=1&type=f&role=7&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let profilePath = basePath + '/static/img/logo.png'
          if (isNotEmpty(response.data.data[i].profile)) {
            let profile = JSON.parse(response.data.data[i].profile)
            profilePath = basePath + '/static' + profile.path;
          }
          let item = {
            label: name,
            value: response.data.data[i].userId,
            profile: profilePath
          }
          this.advisorOptions.push(item)
        }
      })
    },
    methods: {
      advisorList(search, loading) {
        loading(true)
        this.advisorOptions = []
        axios.get('/user/search?type=f&role=7&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let profilePath = ''
            if (isNotEmpty(response.data.data[i].profile)) {
              let profile = JSON.parse(response.data.data[i].profile)
              profilePath = basePath + '/static' + profile.path;
            }
            let item = {
              label: name,
              value: response.data.data[i].userId,
              profile: profilePath
            }
            this.advisorOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

