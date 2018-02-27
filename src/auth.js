import decode from 'jwt-decode'
import auth0 from 'auth0-js'
import Router from 'vue-router'

const ACCESS_TOKEN_KEY = 'access_token'

// export function requireAuth(to, from, next) {
//   if (!isLoggedIn()) {
//     next({
//       path: '/',
//       query: { redirect: to.fullPath }
//     });
//   } else {
//     next();
//   }
// }

export default ({
  methods: {
    logout () {
      this.clearAccessToken()
    },
    getAccessToken () {
      return localStorage.getItem(ACCESS_TOKEN_KEY)
    },
    clearAccessToken () {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
    },
    setAccessToken (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    },
    isLoggedIn () {
      const accessToken = getAccessToken()
      return !this.isTokenExpired(accessToken)
    },

    getTokenExpirationDate (encodedToken) {
      const token = decode(encodedToken)
      if (!token.exp) { return null }

      const date = new Date(0)
      date.setUTCSeconds(token.exp)

      return date
    },

    isTokenExpired () {
      const expirationDate = this.getTokenExpirationDate(this.getAccessToken())
      return expirationDate < new Date()
    }
  }
})
