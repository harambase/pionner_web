<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-col cols="12">
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>辅导关系列表</strong>
            </div>
            <CAdviseTable/>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import decode from 'jwt-decode'
  import auth0 from 'auth0-js'
  import CAdviseTable from '../../components/tables/AdviseTable'

  const items = []
  const field = [
    {key: 'operations', label: '操作'},
    {key: 'crn', label: '编号', sortable: true},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'capacity', label: '容量', sortable: true},
    {key: 'remain', label: '剩余', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'date', label: '起止时间', sortable: true},
    {key: 'time', label: '上课时间', sortable: true},
    {key: 'day', label: '星期', sortable: true},
    {key: 'faculty', label: '授课老师', sortable: true},
    {key: 'actions', label: '查看详情'}
  ]

  export default {
    name: 'Advise',
    components: {CAdviseTable},
    data () {
      return {
        pinObject: '',
        pin: '',
        pinValidate: false,
        showValidate: true,
        tol_credits: 0,
        use_credits: 0,
        ava_credits: 0,
        counter: 0,
        crnList: [],
        failList: [],
        worksheet: '',
        msg: '',
        field: field,
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        showModal: false,
        headerBgVariant: ''
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
    mounted: function () {
      if (this.pinObject === null || this.pinObject === '') {
        return
      }
      this.showValidate = false
      this.pinValidate = true
      this.initStudentInfo()
      if (window.localStorage.getItem('chooseVue') !== undefined
        && window.localStorage.getItem('chooseVue') !== null
        && window.localStorage.getItem('chooseVue') !== '') {
        let data = JSON.parse(window.localStorage.getItem('chooseVue'))
        this.pin = data.pin
        this.tol_credits = data.tol_credits
        this.use_credits = data.use_credits
        this.ava_credits = data.ava_credits
        this.counter = data.counter
        this.crnList = data.crnList
        this.worksheet = data.worksheet
        window.localStorage.removeItem('chooseVue')
      }
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      courseTable: function (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
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
      validate () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          axios.get('/pin/' + this.pin).then((response) => {
            if (response.data.code === 2001) {
              this.pinObject = response.data.data
              this.initStudentInfo()
              this.pinValidate = true
              this.showValidate = false
            }
            else {
              this.msg = '识别码验证失败！  '
              this.headerBgVariant = 'danger'
              this.showModal = true
            }
          })
        })
      },
      initStudentInfo () {
        const decoded_token = decode(window.localStorage.getItem('access_token'))
        const studentId = decoded_token.sub
        const pin_info = this.pinObject.info
        axios.get('/student/' + studentId + '/available/credit?info=' + pin_info).then((response) => {
          if (response.data.code === 2001) {
            this.tol_credits = response.data.data.tol_credits
            this.use_credits = response.data.data.use_credits
            this.ava_credits = response.data.data.ava_credits
          } else {
            this.msg = response.data.msg
            this.headerBgVariant = 'danger'
            this.showModal = true
          }
        })
      },

      isAvaCreditsEnough (credits) {
        return (this.tol_credits - this.use_credits - credits) >= 0
      },

      isSelectAgain (crn) {
        for (let i = 0; i < this.crnList.length; i++) {
          if (crn === this.crnList[i].crn)
            return true
        }
        return false
      },
      addToWorkSheet (crn, credits, name, faculty) {
        if (!this.isAvaCreditsEnough(credits)) {
          this.msg = '学分不足!'
          this.headerBgVariant = 'danger'
          this.showModal = true
          return
        }
        if (this.isSelectAgain(crn)) {
          this.msg = '不可重复选!'
          this.headerBgVariant = 'danger'
          this.showModal = true
          return
        }
        this.counter++
        this.crnList.push({
          crn: crn,
          credits: credits,
          name: name,
          faculty: faculty
        })

        this.use_credits += parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
      },
      removeFromWorkSheet (index) {
        const credits = this.crnList[index].credits
        this.use_credits -= parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
        this.$delete(this.crnList, index)
      },
      toCourse (crn) {
        window.localStorage.setItem('chooseVue', JSON.stringify(this))
        window.location.href = '/course/choose/detail?pageMode=view&crn=' + crn
      },
      reset: function () {
        this.crnList = []
        this.initStudentInfo()
      },
      turnIn: function () {
        let choiceList = []
        if (this.crnList.length === 0) {
          this.msg = '没有选择任何课程!'
          this.showModal = true
          this.headerBgVariant = 'danger'
          return
        }
        for (let i = 0; i < this.crnList.length; i++) {
          choiceList.push(this.crnList[i].crn)
        }
        axios.post('/course/choose', {
          choiceList: choiceList
        }).then((response) => {
          this.failList = response.data.data.failList
          this.crnList = []
          this.showModal = true
          this.initStudentInfo()
          if (this.failList.length === 0) {
            this.msg = '全部注册成功!'
            this.headerBgVariant = 'success'
            this.initStudentInfo()
          } else {
            this.headerBgVariant = 'danger'
            this.msg = '有课程失败！'
            this.initStudentInfo()
          }
        })
      },
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
