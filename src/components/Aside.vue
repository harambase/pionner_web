<template>
  <aside class="aside-menu">
    <b-tabs>
      <b-tab title="<i class='icon-speech'></i>">
        <div class="p-3">
          <div v-for="item in items" :key="item.id">
            <div class="message" style="cursor:pointer;" @click="goTo(item.id)">
              <div class="py-3 mr-3 float-left">
                <div class="avatar">
                  <img v-if="isNotEmpty(item.pic)"
                       :src="basePath + '/static' + JSON.parse(item.pic).path"
                       style="width: 40px;height: 40px"
                       class="img-avatar">
                  <img v-else
                       src="/static/img/logo.png"
                       style="width: 40px;height: 40px"
                       class="img-avatar">
                  <b-badge v-if="item.labels==='重要'" variant="danger" class="avatar-status"></b-badge>
                  <b-badge v-else variant="success" class="avatar-status"></b-badge>
                </div>
              </div>
              <div>
                <small class="text-muted">{{item.sender}}</small>
                <small class="text-muted float-right mt-1">{{item.date}}</small>
              </div>
              <div class="text-truncate font-weight-bold">{{item.title}}</div>
              <small class="text-muted">{{item.body.substring(0, 10)}}...
              </small>
            </div>
            <hr>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </aside>
</template>

<script>
  import axios from 'axios'

  const items = [];
  export default {
    name: 'c-aside',
    data() {
      return {
        items: [],
        basePath: basePath
      }
    },
    mounted() {
      let url = '/message/list?start=1&length=5&orderCol=date&box=inbox&order=desc';
      axios.get(url).then((response) => {
        this.items = response.data.data;
      })
    },
    methods: {
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      goTo(id) {
        this.$router.push({path: "/message?id=" + id});
      }
    }
  }
</script>
