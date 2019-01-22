<template>
  <div>
    <el-rate
      v-model="avg"
      disabled
      show-score
      text-color="#ff9900"
      score-template="{value}">
    </el-rate>
  </div>

</template>

<script>
  export default {
    name: 'c-rate',
    props: ['rate'],
    data() {
      return {
        basePath: basePath,
        avg: 0.0
      }
    },
    mounted() {
      if(!this.isNotEmpty(this.rate))
        return;
      for (let i = 0; i < this.rate.length; i++) {
        this.avg += parseFloat(this.rate[i].star);
      }
      this.avg = this.avg/this.rate.length
    },
    methods: {
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }
  }
</script>
