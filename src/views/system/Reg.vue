<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card  header-tag="header"
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
    <!--<div class="row">-->
      <!--<div class="col-md-12">-->
        <!--<div class="panel panel-default">-->
          <!--<div class="panel-body">-->
            <!--<div class="panel-group">-->
              <!--<div class="panel panel-info">-->
                <!--<div class="panel-heading">-->
                  <!--<h4 class="panel-title">-->
                    <!--分类查看-->
                  <!--</h4>-->
                <!--</div>-->
                <!--<div class="panel-body">-->
                  <!--<div class="form-group">-->
                    <!--<div class="col-sm-3">-->
                      <!--<button v-on:click="showGeneral" id="showGeneral" style="width: 100%"-->
                              <!--class="btn btn-primary btn-warning">-->
                        <!--查看所有申请-->
                      <!--</button>-->
                    <!--</div>-->
                    <!--<div class="col-sm-3">-->
                      <!--<button v-on:click="showActive" id="showActive" style="width: 100%"-->
                              <!--class="btn btn-primary">-->
                        <!--只查看申请中-->
                      <!--</button>-->
                    <!--</div>-->
                    <!--<div class="col-sm-3">-->
                      <!--<button v-on:click="showApproved" id="showApproved"-->
                              <!--style="width: 100%" class="btn btn-primary btn-success">-->
                        <!--只查看已批准-->
                      <!--</button>-->
                    <!--</div>-->
                    <!--<div class="col-sm-3">-->
                      <!--<button v-on:click="showDeclined" id="showDeclined"-->
                              <!--style="width: 100%" class="btn btn-primary btn-danger">-->
                        <!--只查看已拒绝-->
                      <!--</button>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</div>-->

              <!--</div>-->
            <!--</div>-->
          <!--</div>-->

        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
</template>
<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'userId', label: '临时用户ID'},
    {key: 'userJson', label: '姓, 名'},
    {key: 'createTime', label: '申请时间'},
    {key: 'status', label: '申请状态'},
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
//      showGeneral: function () {
//        status = ''
//        userRegTable.draw()
//      },
//      showActive: function () {
//        status = '0'
//        userRegTable.draw()
//      },
//      showDeclined: function () {
//        status = '-1'
//        userRegTable.draw()
//      },
//      showApproved: function () {
//        status = '1'
//        userRegTable.draw()
//      },
      initTable () {
        this.$refs.regTable.refresh()
      },
      regTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/request/user?start=' + ctx.currentPage + '&length='
          + ctx.perPage + '&orderCol=' + ctx.sortBy
          +'&viewStatus=' + this.viewStatus
//        switch (ctx.sortBy) {
//          case 'userId':
//            url += 'user_id'
//            break
//          case 'lastName':
//            url += 'last_name'
//            break
//          case 'firstName':
//            url += 'first_name'
//            break
//          case 'updateTime':
//            url += update_time
//            break
//          default:
//            url += ctx.sortBy
//            break
//        }

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
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
    }
  }
</script>
