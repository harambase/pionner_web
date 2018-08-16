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
            <b-row>
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">检索条件：</legend>
              </b-col>
              <b-col md="3" class="my-1">
                <InfoSelect v-on:pass="passInfo"/>
              </b-col>
            </b-row>
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
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-input-group>
                    <b-input-group-button>
                      <div class="mt-2">
                        搜索：
                      </div>
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
              <template slot="index" slot-scope="row">
                {{(currentPage-1) * perPage + 1 + row.index}}
              </template>

              <template slot="complete" slot-scope="row">
                <p v-if="row.value === '1'" style="color:blue;">完成</p>
                <p v-if="row.value === '0'" style="color:green;">进行中</p>
                <p v-if="row.value === '-1'" style="color:red;">挂科</p>
              </template>

              <template slot="actions" slot-scope="row">
                <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                  查看评语
                </b-button>
              </template>

              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-list-group>
                    <b-list-group-item title="课程评语" class="flex-column align-items-start">
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">你的课程 <strong>{{row.item.cname}}</strong> 的老师评语信息</h5>
                        <small class="text-muted">授课老师：{{row.item.fname}}</small>
                      </div>
                      <hr/>
                      <div class="mr-1">
                        <dl class="row">
                          <dt class="col-sm-1">评语:</dt>
                          <dd class="col-sm-11">{{row.item.remark}}</dd>
                        </dl>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </template>

            </b-table>
            <b-row>
              <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                              class="my-0"/>
              </b-col>
              <b-col md="6" class="my-1">
                <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至
                  {{((currentPage-1) * perPage + perPage) <=
                  totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
      <!--<b-col cols="12">-->
      <!--<b-card-->
      <!--header-tag="header"-->
      <!--footer-tag="footer">-->
      <!--<div slot="header">-->
      <!--<i className="fa fa-align-justify"></i><strong>下载成绩单</strong>-->
      <!--</div>-->
      <!--<b-container fluid>-->
      <!--<b-row>-->
      <!--<h5 style="float: left">官方个人成绩单报告：</h5>-->
      <!--<b-input-group-button>-->
      <!--<b-button class="mb-4 btn btn-success" style="width: 150px;" @click="download">下载</b-button>-->
      <!--</b-input-group-button>-->
      <!--</b-row>-->
      <!--</b-container>-->
      <!--</b-card>-->
      <!--</b-col>-->
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import {InfoSelect} from '../../components/'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '姓名', sortable: true},
    {key: 'crn', label: '课码', sortable: true},
    {key: 'cname', label: '课名', sortable: true},
    {key: 'fname', label: '授课人', sortable: true},
    {key: 'grade', label: '成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true},
    {key: 'credit', label: '完成学分', sortable: true},
    {key: 'assignTime', label: '提交时间', sortable: true},
    {key: 'actions', label: '操作', sortable: true},
  ]

  export default {
    name: 'Transcript',
    components: {InfoSelect},
    data() {
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
    watch: {
      info: function () {
        this.initTable();
      },
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
    methods: {
      passInfo(val) {
        this.info = val
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      transTable(ctx) {
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
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      download() {
        window.open(basePath + '/transcript/report?token=' + window.localStorage.getItem('access_token'))
      }
    }
  }
</script>
