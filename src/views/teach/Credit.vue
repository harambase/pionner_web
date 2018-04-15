<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-col cols="12">
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>学生列表</strong>
            </div>
            <CAddStudentTable mode="credit"/>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
  </div>

</template>

<script>
  import CAddStudentTable from '../../components/tables/AddStudentTable'

  export default {
    name: 'Credit',
    components: {CAddStudentTable},
  }

</script>
