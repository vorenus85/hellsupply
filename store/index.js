import { names as userNames } from './user'

export const names = {
  SET_LOGIN_STATUS: 'setLoginStatus',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_USERS: 'setUsers'
}

export const state = () => ({
  loggedIn: false,
  users: null
})

export const mutations = {
  [names.SET_LOGIN_STATUS](state, value) {
    state.loggedIn = value
  },
  [names.SET_USERS](state, value) {
    state.users = value
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { $axios, redirect }) {
    const { data: result } = await $axios.get('/auth/autologin')
    let userData = {
      id: null,
      firstName: null,
      lastName: null,
      username: null,
      role: null
    }
    if (result && result.success) {
      userData = result.userData
      if (userData && userData.role === 'admin') {
        const { data: users } = await $axios.get('/users/all')
        commit(names.SET_USERS, users)
      }
    }
    const value = result ? !!userData.id : false
    commit(names.SET_LOGIN_STATUS, value)
    commit(`user/${userNames.SET_USER}`, userData)
    if (value) {
      redirect('/')
    } else {
      redirect('/login')
    }
  },
  async [names.LOGIN]({ dispatch, commit }, data) {
    const result = await dispatch(`user/${userNames.LOGIN}`, data)
    commit(names.SET_LOGIN_STATUS, result)
    return result
  },
  async [names.LOGOUT]({ dispatch, commit }) {
    const result = await dispatch(`user/${userNames.LOGOUT}`)
    commit(names.SET_LOGIN_STATUS, !result)
    return result
  }
}
