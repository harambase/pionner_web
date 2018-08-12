<template>
  <div class="animated fadeIn">
    <b-row>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="合同列表" name="first">
          <CContractTable/>
        </el-tab-pane>
        <el-tab-pane label="录入新合同" name="second">
          <CContractForm/>
        </el-tab-pane>
      </el-tabs>
    </b-row>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>

  import CContractTable from "../../components/tables/ContractTable";
  import CContractForm from "../../components/parts/ContractForm";

  export default {
    name: 'Contract',
    components: {CContractTable, CContractForm},
    data() {
      return {
        goTo: '',
        msg: '',
        showModal: false,
        headerBgVariant: '',
        status: '',
        basePath: basePath,
        deleteUserId: '',
        activeName: 'first'
      }
    },
    methods: {
      documentDownload(userId) {
        window.open(basePath + '/contract/info/' + userId + '?token=' + window.localStorage.getItem('access_token'))
      },
    }
  }
</script>
