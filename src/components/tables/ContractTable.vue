<template>

  <b-container fluid>

    <!-- contract Interface controls -->
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
             ref="contractTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="contractTable"
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
      <template slot="contractId" slot-scope="row">
        <b-row>
          <b-col md="3">
            <img v-if="isNotEmpty(row.item.profile)"
                 :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                 style="width: 30px;height: 30px"
                 class="img-avatar">
            <img v-else
                 src="/static/img/logo.png"
                 style="width: 40px;height: 40px"
                 class="img-avatar">
          </b-col>
          <b-col md="9" class="mt-1" style="font-size: 11px;">
            {{row.value}}
          </b-col>
        </b-row>
      </template>
      <template slot="actions" slot-scope="row">
        <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
          {{ row.detailsShowing ? '隐藏' : '展示' }}详情
        </b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-list-group>
            <b-list-group-item class="flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">服务合同 <strong>{{row.item.oname}}, {{row.item.contractId}}</strong> 的信息</h5>
                <small class="text-muted">用户ID：{{row.item.onwerId}}</small>
              </div>
              <hr/>
              <b-row>
                <b-col md="12" class="my-1">
                  <div class="mr-1">
                    <!--<dl class="row">-->
                      <!--<dt class="col-sm-1">QQ:</dt>-->
                      <!--<dd class="col-sm-2">{{row.item.qq}}</dd>-->

                      <!--<dt class="col-sm-1">电话:</dt>-->
                      <!--<dd class="col-sm-2">{{row.item.tel}}</dd>-->

                      <!--<dt class="col-sm-1">微信:</dt>-->
                      <!--<dd class="col-sm-2">{{row.item.weChat}}</dd>-->
                    <!--</dl>-->
                    <!--<dl class="row">-->
                      <!--<dt class="col-sm-1">性别:</dt>-->
                      <!--<dd class="col-sm-2">{{row.item.gender}}</dd>-->

                      <!--<dt class="col-sm-1">宿舍:</dt>-->
                      <!--<dd class="col-sm-2">{{row.item.dorm}}</dd>-->
                    <!--</dl>-->
                    <dl class="row">
                      <dt class="col-sm-2">电子文本:</dt>
                      <dd class="col-sm-5"
                          v-if="isNotEmpty(row.item.contractInfo)">
                        <a href="#"
                           @click="documentDownload(row.item.contractId)">{{JSON.parse(row.item.contractInfo).name}}</a>
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
                        <b-button size="sm" variant="danger"
                                  @click.stop="showDeleteContract(row.item.contractId)">
                          删除该合同
                        </b-button>
                        <b-button size="sm" variant="primary" @click="contractDetail(row.item.contractId)">
                          修改该合同
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
        <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至
          {{((currentPage-1) * perPage + perPage) <=
          totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
      </b-col>
    </b-row>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteContract"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该合同？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="initTable"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </b-container>

</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'contractId', label: '合同编号', sortable: true},
    {key: 'ownerId', label: '所属人ID', sortable: true},
    {key: 'oname', label: '所属人名', sortable: true},
    {key: 'initDate', label: '生效时间', sortable: true},
    {key: 'expireDate', label: '到期时间', sortable: true},
    {key: 'status', label: '合同状态', sortable: true},
    {key: 'opname', label: '录入人', sortable: true},
    {key: 'createTime', label: '录入时间', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'c-contractTable',
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
        sortBy: 'owner_id',
        sortDesc: false,
        filter: null,
        items: items,
        status: '',
        basePath: basePath,
        deleteContractId: ''
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
      documentDownload(contractId) {
        window.open(basePath + '/contract/info/' + contractId + '?token=' + window.localStorage.getItem('access_token'))
      },

      showDeleteContract(contractId) {
        this.showDeleteModal = true
        this.deleteContractId = contractId
      },

      deleteContract() {
        axios.delete('/contract/' + this.deleteContractId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功!';
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.initTable()
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },

      contractDetail(contractId) {
        this.$router.push({path: '/logistic/contract/detail?mode=view&contractId=' + contractId})
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.contractTable.refresh()
      },
      contractTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/contract?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'contractId':
            url += 'contract_id'
            break
          case 'ownerId':
            url += 'owner_id'
            break
          case 'firstName':
            url += 'first_name'
            break
          case 'createTime':
            url += 'create_time'
            break
          case 'initDate':
            url += 'init_date'
            break
          case 'expireDate':
            url += 'expire_date'
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
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
