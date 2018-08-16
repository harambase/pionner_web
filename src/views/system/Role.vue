<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>角色与权限对应列表</strong>
          </div>
          <b-container fluid>
            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     ref="roleTable"
                     :striped=true
                     :hover=true
                     :items="roleTable"
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
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'roleId', label: '权限ID', sortable: true},
    {key: 'roleName', label: '角色名', sortable: true},
    {key: 'roleCode', label: '权限代码', sortable: true},
  ]

  export default {
    name: 'Role',
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'role_id',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
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
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.roleTable.refresh()
      },
      roleTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/role?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'roleId':
            url += 'role_id'
            break
          case 'roleName':
            url += 'role_name'
            break
          case 'roleCode':
            url += 'role_code'
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
