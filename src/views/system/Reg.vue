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
                {{JSON.parse(row.value).lastName + "," + JSON.parse(row.value).firstName}}
              </template>
              <template slot="status" slot-scope="row">
                <p v-if="row.value === '0'" style="color:blue;">申请中</p>
                <p v-if="row.value === '1'" style="color:green;">已批准</p>
                <p v-if="row.value === '-1'" style="color:red;">已拒绝</p>
              </template>
              <template>

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
    {key: 'userId', label: '临时用户ID',sortable: true},
    {key: 'userJson', label: '姓, 名', sortable: true},
    {key: 'createTime', label: '申请时间', sortable: true},
    {key: 'status', label: '申请状态', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'Reg',
    data () {
      return {
        regTempUser: {
          id: '',
          userId: '',
          status: '',
          createTime: '',
          userJson: ''
        },
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'user_id',
        sortDesc: false,
        filter: null,
        items: items,
        viewStatus: '',
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
      approve: function () {
        let type = ''
        let roleId = '0/'
        for (let i = 0; i < this.regType.length; i++)
          if (this.regType[i] !== '')
            type += this.regType[i] + '/'
        for (let i = 0; i < this.regRole.length; i++)
          if (this.regRole[i] !== '')
            roleId += this.regRole[i] + '/'

        if (type.indexOf('s') !== -1)
          roleId += '5/'
        if (type.indexOf('f') !== -1)
          roleId += '6/7/'

        this.$set(this.regUser, 'type', type)
        this.$set(this.regUser, 'roleId', roleId)
        this.regTempUser.status = '1'
        this.regTempUser.userJson = JSON.stringify(this.regUser)
        update()
      },
      decline: function () {
        if (isNotEmpty(this.regUser.comment)) {
          this.regTempUser.status = '-1'
          this.regTempUser.userJson = JSON.stringify(this.regUser)
          update()
        } else {
          Showbo.Msg.alert('必须填写备注！', function () {
          })
        }
      },
      showGeneral: function () {
        this.viewStatus = ''
        this.initTable();
      },
      showActive: function () {
        this.viewStatus = '0'
        this.initTable();
      },
      showDeclined: function () {
        this.viewStatus = '-1'
        this.initTable();
      },
      showApproved: function () {
        this.viewStatus = '1'
        this.initTable();
      },
      initTable () {
        this.$refs.regTable.refresh()
      },
      regTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/request/user?start=' + ctx.currentPage + '&length='
          + ctx.perPage + '&orderCol=' + ctx.sortBy
          + '&viewStatus=' + this.viewStatus
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
    }
  }
</script>
