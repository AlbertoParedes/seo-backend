export default function (state={activo:false, seleccionados:{}}, action){
  switch (action.type) {
    case "CLIENTES_LISTA_EDIT" :
      return action.clientes_lista_edit;
    default :
      return state;
  }
}
