export const names = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_USER: 'setUser'
}

export const state = () => ({
  id: null,
  firstName: null,
  lastName: null,
  username: null,
  role: null
})

export const mutations = {
  [names.SET_USER](state, { id, firstName, lastName, username, role }) {
    state.id = id
    state.firstName = firstName
    state.lastName = lastName
    state.username = username
    state.role = role
  }
}

export const actions = {
  async [names.LOGIN]({ commit }, data) {
    const { data: result } = await this.$axios.post('/auth/login', data)
    let userData = {
      id: null,
      firstName: null,
      lastName: null,
      username: null,
      role: null
    }
    if (result && result.success) {
      userData = result.userData
    }
    commit(names.SET_USER, userData)
    return !!userData.id
  },
  async [names.LOGOUT]({ commit }) {
    const { data: result } = await this.$axios.get('/auth/logout')
    if (result) {
      commit(names.SET_USER, {
        id: null,
        firstName: null,
        lastName: null,
        role: null
      })
      return true
    }
    return false
  }
}
