<template>
  <b-form-group horizontal label="按学期：" class="mb-0">
    <v-select v-model="info" :filterable="false" :options="infoOptions"
              @search="infoList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-infoSelect',
    data () {
      return {
        info: '',
        infoOptions: [],
      }
    },
    mounted() {
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.infoOptions.push(item)
          // this.reportInfoOptions.push(item)
        }
      })
    },
    methods: {
      infoList (search, loading) {
        loading(true)
        this.infoOptions = []
        axios.get('/course/info?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i],
              value: response.data.data[i]
            }
            this.infoOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

