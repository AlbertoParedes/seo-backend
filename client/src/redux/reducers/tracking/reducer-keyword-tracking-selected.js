export default function (state=null, action){
  switch (action.type) {
    case "KEYWORD_TRACKING_SELECTED" :
      return action.keyword_tracking_selected;
    default :
      return state;
  }
}
