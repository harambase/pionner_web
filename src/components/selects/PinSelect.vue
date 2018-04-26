<template>
  <b-form-group>
    <v-select v-model="pin" :filterable="false"
              :options="pinOptions" @search="pinList"></v-select>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-pinSelect',
    data () {
      return {
        pin: {
          label: '---选择识别码---',
          value: ''
        },
        pinOptions: [
          {
            label: '---选择识别码---',
            value: ''
          }
        ],
      }
    },
    mounted () {
      axios.get('/pin?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.pinOptions.push(item)
        }
      })
    },
    watch: {
      pin: function (val) {
        this.$emit('pass', val)
      }
    },
    methods: {
      pinList (search, loading) {
        loading(true)
        this.pinOptions = []
        axios.get('/pin?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i],
              value: response.data.data[i]
            }
            this.pinOptions.push(item)
          }
        })
        loading(false)
      },
    }
  }
</script>

