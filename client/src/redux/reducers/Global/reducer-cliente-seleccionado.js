export default function (state=null, action){
  switch (action.type) {
    case "CLIENTE_SELECCIONADO" :
      return action.cliente_seleccionado;
    default :
      return state;
  }
}
