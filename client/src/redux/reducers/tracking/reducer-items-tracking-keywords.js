export default function (state={showing:0, size: 0}, action){
  switch (action.type) {
    case "ITEMS_TRACKING_KEYWORDS" :
      return action.items_tracking_keywords;
    default :
      return state;
  }
}
