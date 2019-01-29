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
    props: ['passRate'],
    data() {
      return {
        basePath: basePath,
        rate: '',
        avg: 0.0
      }
    },
    mounted() {
      console.log(this.passRate);
      if (!this.isNotEmptyArray(this.passRate))
        return;
      this.rate = JSON.parse(this.passRate);
      for (let i = 0; i < this.rate.length; i++) {
        this.avg += parseFloat(this.rate[i].star);
      }
      this.avg = this.avg / this.rate.length;
      this.avg = this.avg.toFixed(2);
    },
    methods: {
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      isNotEmptyArray(value) {
        return value !== '' && value !== undefined && value !== null && value !== '\"[]\"'
      }
    }
  }
</script>
