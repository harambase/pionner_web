<template>
  <b-form-group>
    <v-select v-model="course" :filterable="false" :options="courseOptions"
              @search="courseList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-courseSelect',
    data () {
      return {
        course: {
          label: '---选择课程---',
          value: ''
        },
        courseOptions: [{
          label: '---选择课程---',
          value: ''
        }],
      }
    },
    watch:{
      course: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted() {
      axios.get('/course/search?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i].name,
            value: response.data.data[i].crn
          }
          this.courseOptions.push(item)
        }
      })
    },
    methods: {
      courseList (search, loading) {
        loading(true)
        this.courseOptions = []
        axios.get('/course/search?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i].name,
              value: response.data.data[i].crn
            }
            this.courseOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

