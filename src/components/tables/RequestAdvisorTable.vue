<template>
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
      <b-col md="3" class="my-1">
        <b-form-group>
          <b-input-group>
            <b-input-group-button>
              <b-button disabled><i class="fa fa-search"></i></b-button>
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
             ref="tempAdviseTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="tempAdviseTable"
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
      <template slot="studentId" slot-scope="row">
        <b-row>
          <b-col md="3">
            <img v-if="isNotEmpty(row.item.profile)"
                 :src="basePath + '/pioneer' + JSON.parse(row.item.profile).path"
                 style="width: 45px;height: 45px"
                 class="img-avatar">
            <img v-else
                 :src="basePath + '/pioneer/image/profile/logo.png'"
                 style="width: 45px;height: 45px"
                 class="img-avatar">
          </b-col>
          <b-col md="9">
            {{row.value}}
          </b-col>
        </b-row>
      </template>
      <template slot="actions" slot-scope="row">
        <div v-if="mode !== 'choose'">
          <b-button size="sm" class="btn btn-danger" @click.stop="showDeleteOne(row.item)">
            删除该申请
          </b-button>
          <b-button size="sm" class="btn btn-primary" @click.stop="row.toggleDetails">
            查看申请细节
          </b-button>
        </div>
        <div v-else>
          <b-button size="sm" class="btn btn-danger" @click.stop="choose(row.item)">
            选择该导师
          </b-button>
        </div>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-list-group>
            <b-list-group-item class="flex-column align-items-start">
              <CAdviseTable ref="CAdviseTable" showAdvisor="0" :fromAdvisor="row.item"/>
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
        <h3>确认取消{{advisor.name}}的导师资格？</h3>
      </div>
    </b-modal>

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
  </b-container>
</template>

<script>
  import axios from 'axios'
  import CAdviseTable from './AdviseTable'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'facultyIds', label: '导师IDs', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'c-requestAdviseTable',
    components: {CAdviseTable},
    props: ['mode'],
    data () {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'student_id',
        sortDesc: false,
        filter: null,
        items: items,
        info: '',
        showDeleteModal: false,
        showModal: false,
        advisor: '',
        msg: '',
        headerBgVariant: '',
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
    methods: {
      choose (val) {
        this.$emit('pass', val)
      },
      initTable () {
        this.$refs.tempAdviseTable.refresh()
      },
      tempAdviseTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/request/advise?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'studentId':
            url += 'student_id'
            break
          case 'facultyIds':
            url += 'faculty_ids'
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
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      showDeleteOne (advisor) {
        this.advisor = advisor
        this.showDeleteModal = true
      },
      deleteOne () {
        axios.delete('/advise/advisor/' + this.advisor.userId).then((response) => {
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
      resendPin (advisor) {
        this.advisor = advisor
        console.log(advisor)
        this.showSendModal = true
      },
      resendOne () {
        axios.post('/advisor/send', this.advisor).then((response) => {
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
      updateOne (advisor) {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          axios.put('/advisor/' + advisor.advisor, advisor).then((response) => {
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
