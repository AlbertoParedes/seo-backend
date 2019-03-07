import {createStore} from 'redux';

const reducer = (state, action) =>{
  if(action.type==='SET_FILTROS_ALUMNOS'){
    return {
      ...state,
      filtros_alumnos : action.filtros
    }
  }
  return state
}

export default createStore(reducer, { filtros_alumnos: {} })
