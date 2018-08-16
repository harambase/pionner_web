<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-navbar-nav class="d-md-down-none">
      <strong>教育管理系统 EAS</strong>
      <small class="mt-1">&nbsp; Educational Administration System</small>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="d-md-down-none">
      </b-nav-item>
      <b-nav-item class="d-md-down-none">
      </b-nav-item>
      <b-nav-item class="d-md-down-none" @click="asideToggle">
        <i class="icon-envelope"></i>
        <b-badge pill variant="danger">*</b-badge>
      </b-nav-item>
      <HeaderDropdown/>
    </b-navbar-nav>
  </header>
</template>
<script>

  import HeaderDropdown from './HeaderDropdown.vue'
  import axios from 'axios'

  export default {
    name: 'c-header',
    components: {
      HeaderDropdown
    },
    data() {
      return {
        unread: 0,
      }
    },
    mounted() {
      axios.get('/message/count?status=unread&box=inbox').then((response) => {
        this.unread = response.data.data
      })
    },
    methods: {
      sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden')
      },
      sidebarMinimize(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-minimized')
      },
      mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show')
      },
      asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden')
      }
    }
  }
</script>
