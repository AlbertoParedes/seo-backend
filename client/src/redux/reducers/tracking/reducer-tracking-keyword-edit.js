export default function (state={activo:false, seleccionados:{}}, action){
  switch (action.type) {
    case "TRACKING_KEYWORDS_EDIT" :
      return action.tracking_keywords_edit;
    default :
      return state;
  }
}
