export default function (state=null, action){
  switch (action.type) {
    case "EMPLEADO" :
      return action.empleado;
    default :
      return state;
  }
}
