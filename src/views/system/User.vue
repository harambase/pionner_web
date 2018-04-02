<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12" v-if="pageMode === 'table'">
        <b-col cols="12">
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>系统用户列表</strong>
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
                       ref="userTable"
                       :striped=true
                       :fixed=true
                       :hover=true
                       :items="userTable"
                       :fields="field"
                       :current-page="currentPage"
                       :per-page="perPage"
                       :filter="filter"
                       :sort-by.sync="sortBy"
                       :sort-desc.sync="sortDesc"
                       :isBusy="false"
                       @filtered="onFiltered"
              >
                <template slot="userId" slot-scope="row">
                  <b-row>
                    <b-col md="3">
                      <img v-if="isNotEmpty(row.item.profile)"
                           :src="basePath + '/pioneer' + JSON.parse(row.item.profile).path"
                           style="width: 45px;height: 45px"
                           class="img-avatar">
                    </b-col>
                    <b-col md="9">
                      {{row.value}}
                    </b-col>
                  </b-row>
                </template>

                <template slot="status" slot-scope="row">
                  <label class="switch switch-lg switch-text switch-success mb-0">
                    <input type="checkbox" class="switch-input" :checked="row.item.status==='1'"
                           @change="inverseStatus(row.item.userId, row.item.status)">
                    <span class="switch-label" data-on="启用" data-off="停用"></span>
                    <span class="switch-handle"></span>
                  </label>
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
                          <h5 class="mb-1">用户 <strong>{{row.item.lastName}}, {{row.item.firstName}}</strong> 的基本信息</h5>
                          <small class="text-muted">用户ID：{{row.item.userId}}</small>
                        </div>
                        <hr/>
                        <b-row>
                          <b-col md="9" class="my-1">
                            <div class="mr-1">
                              <dl class="row">
                                <dt class="col-sm-1">QQ:</dt>
                                <dd class="col-sm-2">{{row.item.qq}}</dd>

                                <dt class="col-sm-1">电话:</dt>
                                <dd class="col-sm-2">{{row.item.tel}}</dd>

                                <dt class="col-sm-1">微信号:</dt>
                                <dd class="col-sm-2">{{row.item.weChat}}</dd>

                                <dt class="col-sm-1">性别:</dt>
                                <dd class="col-sm-2">{{row.item.gender}}</dd>
                              </dl>
                              <dl class="row">
                                <dt class="col-sm-1">邮箱:</dt>
                                <dd class="col-sm-3">{{row.item.email}}</dd>

                                <dt class="col-sm-1">宿舍号:</dt>
                                <dd class="col-sm-1">{{row.item.dorm}}</dd>

                                <dt class="col-sm-1">住址:</dt>
                                <dd class="col-sm-3">{{row.item.address}}</dd>

                              </dl>
                              <dl class="row">
                                <dt class="col-sm-2">基本信息表:</dt>
                                <dd class="col-sm-5"
                                    v-if="row.item.baseInfo !== '' &&
                                    row.item.baseInfo !== undefined &&
                                    row.item.baseInfo !== null ">
                                  <a href="#"
                                     @click="documentDownload(row.item.userId)">{{JSON.parse(row.item.baseInfo).name}}</a>
                                </dd>
                              </dl>
                              <dl class="row">
                                <dt class="col-sm-1">备注:</dt>
                                <dd class="col-sm-5">{{row.item.comment}}</dd>
                              </dl>
                              <hr/>
                              <dl class="row">
                                <dt class="col-sm-1">操作:</dt>
                                <dd class="col-sm-5">
                                  <b-button size="sm"
                                            class="btn btn-danger"
                                            @click.stop="deleteUser(row.item.userId)">
                                    删除该用户
                                  </b-button>

                                  <b-button size="sm"
                                            class="btn btn-info"
                                            @click="userDetail(row.item.userId)">
                                    修改该用户
                                  </b-button>
                                </dd>
                              </dl>
                            </div>
                          </b-col>
                          <b-col md="3" class="my-1">
                            <img v-if="isNotEmpty(row.item.profile)"
                                 :src="basePath + '/pioneer' + JSON.parse(row.item.profile).path"
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
      </b-col>
    </b-row>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteUser"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该用户？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal" size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only centered title="消息">
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
    {key: 'userId', label: '用户ID', sortable: true, 'class': 'text-center'},
    {key: 'username', label: '用户名', sortable: true},
    {key: 'lastName', label: '姓', sortable: true},
    {key: 'firstName', label: '名', sortable: true},
    {key: 'type', label: '账户类型', sortable: true},
    {key: 'status', label: '启停状态', sortable: true},
    {key: 'updateTime', label: '更新时间', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'User',
    data () {
      return {
        profilePath: '',
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        goTo: '',
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
        status: '',
        basePath: basePath
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
    mounted: function () {
      laydate.render({
        elem: '#birthday',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.user.birthday = value
        }
      })
    },
    methods: {
      documentDownload () {
        window.open(basePath + '/user/info/' + this.userId + '?token=' + window.localStorage.getItem('access_token'))
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
      deleteUser () {
        axios.delete('/user/' + this.userId).then((response) => {
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
      inverseStatus (userId, status) {
        let newStatus = '1'
        if (status === '1')
          newStatus = '0'
        axios.get('/user/' + userId).then((response) =>{
          let user = response.data.data;
          user.status = newStatus;
          axios.put('/user/' + userId, user).then((response) => {
            if (response.data.code === 2001) {
              this.initTable()
              this.showModal = true
              this.msg = '状态修改成功'
              this.headerBgVariant = 'success'
            } else {
              this.showModal = true
              this.msg = '状态修改失败'
              this.headerBgVariant = 'danger'
            }
          })
        })

      },
      userDetail (userId) {
        this.$router.push({path: '/system/user/detail?mode=view&userId=' + userId})
      },
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.userTable.refresh()
      },
      userTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/user?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'userId':
            url += 'user_id'
            break
          case 'lastName':
            url += 'last_name'
            break
          case 'firstName':
            url += 'first_name'
            break
          case 'updateTime':
            url += 'update_time'
            break
          default:
            url += ctx.sortBy
            break
        }

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
    }
  }
</script>
