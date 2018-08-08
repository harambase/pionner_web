<template>
  <div class="animated fadeIn">
    <b-row>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="合同列表" name="first">

        </el-tab-pane>
        <el-tab-pane label="录入新合同" name="second">

        </el-tab-pane>


      </el-tabs>
    </b-row>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteUser"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该用户？</h3>
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
  </div>
</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'userId', label: '用户ID', sortable: true},
    {key: 'username', label: '用户名', sortable: true},
    {key: 'lastName', label: '姓', sortable: true},
    {key: 'firstName', label: '名', sortable: true},
    {key: 'type', label: '账户类型', sortable: true},
    {key: 'status', label: '启停状态', sortable: true},
    {key: 'updateTime', label: '最近更新时间', sortable: true},
    {key: 'lastLoginTime', label: '上次登录时间', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'User',
    data() {
      return {
        profilePath: '',
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        goTo: '',
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
        status: '',
        basePath: basePath,
        deleteUserId: ''
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
      documentDownload(userId) {
        window.open(basePath + '/user/info/' + userId + '?token=' + window.localStorage.getItem('access_token'))
      },
      previewImg() {
        let preview = document.getElementById('preview');
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file)
        } else {
          preview.src = ''
        }
        reader.onloadend = function () {
          preview.src = reader.result
        }
      },
      showDeleteTempUser(userId) {
        this.showDeleteModal = true
        this.deleteUserId = userId
      },
      createUser() {
        this.$router.push({path: '/system/user/detail?mode=create&userId='})
      },
      deleteUser() {
        axios.delete('/user/' + this.deleteUserId).then((response) => {
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
      inverseStatus(userId, status) {
        let newStatus = '1'
        if (status === '1')
          newStatus = '0'
        axios.get('/user/' + userId).then((response) => {
          let user = response.data.data
          user.status = newStatus
          axios.put('/user/' + userId, user).then((response) => {
            if (response.data.code === 2001) {
              this.initTable()
              this.showModal = true
              this.msg = '状态修改成功！'
              this.headerBgVariant = 'success'
            } else {
              this.showModal = true
              this.msg = '状态修改失败！'
              this.headerBgVariant = 'danger'
            }
          })
        })

      },
      userDetail(userId) {
        this.$router.push({path: '/system/user/detail?mode=view&userId=' + userId})
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.userTable.refresh()
      },
      userTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/user?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'userId':
            url += 'user_id'
            break
          case 'lastName':
            url += 'last_name'
            break
          case 'firstName':
            url += 'first_name'
            break
          case 'updateTime':
            url += 'update_time'
            break
          case 'lastLoginTime':
            url += 'last_login_time'
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
