import router from '../../router'

const apiUrl = 'http://localhost:3000/api/'

const state = {
  user: {
    username: null,
    email: null,
    admin: false,
    active: false
  },
  token: null,
  loggedIn: false,
  pending: false,
  error: null
}

const mutations = {
  setUser (state, user) {
    if (user) {
      state.user.username = user.username
      state.user.email = user.email
      state.user.admin = user.admin
      state.user.active = user.active
    } else {
      state.user.username = null
      state.user.email = null
      state.user.admin = false
      state.user.active = false
    }
  },
  setToken (state, token) {
    state.token = token
  },
  setActive (state, isActive) {
    state.user.active = isActive
  },
  setLoggedIn (state, isLoggedIn) {
    state.loggedIn = isLoggedIn
  },
  setAuthPending (state, isPending) {
    state.pending = isPending
  },
  setAuthError (state, error) {
    state.error = error
  }
}

const actions = {
  authenticate ({commit}, {credentials, redirectTo}) {
    const vm = this._vm
    commit('setAuthPending', true)
    fetch(apiUrl + 'authenticate', {
      method: 'POST',
      mode: 'cors',
      body: new Blob([JSON.stringify(credentials, null, 2)], {type: 'application/json'})
    })
      .then(response => response.json())
      .then(data => {
        commit('setAuthPending', false)
        if (data.success) {
          commit('setUser', data.user)
          commit('setToken', data.token)
          commit('setLoggedIn', true)
          vm.$notify({
            group: 'system',
            title: 'Login berhasil',
            text: 'Halo, anda berhasil login.',
            type: 'success'
          })
          if (redirectTo) router.push(redirectTo)
          else router.push('/')
        } else commit('setAuthError', data.message)
      })
      .catch(error => {
        commit('setAuthPending', false)
        commit('setAuthError', error.message)
      })
  },
  register ({commit}, data) {
    const vm = this._vm
    commit('setAuthPending', true)
    fetch(apiUrl + 'register', {
      method: 'POST',
      mode: 'cors',
      body: new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    })
      .then(response => response.json())
      .then(data => {
        commit('setAuthPending', false)
        if (data.success) {
          commit('setUser', data.user)
          commit('setToken', data.token)
          commit('setLoggedIn', true)
          vm.$notify({
            group: 'system',
            title: 'Registrasi berhasil.',
            text: data.message,
            type: 'success'
          })
          router.push('/activate-account')
        } else {
          commit('setAuthError', data.message)
        }
      })
      .catch(error => {
        commit('setAuthPending', false)
        commit('setAuthError', error.message)
      })
  },
  signOut ({commit}) {
    const vm = this._vm
    commit('setUser', false)
    commit('setToken', null)
    commit('setLoggedIn', false)
    vm.$notify({
      group: 'system',
      title: 'Keluar berhasil',
      text: 'Anda berhasil keluar.',
      type: 'success'
    })
    router.push('/sign-in')
  },
  clearError ({commit}) {
    commit('setAuthError', null)
  }
}

export default {
  state,
  mutations,
  actions
}