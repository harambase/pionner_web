<template>
  <b-form-group>
    <b-input-group>
      <b-input-group-button>
        <b-button disabled>学生</b-button>
      </b-input-group-button>
      <v-select v-model="student" :filterable="false" :options="studentOptions"
                @search="studentList" :placeholder="'输入搜索'" multiple>
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
    name: 'c-studentSelect',
    data() {
      return {
        student: [],
        studentOptions: [],
      }
    },
    watch: {
      student: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted() {
      axios.get('/user/search?type=s&search=').then((response) => {
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
          this.studentOptions.push(item)
        }
      })
    },
    methods: {
      studentList(search, loading) {
        loading(true)
        this.studentOptions = []
        axios.get('/user/search?type=s&search=' + search).then((response) => {
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
            this.studentOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

