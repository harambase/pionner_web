<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="学生列表" name="first">
        <CAddStudentTable mode="info"/>
      </el-tab-pane>
      <el-tab-pane label="教师列表" name="second">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CAddStudentTable from "../../components/tables/AddStudentTable";

  export default {
    name: 'user-information',
    components: {CAddStudentTable},
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }

  }
</script>
