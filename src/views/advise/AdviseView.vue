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
          <CAdviseTable showAdvisor="0" mode="faculty"/>
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
    data() {
      return {
        info: '',
      }
    },
    methods: {
      passInfo(val) {
        this.info = val
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
