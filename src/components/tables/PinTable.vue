<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="1" class="my-1">
        <legend class="col-form-legend">检索条件：</legend>
      </b-col>
      <b-col md="3" class="my-1">
        <CInfoSelect v-on:pass="passInfo"/>
      </b-col>
      <b-col md="3" class="my-1">
        <CUserSelect v-on:pass="passUser"/>
      </b-col>
      <b-col md="3" class="my-1">
      </b-col>
    </b-row>

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
             ref="pinTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="pinTable"
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
      <template slot="effective" slot-scope="row">
        <p class="text-muted">从{{row.item.startTime}} <br> 至{{row.item.endTime}}</p>
      </template>

      <template slot="role" slot-scope="row">
        <p class="text-muted" v-if="row.item.role == 2">教务</p>
        <p class="text-muted" v-if="row.item.role == 3">选导师</p>
        <p class="text-muted" v-if="row.item.role == 1">选课</p>
      </template>

      <template slot="oname" slot-scope="row">
        <b-row>
          <b-col md="3">
            <img v-if="isNotEmpty(row.item.profile)"
                 :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                 style="width: 30px;height: 30px"
                 class="img-avatar">
            <img v-else
                 src="/static/eas/img/logo.png"
                 style="width: 40px;height: 40px"
                 class="img-avatar">
          </b-col>
          <b-col md="9" class="mt-1">
            {{row.value}}
          </b-col>
        </b-row>
      </template>

      <template slot="actions" slot-scope="row">
        <b-nav pills>
          <b-nav-item-dropdown text="操作">
            <b-dropdown-item @click.stop="showDeleteOne(row.item.pin)">
              <i style="color: red;"
                 class="fa fa-trash" title="删除该PIN">
              </i>删除该PIN
            </b-dropdown-item>
            <b-dropdown-item @click.stop="resendPin(row.item)">
              <i style="color: red;"
                 class="fa fa-envelope" title="删除该PIN">
              </i>重新发送PIN
            </b-dropdown-item>
            <b-dropdown-item @click.stop="row.toggleDetails">
              <i style="color: red;"
                 class="fa fa-pencil" title="删除该PIN">
              </i>修改时效
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
      </template>

      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-list-group>
            <b-list-group-item title="编辑识别码" class="flex-column align-items-start">
              <div class="d-flex w-100 ustify-content-between">
                <h5 class="mb-1"> PIN {{row.item.pin}} ：<strong>{{row.item.oname}}</strong> 的{{pin.role === 1? '选课':
                  '成绩录入'}}识别码的时效信息</h5>
              </div>
              <hr/>
              <b-row>
                <b-col md="9" class="my-1">
                  <div class="mr-1">
                    <dl class="row">
                      <b-col md="2" class="mt-1">
                        <label for="updateStartTime" class="col-sm-12 control-label">*生效时间:</label>
                      </b-col>
                      <b-col md="3" class="mt-1">
                        <input v-model="row.item.startTime" name="生效时间" id="updateStartTime"
                               v-validate="'required|date_format:YYYY-MM-DD HH:mm:ss'"
                               :class="{'form-control': true, 'is-invalid': errors.has('生效时间')}">
                        <div v-show="errors.has('生效时间')" class="invalid-tooltip">{{
                          errors.first('生效时间') }}
                        </div>
                      </b-col>
                      <b-col md="2" class="mt-1">
                        <label for="updateEndTime" class="col-sm-12 control-label">*失效时间:</label>
                      </b-col>
                      <b-col md="3" class="mt-1">
                        <input v-model="row.item.endTime" name="失效时间" id="updateEndTime"
                               v-validate="'required|date_format:YYYY-MM-DD HH:mm:ss'"
                               :class="{'form-control': true, 'is-invalid': errors.has('失效时间')}">
                        <div v-show="errors.has('失效时间')" class="invalid-tooltip">{{
                          errors.first('失效时间') }}
                        </div>
                      </b-col>
                    </dl>
                    <hr/>
                    <dl class="row">
                      <dt class="col-sm-1">操作:</dt>
                      <dd class="col-sm-5">
                        <b-button size="sm" variant="danger"
                                  @click.stop="updateOne(row.item, row)">
                          修改时效
                        </b-button>
                        <b-button size="sm" variant="primary" @click.stop="row.toggleDetails">
                          取消修改
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
    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                      class="my-0"/>
      </b-col>
      <b-col md="6" class="my-1">
        <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至 {{((currentPage-1) *
          perPage + perPage) <=
          totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
      </b-col>
    </b-row>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteOne"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该识别码？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showSendModal"
             size="sm"
             header-bg-variant='primary'
             @ok="resendOne"
             ok-title="发送"
             cancel-title="取消"
             centered
             title="确认信息">
      <div class="d-block text-center">
        <h4>请确认识别码信息：</h4>
        <p class="text-muted">
          识别码：{{pin.pin}} <br>
          类型：{{pin.role === 1? '选课': '成绩录入'}} <br>
          有效期：从{{pin.startTime}} 至 {{pin.endTime}}<br>
          所有人：{{pin.owner}}</p>
        <h4>确认后请按发送键。</h4>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
  import axios from 'axios'
  import CInfoSelect from '../../components/selects/InfoSelect'
  import CUserSelect from "../selects/UserSelect";

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'pin', label: '识别码', sortable: true},
    {key: 'oname', label: '所有人', sortable: true, 'class': 'text-center'},
    {key: 'role', label: '类型', sortable: true, 'class': 'text-center'},
    {key: 'effective', label: '有效时间'},
    {key: 'remark', label: '备注', sortable: true},
    {key: 'actions', label: ''}
  ];

  export default {
    name: 'c-pinTable',
    components: {CUserSelect, CInfoSelect},
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'pin',
        sortDesc: false,
        filter: null,
        items: items,
        info: '',
        showDeleteModal: false,
        showSendModal: false,
        showModal: false,
        pin: '',
        msg: '',
        headerBgVariant: '',
        basePath: basePath,
        user: '',
      }
    },
    watch: {
      info: function () {
        this.initTable()
      },
      user: function () {
        this.initTable()
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
      passInfo(val) {
        this.info = val
      },
      passUser(val) {
        this.user = val
      },
      initTable() {
        this.$refs.pinTable.refresh()
      },
      pinTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/pin?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
        if (this.isNotEmpty(this.user))
          url += '&ownerId=' + this.user.value
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
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      showDeleteOne(pin) {
        this.pin = pin
        this.showDeleteModal = true
      },
      deleteOne() {
        axios.delete('/pin/' + this.pin).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功！'
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
      resendPin(pin) {
        this.pin = pin
        console.log(pin)
        this.showSendModal = true
      },
      resendOne() {
        axios.post('/pin/send', this.pin).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '发送成功！'
            this.showModal = true
            this.headerBgVariant = 'success'
          } else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      updateOne(pin) {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          axios.put('/pin/' + pin.pin, pin).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '修改成功！'
              this.showModal = true
              this.headerBgVariant = 'success'

            } else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      }
    }
  }
</script>
