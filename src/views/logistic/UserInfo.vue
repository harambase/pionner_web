<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="学生列表" name="first">
        <CAddStudentTable mode="info"/>
      </el-tab-pane>
      <el-tab-pane label="教师列表" name="second">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>PIN生成</strong>
            <small>生成规则信息</small>
          </div>
          <b-card-body>
          </b-card-body>
          <div slot="footer">
          </div>
        </b-card>
      </el-tab-pane>
    </el-tabs>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             centered
             title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import CAddStudentTable from "../../components/tables/AddStudentTable";

  export default {
    name: 'user-information',
    components: {CAddStudentTable},
    data() {
      return {
        showModal: false,
        msg: '',
        headerBgVariant: '',
        activeName: 'first'
      }
    },
    methods: {
      passUser(val) {
        this.user = val
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }

  }
</script>
