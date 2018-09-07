<template>
  <div class="animated fadeIn">
    <b-row>
      <b-card
        header-tag="header"
        footer-tag="footer">
        <div slot="header">
          <i className="fa fa-align-justify"></i><strong>通讯录</strong>
        </div>
        <b-container fluid>

          <!-- User Interface controls -->
          <b-row>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">每页显示：</legend>
            </b-col>
            <b-col md="1" class="my-1">
              <b-form-group>
                <b-form-select :options="pageOptions" v-model="perPage"/>
              </b-form-group>
            </b-col>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">用户类型：</legend>
            </b-col>
            <b-col md="2" class="my-1">
              <b-form-group>
                <b-form-select :options="typeOptions" v-model="type"/>
              </b-form-group>
            </b-col>
            <b-col md="3" class="my-1">
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
            <template slot="index" slot-scope="row">
              <b-row>
                <b-col md="9" class="mt-1" style="font-size: 11px;">
                  {{(currentPage-1) * perPage + 1 + row.index}}
                </b-col>
                <b-col md="3">
                  <img v-if="isNotEmpty(row.item.profile)"
                       :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                       style="width: 30px;height: 30px"
                       class="img-avatar">
                  <img v-else
                       :src="basePath + '/static/img/logo.png'"
                       style="width: 40px;height: 40px"
                       class="img-avatar">
                </b-col>
              </b-row>
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
        </b-container>
      </b-card>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'lastName', label: '姓', sortable: true},
    {key: 'firstName', label: '名', sortable: true},
    {key: 'qq', label: 'qq', sortable: true},
    {key: 'dorm', label: '宿舍号', sortable: true},
    {key: 'tel', label: '电话号码', sortable: true},
  ];

  export default {
    name: 'User',
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        typeOptions: [
          {text: '教师', value: 'f'},
          {text: '学生', value: 's'},
          {text: '系统管理', value: 'a'},
          {text: '全部', value: ''}
        ],
        type: '',
        sortBy: 'last_name',
        sortDesc: false,
        filter: null,
        items: items,
        basePath: basePath,
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
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.userTable.refresh()
      },
      userTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/user?' +
          'type=' + this.type + '&status=1&role=0&start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'lastName':
            url += 'last_name'
            break
          case 'firstName':
            url += 'first_name'
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
