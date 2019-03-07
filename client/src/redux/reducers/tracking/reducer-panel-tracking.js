export default function (state=null, action){
  switch (action.type) {
    case "PANEL_TRACKING" :
      return action.panel_tracking;
    default :
      return state;
  }
}
