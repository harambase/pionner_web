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
      <b-col md="1" class="my-1">
        <legend class="col-form-legend">合同类型：</legend>
      </b-col>
      <b-col md="3" class="my-1">
        <b-form-group>
          <b-form-select :options="typeOptions" v-model="type"/>
        </b-form-group>
      </b-col>
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

      <template slot="status" slot-scope="row">
        <p v-if="row.value === 1" style="color:blue;">未开始</p>
        <p v-if="row.value === 0" style="color:green;">正常</p>
        <p v-if="row.value === -1" style="color:red;">已结束</p>
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
                <h5 class="mb-1"><strong>{{row.item.oname}}的{{row.item.type}}</strong> 信息</h5>
                <small class="text-muted">合同编号：{{row.item.contractId}}</small>
              </div>
              <hr/>
              <b-row v-if="showDetail">
                <b-col md="12" class="my-1">
                  <div class="mr-1">
                    <dl class="row">
                      <dt class="col-sm-1">所属人:</dt>
                      <dd class="col-sm-2">{{row.item.oname}}</dd>

                      <dt class="col-sm-1">合同期限:</dt>
                      <dd class="col-sm-2">{{row.item.initDate}} 至 {{row.item.expireDate}}</dd>
                    </dl>
                    <dl class="row">
                      <dt class="col-sm-1">录入人:</dt>
                      <dd class="col-sm-2">{{row.item.opname}}</dd>

                      <dt class="col-sm-1">录入时间:</dt>
                      <dd class="col-sm-2">{{row.item.createTime}}</dd>
                    </dl>
                    <dl class="row">
                      <dt class="col-sm-2">合同电子档案:</dt>
                      <dd class="col-sm-5"
                          v-if="isNotEmpty(row.item.contractInfo)">
                        <a href="#"
                           @click="documentDownload(row.item.id)">{{JSON.parse(row.item.contractInfo).name}}</a>
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
                                  @click.stop="showDeleteContract(row.item.id)">
                          删除该合同
                        </b-button>
                        <b-button size="sm" variant="primary" v-on:click="contractDetail(row.item.id)">
                          修改该合同
                        </b-button>
                      </dd>
                    </dl>
                  </div>
                </b-col>
              </b-row>
              <CContractForm v-else :id="row.item.id"/>
              <b-button style="width:200px;" class="btn btn-info" v-if="!showDetail" @click="showDetail = true">
                取消修改
              </b-button>
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
  import CContractForm from "../parts/ContractForm";

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'contractId', label: '合同编号', sortable: true},
    {key: 'oname', label: '所属人名', sortable: true},
    {key: 'ownerId', label: '所属人ID', sortable: true},
    {key: 'type', label: '合同类型', sortable: true},
    {key: 'status', label: '合同状态', sortable: true},
    {key: 'opname', label: '录入人', sortable: true},
    {key: 'createTime', label: '录入时间', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'c-contractTable',
    components: {CContractForm},
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
        typeOptions: ['劳动合同', '入学协议', '志愿者服务协议'],
        sortBy: 'owner_id',
        sortDesc: false,
        filter: null,
        items: items,
        status: '',
        basePath: basePath,
        deleteContractId: '',
        showDetail: true,
        type: '劳动合同',
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
    watch: {
      type: function () {
        this.initTable();
      }
    },
    methods: {
      documentDownload(id) {
        window.open(basePath + '/contract/info/' + id + '?token=' + window.localStorage.getItem('access_token'))
      },

      showDeleteContract(id) {
        this.showDeleteModal = true
        this.deleteContractId = id
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

      contractDetail() {
        this.showDetail = false
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
        let url = '/contract?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&type=' + this.type + '&orderCol='
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
