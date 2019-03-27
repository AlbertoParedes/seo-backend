export default function (state={showing:0, size: 0}, action){
  switch (action.type) {
    case "ITEMS_CLIENTES_LISTA" :
      return action.items_clientes_lista;
    default :
      return state;
  }
}
