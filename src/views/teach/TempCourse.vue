<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="查看所有申请" name="first"></el-tab-pane>
      <el-tab-pane label="只查看申请中" name="second"></el-tab-pane>
      <el-tab-pane label="只查看已批准" name="third"></el-tab-pane>
      <el-tab-pane label="只查看已拒绝" name="fourth"></el-tab-pane>

      <b-card
        header-tag="header"
        footer-tag="footer">
        <div slot="header">
          <i className="fa fa-align-justify"></i><strong>新课程申请</strong>
          <small>分类查看</small>
        </div>
        <b-container fluid>
          <b-row class="ml-1">
            <b-col md="12">
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
                       ref="tempCourseTable"
                       :striped=true
                       :fixed=true
                       :hover=true
                       :items="tempCourseTable"
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
                <template slot="status" slot-scope="row">
                  <p v-if="row.value === '1'" style="color:green;">已批准</p>
                  <p v-if="row.value === '0'" style="color:blue;">申请中</p>
                  <p v-if="row.value === '-1'" style="color:red;">已拒绝</p>
                </template>
                <template slot="courseJson" slot-scope="row">
                  {{JSON.parse(row.value).name}}
                </template>
                <template slot="actions" slot-scope="row">

                  <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                    {{ row.detailsShowing ? '隐藏' : '展示' }}详情
                  </b-button>

                  <b-button size="sm"
                            class="btn btn-danger"
                            @click.stop="showDeleteTempCourse(row.item.id)">
                    删除该申请
                  </b-button>
                </template>

                <template slot="row-details" slot-scope="row">
                  <b-card>
                    <b-list-group>
                      <b-list-group-item title="编辑课程" class="flex-column align-items-start" href="#"
                                         :disabled="row.item.status !== '0'" @click="detail(row.item.id)">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">你的临时课程 <strong>{{JSON.parse(row.item.courseJson).name}}</strong> 的信息</h5>
                          <small class="text-muted">授课老师ID：{{row.item.facultyId}}</small>
                        </div>
                        <hr/>
                        <div class="mr-1">
                          <dl class="row">
                            <dt class="col-sm-1">课程临时CRN:</dt>
                            <dd class="col-sm-1">{{row.item.crn}}</dd>

                            <dt class="col-sm-1">课程学期:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.courseJson).info}}</dd>

                            <dt class="col-sm-1">课程容量:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.courseJson).capacity}}</dd>

                            <dt class="col-sm-1">课程学分:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.courseJson).credits}}</dd>

                            <dt class="col-sm-1">课程等级:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.courseJson).level}}</dd>

                            <dt class="col-sm-1">课程班级:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.courseJson).section}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">上课时间:</dt>
                            <dd class="col-sm-3">{{JSON.parse(row.item.courseJson).startTime}} to
                              {{JSON.parse(row.item.courseJson).endTime}}， 每周 {{JSON.parse(row.item.courseJson).day}}
                            </dd>

                            <dt class="col-sm-1">上课周期:</dt>
                            <dd class="col-sm-3">{{JSON.parse(row.item.courseJson).startDate}} to
                              {{JSON.parse(row.item.courseJson).endDate}}
                            </dd>

                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">操作人:</dt>
                            <dd class="col-sm-5" style="color:red">{{row.item.operatorId}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">备注:</dt>
                            <dd class="col-sm-5" style="color:red">{{JSON.parse(row.item.courseJson).comment}}</dd>
                          </dl>

                        </div>
                        <!--<button class="btn btn-danger" style="width:150px;" @click="removeFromWorkSheet(index)">删除</button>-->
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
            </b-col>
          </b-row>
        </b-container>
      </b-card>
    </el-tabs>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteTempCourse"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该申请？</h3>
      </div>
    </b-modal>
    <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'crn', label: '临时课程编码', sortable: true, 'class': 'text-center'},
    {key: 'courseJson', label: '课程名', sortable: true},
    {key: 'facultyId', label: '申请人ID', sortable: true},
    {key: 'createTime', label: '申请时间', sortable: true},
    {key: 'status', label: '申请状态', sortable: true},
    {key: 'actions', label: '查看详情', sortable: false},
  ]

  export default {
    name: 'TempCourse',
    data() {
      return {
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        status: '0',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        infoOptions: [],
        facultyOptions: [],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        showDeleteModal: false,
        showModal: false,
        headerBgVariant: '',
        msg: '',
        id: '',
        activeName: 'second'
      }
    },
    watch: {
      activeName: function (val) {
        switch (val) {
          case 'first':
            this.status = ''
            break;
          case 'second':
            this.status = '0'
            break;
          case 'third':
            this.status = '1'
            break;
          case 'fourth':
            this.status = '-1'
            break;
        }
        this.initTable();
      }
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
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.tempCourseTable.refresh()
      },
      tempCourseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/request/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'courseJson':
            url += 'course_json'
            break
          case 'facultyId':
            url += 'faculty_id'
            break
          case 'createTime':
            url += 'create_time'
            break
          default:
            url += ctx.sortBy
            break
        }
        if (this.isNotEmpty(this.status))
          url += '&viewStatus=' + this.status
        if (this.isNotEmpty(this.pageMode))
          url += '&mode=' + this.pageMode
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
      showDeleteTempCourse(id) {
        this.id = id
        this.showDeleteModal = true
      },
      deleteTempCourse() {
        this.showModal = true
        this.initTable()
        axios.delete('/request/course/' + this.id).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功'
            this.headerBgVariant = 'success'
          }
          else {
            this.msg = response.data.msg
            this.headerBgVariant = 'danger'

          }
        })
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      detail(id) {
        let url = '/course/new/create?mode=request&id=' + id
        if (this.pageMode === 'manage') {
          url = '/teach/detail?mode=create&id=' + id
        }
        this.$router.push({path: url})
      }
    }
  }

</script>
