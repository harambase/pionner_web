<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>临时辅导关系列表</strong>
          </div>
          <CRequestAdvisorTable mode="manage"/>
        </b-card>
      </b-col>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>下载临时辅导关系列表</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="6" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadAdvise">下载
                  </b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import CRequestAdvisorTable from '../../components/tables/RequestAdvisorTable'

  export default {
    name: 'Advise',
    components: {CRequestAdvisorTable},
    data() {
      return {}
    },
    methods: {
      downloadAdvise() {
        window.open(basePath + '/request/advise/download?token=' + window.localStorage.getItem('access_token'))
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
