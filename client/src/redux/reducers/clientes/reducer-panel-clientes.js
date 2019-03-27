export default function (state=null, action){
  switch (action.type) {
    case "PANEL_CLIENTES" :
      return action.panel_clientes;
    default :
      return state;
  }
}
