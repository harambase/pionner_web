<template>
  <b-form-group>
    <v-select v-model="student" :filterable="false" :options="studentOptions"
              @search="studentList">
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
    name: 'c-studentSelect',
    data () {
      return {
        student: {
          label: '---选择学生---',
          profile: basePath + '/pioneer/image/profile/logo.png',
          value: ''
        },
        studentOptions: [{
          label: '---选择学生---',
          profile: basePath + '/pioneer/image/profile/logo.png',
          value: ''
        }],
      }
    },
    watch: {
      student: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted () {
      axios.get('/user/search?type=s&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let profilePath = basePath + '/pioneer/image/profile/logo.png'
          if (isNotEmpty(response.data.data[i].profile)) {
            let profile = JSON.parse(response.data.data[i].profile)
            profilePath = basePath + '/pioneer' + profile.path
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
      studentList (search, loading) {
        loading(true)
        this.studentOptions = []
        axios.get('/user/search?type=s&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let profilePath = basePath + '/pioneer/image/profile/logo.png'
            if (isNotEmpty(response.data.data[i].profile)) {
              let profile = JSON.parse(response.data.data[i].profile)
              profilePath = basePath + '/pioneer' + profile.path
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

