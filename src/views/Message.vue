<template>
  <div class="animated fadeIn">

    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane name="first">
        <span slot="label">
          <i class="el-icon-message"></i> 收件箱
          <b-badge v-if="info.unread>0" variant="primary" pill> {{info.unread}}</b-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">
          <i class="el-icon-info"></i> 重要信息
          <b-badge v-if="info.important>0" variant="primary" pill>{{info.important}}</b-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">
          <i class="el-icon-info"></i> 紧急信息
          <b-badge v-if="info.urgent>0" variant="danger" pill>{{info.urgent}}</b-badge>
        </span>
      </el-tab-pane>
      <el-tab-pane label="垃圾箱" name="fourth">
        <span slot="label">
          <i class="el-icon-delete"></i> 已删除
        </span>
      </el-tab-pane>
      <CMessageTable :mode="activeName" :info="info" :id="id"/>
    </el-tabs>

  </div>
</template>

<script>
  import axios from 'axios'
  import CMessageTable from "../components/tables/MessageTable";

  export default {
    name: 'message',
    components: {CMessageTable},
    data() {
      return {
        id: this.$route.fullPath.split('&')[0].split('=')[1],//maybe CRN
        info: {
          unread: 0,
          important: 0,
          urgent: 0,
          trashed: 0,
        },
        activeName: 'first'
      }
    },
    mounted() {
      axios.get('/message/count?status=unread&box=important').then((response) => {
        this.info.important = response.data.data
      });

      axios.get('/message/count?status=unread&box=urgent').then((response) => {
        this.info.urgent = response.data.data
      });

      axios.get('/message/count?status=unread&box=inbox').then((response) => {
        this.info.unread = response.data.data
      });
    },
    watch: {
      $route(to, from) {
        this.id = this.$route.fullPath.split('&')[0].split('=')[1]//maybe CRN
      }
    }
  }
</script>
