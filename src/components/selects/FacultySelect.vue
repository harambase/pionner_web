<template>
  <b-form-group horizontal label="按教师：" class="mb-0">
    <v-select v-model="faculty" :filterable="false" :options="facultyOptions"
              @search="facultyList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-facultySelect',
    data () {
      return {
        faculty: '',
        facultyOptions: [],
      }
    },
    watch:{
      faculty: function (val) {
        let faculty = {
          label: val.label,
          value: val.value
        }
        this.$emit('pass', faculty)
      }
    },
    mounted() {
      axios.get('/user/search?status=1&type=f&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let item = {
            label: name,
            value: response.data.data[i].userId
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
            let item = {
              label: name,
              value: response.data.data[i].userId
            }
            this.facultyOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

