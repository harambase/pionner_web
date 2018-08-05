<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>辅导关系列表</strong>
          </div>
          <CAdviseTable showAdvisor="1"/>
        </b-card>
      </b-col>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>下载导师表</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="3" class="my-1">
                <CInfoSelect v-on:pass="passInfo"/>
              </b-col>
              <b-col md="6" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadAdvise"
                            :disabled="!isNotEmpty(info)">下载
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

  import CAdviseTable from '../../components/tables/AdviseTable'
  import CInfoSelect from '../../components/selects/InfoSelect'

  export default {
    name: 'Advise',
    components: {CInfoSelect, CAdviseTable},
    data () {
      return {
        info: '',
      }
    },

    methods: {
      passInfo (val) {
        this.info = val
      },
      downloadAdvise () {
        window.open(basePath + '/advise/download/' + this.info.value + '?token=' + window.localStorage.getItem('access_token'))
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
