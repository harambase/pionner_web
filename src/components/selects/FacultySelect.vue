<template>
  <b-form-group>
    <v-select v-model="faculty" :filterable="false" :options="facultyOptions"
              @search="facultyList">
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
    name: 'c-facultySelect',
    data () {
      return {
        faculty: {
          label: '---选择教师---',
          profile: basePath + '/pioneer/image/profile/logo.png',
          value: ''
        },
        facultyOptions: [{
          label: '---选择教师---',
          profile: basePath + '/pioneer/image/profile/logo.png',
          value: ''
        }],
      }
    },
    watch: {
      faculty: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted () {
      axios.get('/user/search?status=1&type=f&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let profilePath = basePath + '/pioneer/image/profile/logo.png'
          if (isNotEmpty(response.data.data[i].profile)) {
            let profile = JSON.parse(response.data.data[i].profile)
            profilePath = basePath + '/pioneer' + profile.path
          }
          let item = {
            label: name,
            value: response.data.data[i].userId,
            profile: profilePath
          }
          this.facultyOptions.push(item)
        }
      })
    },
    methods: {
      facultyList (search, loading) {
        loading(true)
        this.facultyOptions = []
        axios.get('/user/search?type=f&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let profilePath = ''
            if (isNotEmpty(response.data.data[i].profile)) {
              let profile = JSON.parse(response.data.data[i].profile)
              profilePath = basePath + '/pioneer' + profile.path
            }
            let item = {
              label: name,
              value: response.data.data[i].userId,
              profile: profilePath
            }
            this.facultyOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

