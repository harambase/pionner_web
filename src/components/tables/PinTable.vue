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
      <template slot="status" slot-scope="row">
        <p v-if="row.value === 1" style="color:blue;">未开始</p>
        <p v-if="row.value === 0" style="color:green;">进行中</p>
        <p v-if="row.value === -1" style="color:red;">已结课</p>
      </template>
      <template slot="actions" slot-scope="row">

        <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
          {{ row.detailsShowing ? '隐藏' : '展示' }}详情
        </b-button>

      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-list-group>
            <b-list-group-item href="#" title="查看课程"
                               class="flex-column align-items-start"
                               :disabled="row.item.status !== '0'" @click="detail(row.item.id)">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">课程 <strong>{{row.item.name}}</strong> 的信息</h5>
                <small class="text-muted">授课老师ID：{{row.item.facultyId}}</small>
              </div>
              <hr/>
              <div class="mr-1">
                <dl class="row">
                  <dt class="col-sm-1">课程CRN:</dt>
                  <dd class="col-sm-1">{{row.item.crn}}</dd>

                  <dt class="col-sm-1">课程学期:</dt>
                  <dd class="col-sm-1">{{row.item.info}}</dd>

                  <dt class="col-sm-1">课程学分:</dt>
                  <dd class="col-sm-1">{{row.item.credits}}</dd>

                  <dt class="col-sm-1">课程等级:</dt>
                  <dd class="col-sm-1">{{row.item.level}}</dd>

                  <dt class="col-sm-1">课程班级:</dt>
                  <dd class="col-sm-1">{{row.item.section}}</dd>

                </dl>
                <dl class="row">

                  <dt class="col-sm-1">上课时间:</dt>
                  <dd class="col-sm-3">{{row.item.startTime}} to {{row.item.endTime}}， 每周 {{row.item.day}}</dd>

                  <dt class="col-sm-1">上课周期:</dt>
                  <dd class="col-sm-3">{{row.item.startDate}} to {{row.item.endDate}}</dd>

                  <dt class="col-sm-1">预选课程:</dt>
                  <dd class="col-sm-3">{{row.item.precrn}}</dd>

                </dl>
                <dl class="row">
                  <dt class="col-sm-1">课程大纲下载:</dt>
                  <dd class="col-sm-5"
                      v-if="row.item.courseInfo !== '' &&
                                    row.item.courseInfo !== undefined &&
                                    row.item.courseInfo !== null ">
                    <a href="#" @click="download(row.item.crn)">{{JSON.parse(row.item.courseInfo).name}}</a>
                  </dd>
                </dl>
                <dl class="row">
                  <dt class="col-sm-1">备注:</dt>
                  <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                </dl>

                <dl class="row" v-if="pageMode === 'manage'">
                  <dt class="col-sm-1">操作:</dt>
                  <dd class="col-sm-5">
                    <b-button size="sm"
                              class="btn btn-danger"
                              @click.stop="showDeleteCourse(row.item.crn)">
                      删除该课程
                    </b-button>

                    <b-button size="sm"
                              class="btn btn-primary"
                              @click.stop="showDetailCourse(row.item.crn)">
                      修改该课程
                    </b-button>

                    <b-button size="sm"
                              class="btn btn-primary"
                              @click.stop="showCourseStudent(row.item.crn)">
                      课程中的学生
                    </b-button>
                  </dd>
                </dl>


              </div>
              <!--<button class="btn btn-danger" style="width:150px;" @click="removeFromWorkSheet(index)">删除</button>-->
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </template>
    </b-table>
    <b-col md="6" class="my-1">
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                    class="my-0"/>
    </b-col>
  </b-container>
</template>

<script>
  const items = []
  const field = [
    {key: 'pin', label: '识别码', sortable: true},
    {key: 'owner', label: '所有人', sortable: true, 'class': 'text-center'},
    {key: 'role', label: '类型', sortable: true},
    {key: 'effective', label: '有效时间'},
    {key: 'remark', label: '备注', sortable: true},
    {key: 'createTime', label: '创建时间', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'c-pinTable',
    data() {
      return{
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
      }
    },
    computed:{
      sortOptions () {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    methods:{
      initTable () {
        this.$refs.pinTable.refresh()
      },
      pinTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/pin?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy + '&mode=student'
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
        if (this.isNotEmpty(this.faculty))
          url += '&facultyId=' + this.faculty.value
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
