<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="itemFilter"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
  import nav from '../_nav'
  import decode from 'jwt-decode'
  import {Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb} from '../components/'

  export default {
    name: 'full',
    components: {
      AppHeader,
      Sidebar,
      AppAside,
      AppFooter,
      Breadcrumb
    },
    data() {
      return {
        nav: nav.items
      }
    },
    computed: {
      itemFilter() {
        let navItems = [];
        const token = decode(window.localStorage.getItem('access_token'));

        nav.items.forEach(item => {
          for (let i = 0; i < token.rol.length; i++) {
            if (token.rol[i] == '1') {
              navItems.push(item);
              break
            } else {
              for (let j = 0; j < item.meta.role.length; j++) {
                if (item.meta.role[j] == token.rol[i]) {
                  navItems.push(item);
                  i = token.rol.length;
                  break
                }
              }
            }
          }

        });
        return navItems
      },
      name() {
        return this.$route.name
      },
      list() {
        return this.$route.matched
      }
    }
  }
</script>
