export default function (state={showing:0, size: 0}, action){
  switch (action.type) {
    case "ITEMS_CLIENTES" :
      return action.items_clientes;
    default :
      return state;
  }
}
