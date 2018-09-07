<template>
  <b-form-group>
    <b-input-group>
      <b-input-group-button>
        <b-button disabled>课程</b-button>
      </b-input-group-button>
      <v-select v-model="course" :filterable="false" :options="courseOptions" :placeholder="'输入搜索'"
                @search="courseList"></v-select>
    </b-input-group>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-courseSelect',
    props: ['info'],
    data() {
      return {
        course: '',
        courseOptions: [],
      }
    },
    watch: {
      course: function (val) {
        this.$emit('pass', val)
      }
    },
    mounted() {
      axios.get('/course/search?info=' + this.info.value + '&search=').then((response) => {
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
      courseList(search, loading) {
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

