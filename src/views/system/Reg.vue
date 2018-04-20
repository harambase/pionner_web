<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>新用户申请</strong>
            <small>分类查看</small>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-warning" style="width: 100%;" @click="showGeneral">查看所有申请</b-button>
                </b-input-group-button>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-primary" style="width: 100%;" @click="showActive">只查看申请中</b-button>
                </b-input-group-button>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 100%;" @click="showApproved">只查看已批准</b-button>
                </b-input-group-button>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-danger" style="width: 100%;" @click="showDeclined">只查看已拒绝</b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
      <b-col cols="12">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>用户申请列表</strong>
          </div>
          <b-container fluid>
            <!-- User Interface controls -->
            <b-row>
              <b-col md="6" class="my-1">
                <b-form-group horizontal label="每页显示条数：" class="mb-0">
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-1">
                <b-form-group horizontal label="模糊查询：" class="mb-0">
                  <b-input-group>
                    <b-form-input v-model="filter"/>
                    <b-input-group-button>
                      <b-button :disabled="!filter" @click="filter = ''">重置</b-button>
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
                        <b-col md="9" class="my-1">
                          <div class="mr-1">
                            <dl class="row">
                              <dt class="col-sm-1">QQ:</dt>
                              <dd class="col-sm-2">{{JSON.parse(row.item.userJson).qq}}</dd>

                              <dt class="col-sm-1">电话:</dt>
                              <dd class="col-sm-2">{{JSON.parse(row.item.userJson).tel}}</dd>

                              <dt class="col-sm-1">微信号:</dt>
                              <dd class="col-sm-2">{{JSON.parse(row.item.userJson).weChat}}</dd>

                              <dt class="col-sm-1">性别:</dt>
                              <dd class="col-sm-2">{{JSON.parse(row.item.userJson).gender}}</dd>
                            </dl>
                            <dl class="row">
                              <dt class="col-sm-1">邮箱:</dt>
                              <dd class="col-sm-3">{{JSON.parse(row.item.userJson).email}}</dd>

                              <dt class="col-sm-1">宿舍号:</dt>
                              <dd class="col-sm-1">{{JSON.parse(row.item.userJson).dorm}}</dd>

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
                        <b-col md="3" class="my-1">
                          <img v-if="isNotEmpty(JSON.parse(row.item.userJson).profile)"
                               :src="basePath + '/pioneer' + JSON.parse(row.item.userJson).profile.path"
                               style="width: 230px;height: 230px"
                               class="img-avatar">
                        </b-col>
                      </b-row>
                    </b-list-group-item>
                  </b-list-group>
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
    {key: 'id', label: '序列号', sortable: true},
    {key: 'userId', label: '临时用户ID', sortable: true},
    {key: 'userJson', label: '姓, 名', sortable: true},
    {key: 'createTime', label: '申请时间', sortable: true},
    {key: 'status', label: '申请状态', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'Reg',
    data () {
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
        viewStatus: '',
        isBusy: false,
        profilePath: '',
        basePath: basePath,
        deleteId: ''
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
      deleteTempUser () {
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
      documentDownload () {
        window.open(basePath + '/request/user/info/' + this.userId + '?token=' + window.localStorage.getItem('access_token'))
      },
      showDeleteTempUser (id) {
        this.showDeleteModal = true
        this.deleteId = id
      },
      previewImg () {
        let preview = document.getElementById('preview')
        let file = document.querySelector('input[type=file]').files[0]
        let reader = new FileReader()
        if (file) {
          reader.readAsDataURL(file)
        } else {
          preview.src = ''
        }
        reader.onloadend = function () {
          preview.src = reader.result
        }
      },
      tempUserDetail (id) {
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
      initTable () {
        this.$refs.regTable.refresh()
      },
      regTable (ctx) {
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
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
