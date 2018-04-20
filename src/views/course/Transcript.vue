<template>
  <div class="animated fadeIn">
    <b-row id="myCoursePage">
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>成绩单</strong>
          </div>
          <b-container fluid>

            <!-- User Interface controls -->
            <b-row>
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">每页显示：</legend>
              </b-col>
              <b-col md="3" class="my-1">
                <b-form-group>
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
              <b-col md="4" class="my-1"></b-col>
              <b-col md="3" class="my-1">
                <b-form-group>
                  <b-input-group>
                    <b-input-group-button>
                      <b-button disabled><i class="fa fa-search"></i></b-button>
                    </b-input-group-button>
                    <b-form-input v-model="filter"/>
                    <b-input-group-button>
                      <b-button variant="danger" :disabled="!filter" @click="filter = ''">重置</b-button>
                    </b-input-group-button>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     ref="transTable"
                     :striped=true
                     :fixed=true
                     :hover=true
                     :items="transTable"
                     :fields="field"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :isBusy="false"
                     @filtered="onFiltered"
            >
              <template slot="complete" slot-scope="row">
                <p v-if="row.value === '1'" style="color:blue;">完成</p>
                <p v-if="row.value === '0'" style="color:green;">进行中</p>
                <p v-if="row.value === '-1'" style="color:red;">挂科</p>
              </template>
            </b-table>
            <b-col md="6" class="my-1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                            class="my-0"/>
            </b-col>
          </b-container>
        </b-card>
      </b-col>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>下载成绩单</strong>
          </div>
          <b-container fluid>
            <b-row>
              <h5 style="float: left">官方个人成绩单报告：</h5>
              <b-input-group-button>
                <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="download">下载</b-button>
              </b-input-group-button>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import fileDownload from 'js-file-download'

  const items = []
  const field = [
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '姓名', sortable: true},
    {key: 'crn', label: '课码', sortable: true},
    {key: 'cname', label: '课名', sortable: true},
    {key: 'fname', label: '授课人', sortable: true},
    {key: 'grade', label: '成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true},
    {key: 'assignTime', label: '提交时间', sortable: true},
  ]

  export default {
    name: 'Transcript',
    data () {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        info: '',
        faculty: '',
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      transTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/transcript?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal
          return (items || [])
        })

      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      download () {
        window.open(basePath + '/transcript/report?token=' + window.localStorage.getItem('access_token'))
      }
    }
  }
</script>
