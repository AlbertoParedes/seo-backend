export default function (state=null, action){
  switch (action.type) {
    case "PANEL_HOME" :
      return action.panel_home;
    default :
      return state;
  }
}
