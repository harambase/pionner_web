<template>
  <div class="animated fadeIn">
    <b-row id="myCoursePage">
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程列表</strong>
          </div>
          <b-container fluid>
            <!-- User Interface controls -->
            <b-row>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="显示" class="mb-0">
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="搜索" class="mb-0">
                  <b-input-group>
                    <b-form-input v-model="filter"/>
                    <b-input-group-button>
                      <b-btn :disabled="!filter" @click="filter = ''">重置</b-btn>
                    </b-input-group-button>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     :striped=true
                     :fixed=true
                     :hover=true
                     :items="courseTable"
                     :field="field"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :isBusy="false"
                     @filtered="onFiltered"
            >
              <template slot="status" slot-scope="row">
                <p v-if="row.value === 1" style="color:blue;">未开始</p>
                <p v-if="row.value === 0" style="color:green;">进行中</p>
                <p v-if="row.value === -1" style="color:red;">已结课</p>
              </template>
              <template slot="actions" slot-scope="row">
                <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                  {{ row.detailsShowing ? '隐藏' : '展示' }}详情
                </b-button>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                  </ul>
                </b-card>
              </template>
            </b-table>
            <b-col md="6" class="my-1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                            class="my-0"/>
            </b-col>
          </b-container>
        </b-card>
      </b-col>

    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'crn', label: '编号', sortable: true},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'capacity', label: '容量', sortable: true},
    {key: 'remain', label: '剩余', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'date', label: '起止时间', sortable: true},
    {key: 'time', label: '上课时间', sortable: true},
    {key: 'day', label: '星期', sortable: true},
    {key: 'faculty', label: '授课老师', sortable: true},
    {key: 'actions', label: '查看详情'}
  ];

  export default {
    name: 'Course',
    data () {
      return {
        field: field,
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false
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
      courseTable(ctx) {
        console.log(window.localStorage.getItem('access_token'))
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        let tokenStr = window.localStorage.getItem('access_token');
        // 新创建 axios 实例配置

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal
          return (items || [])
        })

      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
