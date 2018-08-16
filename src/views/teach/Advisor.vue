<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>新增导师</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="1" class="mt-1">
                <legend class="col-form-legend">选择老师：</legend>
              </b-col>
              <b-col md="3" class="my-1">
                <CFacultySelect v-on:pass="passFaculty"/>
              </b-col>
              <b-col md="3" class="my-1">
                <b-button style="width:150px;" variant="success" @click="addAdvisor" :disabled="!isNotEmpty(faculty)">
                  添加导师
                </b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>导师列表</strong>
          </div>
          <b-row>
            <CAdvisorTable ref="CAdvisorTable"/>
          </b-row>
        </b-card>
      </b-col>
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
  import axios from 'axios'
  import CAdvisorTable from '../../components/tables/AdvisorTable'
  import CFacultySelect from '../../components/selects/FacultySelect'

  export default {
    name: 'Advisor',
    components: {CFacultySelect, CAdvisorTable},
    data() {
      return {
        faculty: '',
        showModal: false,
        msg: '',
        headerBgVariant: ''
      }
    },
    methods: {
      passFaculty(val) {
        this.faculty = val
      },
      addAdvisor() {
        axios.put('/advise/advisor/' + this.faculty.value).then((response) => {
          if (response.data.code) {
            this.msg = '添加成功！';
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.$refs.CAdvisorTable.initTable();
          } else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
