export default function (state=null, action){
  switch (action.type) {
    case "EMPLEADOS" :
      return action.empleados;
    default :
      return state;
  }
}
