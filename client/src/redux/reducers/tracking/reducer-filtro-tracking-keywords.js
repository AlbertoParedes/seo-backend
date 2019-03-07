export default function (state={}, action){
  switch (action.type) {
    case "FILTROS_TRACKING_KEYWORDS" :
      return action.filtros_tracking_keywords;
    default :
      return state;
  }
}
