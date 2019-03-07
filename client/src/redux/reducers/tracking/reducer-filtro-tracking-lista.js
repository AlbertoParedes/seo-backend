export default function (state={}, action){
  switch (action.type) {
    case "FILTROS_TRACKING_LISTA" :
      return action.filtros_tracking_lista;
    default :
      return state;
  }
}
