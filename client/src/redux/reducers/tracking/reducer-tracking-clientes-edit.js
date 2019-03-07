export default function (state={activo:false, seleccionados:{}}, action){
  switch (action.type) {
    case "TRACKING_CLIENTES_EDIT" :
      return action.tracking_clientes_edit;
    default :
      return state;
  }
}
