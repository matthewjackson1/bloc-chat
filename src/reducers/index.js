const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'DELETE_ROOM':
      console.log("DELETE_ROOM TRIGGERED")
      return Object.assign({}, state, {
        test: state.test + 1
      })
    default:
      return state
  }
}
