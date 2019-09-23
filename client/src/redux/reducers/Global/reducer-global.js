import dotProp from 'dot-prop-immutable';
var global = {

  popupInfo: {
    visibility: false,
    text: '',
    status: false,
    moment: Date.now()
  },

  notificaciones: [],

  timeCliente: {

  }

}


export default function (state = global, action) {
  switch (action.type) {

    case "CHANGE_POPUP":
      return dotProp.set(state, `popupInfo`, action.popup);

    case "CHANGE_NOTIFICACIONES":
      return dotProp.set(state, `notificaciones`, action.notificaciones);

    case "TIME_LINKBUILDING":
      return dotProp.set(state, `timeCliente`, action.obj);

    default:
      return state;
  }
}
