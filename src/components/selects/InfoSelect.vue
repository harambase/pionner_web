<template>
  <b-form-group>
    <b-input-group>
      <b-input-group-button>
        <b-button disabled>学期</b-button>
      </b-input-group-button>
      <v-select v-model="info" :filterable="false"
                :placeholder="'输入搜索'"
                :options="infoOptions" @search="infoList"></v-select>
    </b-input-group>
  </b-form-group>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'c-infoSelect',
    data() {
      return {
        info: '',
        infoOptions: [],
      }
    },
    mounted() {
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let label = response.data.data[i].split("-");
          let semester = "";

          switch (label[1]) {
            case '01':
              semester = '-春季';
              break;
            case '02':
              semester = '-秋季';
              break;
            case '03':
              semester = '-秋季';
              break;
          }

          let item = {
            label: label[0] + semester,
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
      infoList(search, loading) {
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

