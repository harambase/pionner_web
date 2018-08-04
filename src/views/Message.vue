<template>
  <div class="animated fadeIn">
    <b-row id="myCoursePage">
      <b-col cols="12">
        <b-card>
          <b-row>
            <b-col cols="12">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>您的信息列表</strong>
                </div>
                <b-container fluid>
                  <el-tabs v-model="activeName" tab-position="left">
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
                    <CMessageTable :mode="activeName" :info="info"/>
                  </el-tabs>
                </b-container>
              </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
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
        info: {
          unread: 0,
          important: 0,
          urgent: 0,
          trashed: 0,
        },
        activeName: 'first'
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
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
    }
  }
</script>
