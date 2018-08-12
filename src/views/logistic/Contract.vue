<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="合同列表" name="first">
            <CContractTable :activeName="activeName"/>
          </el-tab-pane>
          <el-tab-pane label="录入新合同" name="second">
            <CContractForm/>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
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
        activeName: 'first'
      }
    }
  }

</script>
