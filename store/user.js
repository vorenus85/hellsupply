export const names = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SET_USER: 'setUser'
}

export const state = () => ({
  id: null,
  name: null,
  email: null,
  role: null
})

export const mutations = {
  [names.SET_USER](state, { id, name, email, role }) {
    state.id = id
    state.name = name
    state.email = email
    state.role = role
  }
}

export const actions = {
  async [names.LOGIN]({ commit }, data) {
    const { data: result } = await this.$axios.post('/auth/login', data)
    let userData = {
      id: null,
      name: null,
      email: null,
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
        name: null,
        email: null,
        role: null
      })
      return true
    }
    return false
  }
}
