<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="查看所有申请" name="first"></el-tab-pane>
      <el-tab-pane label="只查看申请中" name="second"></el-tab-pane>
      <el-tab-pane label="只查看已批准" name="third"></el-tab-pane>
      <el-tab-pane label="只查看已拒绝" name="fourth"></el-tab-pane>

      <b-card header-tag="header"
              footer-tag="footer">
        <div slot="header">
          <i className="fa fa-align-justify"></i><strong>用户申请列表</strong>
        </div>
        <b-container fluid>
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
                   ref="regTable"
                   :striped=true
                   :fixed=true
                   :hover=true
                   :items="regTable"
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
            <template slot="userJson" slot-scope="row">
              {{JSON.parse(row.value).lastName + ',' + JSON.parse(row.value).firstName}}
            </template>
            <template slot="status" slot-scope="row">
              <p v-if="row.value === '0'" style="color:blue;">申请中</p>
              <p v-if="row.value === '1'" style="color:green;">已批准</p>
              <p v-if="row.value === '-1'" style="color:red;">已拒绝</p>
            </template>

            <template slot="actions" slot-scope="row">
              <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                {{ row.detailsShowing ? '隐藏' : '展示' }}详情
              </b-button>
            </template>
            <template slot="row-details" slot-scope="row">
              <b-card>
                <b-list-group>
                  <b-list-group-item href="#" title="编辑用户"
                                     class="flex-column align-items-start"
                                     :disabled="row.item.status === '0'">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">
                        用户 <strong>{{JSON.parse(row.item.userJson).lastName}},
                        {{JSON.parse(row.item.userJson).firstName}}</strong>
                        的基本信息</h5>
                      <small class="text-muted">用户ID：{{row.item.userId}}</small>
                    </div>
                    <hr/>
                    <b-row>
                      <b-col md="12" class="my-1">
                        <div class="mr-1">
                          <dl class="row">
                            <dt class="col-sm-1">QQ:</dt>
                            <dd class="col-sm-2">{{JSON.parse(row.item.userJson).qq}}</dd>

                            <dt class="col-sm-1">电话:</dt>
                            <dd class="col-sm-2">{{JSON.parse(row.item.userJson).tel}}</dd>

                            <dt class="col-sm-1">微信:</dt>
                            <dd class="col-sm-2">{{JSON.parse(row.item.userJson).weChat}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">性别:</dt>
                            <dd class="col-sm-2">{{JSON.parse(row.item.userJson).gender}}</dd>

                            <dt class="col-sm-1">宿舍:</dt>
                            <dd class="col-sm-1">{{JSON.parse(row.item.userJson).dorm}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">邮箱:</dt>
                            <dd class="col-sm-3">{{JSON.parse(row.item.userJson).email}}</dd>

                            <dt class="col-sm-1">住址:</dt>
                            <dd class="col-sm-3">{{JSON.parse(row.item.userJson).address}}</dd>

                          </dl>
                          <dl class="row">
                            <dt class="col-sm-2">基本信息表:</dt>
                            <dd class="col-sm-5"
                                v-if="JSON.parse(row.item.userJson).baseInfo !== '' &&
                                    JSON.parse(row.item.userJson).baseInfo !== undefined &&
                                    JSON.parse(row.item.userJson).baseInfo !== null ">
                              <a href="#"
                                 @click="documentDownload(row.item.userId)">{{JSON.parse(row.item.userJson).baseInfo.name}}</a>
                            </dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">备注:</dt>
                            <dd class="col-sm-5">{{JSON.parse(row.item.userJson).comment}}</dd>
                          </dl>
                          <hr/>
                          <dl class="row">
                            <dt class="col-sm-1">操作:</dt>
                            <dd class="col-sm-5">
                              <b-button size="sm"
                                        class="btn btn-danger"
                                        @click.stop="showDeleteTempUser(row.item.id)">
                                删除该申请
                              </b-button>

                              <b-button size="sm"
                                        class="btn btn-info"
                                        @click="tempUserDetail(row.item.id)">
                                审核该申请
                              </b-button>
                            </dd>
                          </dl>
                        </div>
                      </b-col>
                    </b-row>
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
              <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至 {{((currentPage-1)
                * perPage + perPage) <=
                totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
            </b-col>
          </b-row>
        </b-container>
      </b-card>
    </el-tabs>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteTempUser"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该申请？</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'userId', label: '临时用户ID', sortable: true},
    {key: 'userJson', label: '姓, 名', sortable: true},
    {key: 'createTime', label: '申请时间', sortable: true},
    {key: 'updateTime', label: '更新时间', sortable: true},
    {key: 'status', label: '申请状态', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'Reg',
    data() {
      return {
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        viewStatus: '0',
        isBusy: false,
        profilePath: '',
        basePath: basePath,
        deleteId: '',
        activeName: 'second'
      }
    },
    watch: {
      activeName: function (val) {
        switch (val) {
          case 'first':
            this.viewStatus = ''
            break;
          case 'second':
            this.viewStatus = '0'
            break;
          case 'third':
            this.viewStatus = '1'
            break;
          case 'fourth':
            this.viewStatus = '-1'
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
      deleteTempUser() {
        axios.delete('/request/user/' + this.deleteId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功!'
            this.showModal = true
            this.headerBgVariant = 'success'
            this.initTable()
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      documentDownload() {
        window.open(basePath + '/request/user/info/' + this.userId + '?token=' + window.localStorage.getItem('access_token'))
      },
      showDeleteTempUser(id) {
        this.showDeleteModal = true
        this.deleteId = id
      },
      tempUserDetail(id) {
        this.$router.push({path: '/system/user/detail?mode=request&id=' + id})
      },
      showGeneral: function () {
        this.viewStatus = ''
        this.initTable()
      },
      showActive: function () {
        this.viewStatus = '0'
        this.initTable()
      },
      showDeclined: function () {
        this.viewStatus = '-1'
        this.initTable()
      },
      showApproved: function () {
        this.viewStatus = '1'
        this.initTable()
      },
      initTable() {
        this.$refs.regTable.refresh()
      },
      regTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/request/user?start=' + ctx.currentPage + '&length=' +
          +ctx.perPage + '&viewStatus=' + this.viewStatus + '&orderCol='
        switch (ctx.sortBy) {
          case 'userId':
            url += 'user_id'
            break
          case 'userJson':
            url += 'user_json'
            break
          case 'createTime':
            url += 'create_time'
            break
          case 'updateTime':
            url += 'update_time'
            break
          default:
            url += ctx.sortBy
            break
        }
        if (isNotEmpty(ctx.filter))
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
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
