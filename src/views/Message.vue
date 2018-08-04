<template>
  <div class="animated fadeIn">
    <b-row id="myCoursePage">
      <b-col cols="12">
        <b-card>
          <b-row>
            <b-col cols="2">
              <b-list-group>
                <b-list-group-item @click="inbox" href="#" class="d-flex justify-content-between align-items-center">
                  收件箱
                  <b-badge variant="primary" pill> {{unread}}</b-badge>
                </b-list-group-item>
                <b-list-group-item @click="important" href="#"
                                   class="d-flex justify-content-between align-items-center">
                  重要
                  <b-badge variant="primary" pill>{{ importantNum}}</b-badge>
                </b-list-group-item>
                <b-list-group-item @click="deleted" href="#" class="d-flex justify-content-between align-items-center">
                  已删除
                  <b-badge variant="primary" pill>{{trashed}}</b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-col>
            <b-col v-show="table" cols="10">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>您的信息列表</strong>
                </div>

                <b-container fluid>
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
                        <b-list-group-item href="#" class="flex-column align-items-start" @click="showMsg(row.item.id)">
                          <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1"><strong>{{row.item.title}}</strong> {{row.item.subject}}</h5>
                            <small>发送时间：{{row.item.date}}</small>
                            <b-badge variant="danger" pill v-if="row.item.labels=='重要'">重要</b-badge>
                            <b-badge variant="primary" pill v-if="row.item.status=='unread'">未读</b-badge>
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
                  </b-table>
                  <b-col md="6" class="my-1">
                    <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                                  class="my-0"/>
                  </b-col>
                </b-container>

              </b-card>
            </b-col>
            <b-col v-show="detail" cols="9">
              <b-card
                header-tag="header"
                footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>信息详情</strong>
                  <b-button class="btn btn-primary btn-info"
                            @click="back">
                    <i class="fa fa-arrow-left"></i> 返回列表
                  </b-button>
                </div>
                {{message}}
              </b-card>
            </b-col>
          </b-row>
        </b-card>

      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'actions', label: '消息列表'}
  ];

  export default {
    name: 'message',
    data () {
      return {
        unread: 0,
        importantNum: 0,
        saved: 0,
        trashed: 0,
        box: 'inbox',
        showWrite: false,
        detail: false,
        table: true,
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'date',
        sortDesc: true,
        filter: null,
        items: items,
        basePath: basePath,
        message: ''
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
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.initImportant()
        this.initUnread()
        this.initTrash()
      },
      initImportant () {
        axios.get('/message/count?status=unread&box=important').then((response) => {
          this.importantNum = response.data.data
        })
      },

      initUnread () {
        axios.get('/message/count?status=unread&box=inbox').then((response) => {
          this.unread = response.data.data
        })
      },
      initTrash () {
        axios.get('/message/count?status=trashed&box=trash').then((response) => {
          this.trashed = response.data.data
        })
      },
      showMsg (id) {
        axios.get('/message/' + id).then((response) => {
          this.message = response.data.data
          this.table = false
          this.detail = true
        })
      },
      inbox () {
        this.box = 'inbox'
        this.initTable()
      },
      important () {
        this.box = 'important';
        this.initTable()
      },
      deleted () {
        this.box = 'trash';
        this.initTable()
      },
      back () {
        this.detail = false;
        this.table = true
      },
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length;// Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.messageTable.refresh()
      },
      messageTable (ctx) {
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }

  // function markAsRead(id) {
  //   let status = "read";
  //   sendStatusUpdateAjax(id, status);
  // }
  //
  // function markAsUnread(id) {
  //   let status = "unread";
  //   sendStatusUpdateAjax(id, status);
  // }
  //
</script>
