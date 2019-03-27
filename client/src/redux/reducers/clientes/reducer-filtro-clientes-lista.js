export default function (state={}, action){
  switch (action.type) {
    case "FILTROS_CLIENTES_LISTA" :
      return action.filtros_clientes_lista;
    default :
      return state;
  }
}
