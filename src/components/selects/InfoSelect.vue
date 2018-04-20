<template>
  <b-form-group>
    <v-select v-model="info" :filterable="false"
              :options="infoOptions" @search="infoList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-infoSelect',
    data () {
      return {
        info: {
          label: '---选择学期---',
          value: ''
        },
        infoOptions: [
          {
            label: '---选择学期---',
            value: ''
          }
        ],
      }
    },
    mounted () {
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.infoOptions.push(item)
        }
      })
    },
    watch: {
      info: function (val) {
        this.$emit('pass', val)
      }
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

