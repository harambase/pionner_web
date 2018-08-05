<template>
  <b-row>
    <b-col md="2">
      <div class="input-group-prepend">
        <span class="input-group-text"><i class="icon-info"></i> 学期:</span>
      </div>
    </b-col>
    <b-col md="10">
      <v-select v-model="info" :filterable="false"
                :options="infoOptions" @search="infoList"></v-select>
    </b-col>
  </b-row>
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

