<template>
  <b-form-group horizontal label="按课程：" class="mb-0">
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
        course: '',
        courseOptions: [],
      }
    },
    watch:{
      course: function (val) {
        let course = {
          label: val.label,
          value: val.value
        }
        this.$emit('pass', course)
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

