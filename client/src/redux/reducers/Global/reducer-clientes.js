export default function (state={}, action){
  switch (action.type) {
    case "CLIENTES" :
      return action.clientes;
    default :
      return state;
  }
}
