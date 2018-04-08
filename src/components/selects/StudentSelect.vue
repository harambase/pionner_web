<template>
  <b-form-group horizontal label="按学生：" class="mb-0">
    <v-select v-model="student" :filterable="false" :options="studentOptions"
              @search="studentList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-studentSelect',
    data () {
      return {
        student: '',
        studentOptions: [],
      }
    },
    mounted() {
      axios.get('/user/search?type=s&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let item = {
            label: name,
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
            let item = {
              label: name,
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

