<template>
  <div>
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
             ref="messageTable"
             :fixed=true
             :hover=true
             :items="messageTable"
             :fields="field"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :isBusy="false"
             @filtered="onFiltered"
    >
      <template slot="actions" slot-scope="row">
        <b-list-group>
          <b-list-group-item href="#" class="flex-column align-items-start"
                             @click.stop="row.toggleDetails">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">
                <i class="el-icon-warning" v-if="row.item.labels=='重要'" style="color:blue"></i>
                <i class="el-icon-warning" v-if="row.item.labels=='紧急'" style="color:red"></i>
                <strong>{{row.item.title}}</strong> {{row.item.subject}}
              </h5>
              <small>发送时间：{{row.item.date}}</small>
              <span v-if="row.item.status=='unread'" style="color:blue"><i class="el-icon-info"></i> 未读信息</span>
            </div>
            <hr/>
            <b-row>
              <b-col md="2" class="my-1">
                <img v-if="isNotEmpty(row.item.pic)"
                     :src="basePath + '/static' + JSON.parse(row.item.pic).path"
                     style="width: 40px;height: 40px"
                     class="img-avatar">
                <img v-else
                     src="/static/img/logo.png"
                     style="width: 40px;height: 40px"
                     class="img-avatar">
                {{row.item.sender}}
              </b-col>
              <b-col md="10">
                <p class="mb-1">
                  {{row.item.body}}
                </p>
                <small>{{row.item.attachment}}</small>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </template>

      <template slot="row-details" slot-scope="row">
        <CMessageDetail :row="row" :info="info"/>
      </template>

    </b-table>
    <b-col md="6" class="my-1">
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                    class="my-0"/>
    </b-col>

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
  </div>
</template>

<script>
  import axios from 'axios'
  import CMessageDetail from "../parts/MessageDetail";

  const items = [];
  const field = [
    {key: 'actions', label: '消息列表'}
  ];


  export default {
    name: 'c-messageTable',
    props: ['mode', 'info'],
    components: {CMessageDetail},
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'date',
        sortDesc: true,
        filter: null,
        items: items,
        info: '',
        showDeleteModal: false,
        showModal: false,
        advisor: '',
        msg: '',
        headerBgVariant: '',
        basePath: basePath,
        box: 'inbox',
      }
    },
    watch: {
      mode: function (val) {
        switch (val) {
          case 'first':
            this.box = 'inbox';
            break;
          case 'second':
            this.box = 'important';
            break;
          case 'third':
            this.box = 'urgent';
            break;
          case 'fourth':
            this.box = 'trash';
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
        this.totalRows = filteredItems.length;// Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.messageTable.refresh()
      },

      messageTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/message/list?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=';
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter;
        if (this.isNotEmpty(this.box))
          url += '&box=' + this.box;
        if (ctx.sortDesc)
          url += '&order=desc';
        else
          url += '&order=asc';

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
