import dotProp from 'dot-prop-immutable';
import moment from 'moment'
var empleado = {

  tareasEmpleado:{},

  paneles: {
    tareas: {
      filtros: {
        
        status: {
          title: 'Estado',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {
            'no_completado': { text: 'No completadas', text_info: 'No completadas', checked: true },
            'en_proceso': { text: 'En proceso', text_info: 'En proceso', checked: true },
            'completado': { text: 'Completadas', text_info: 'Completadas', checked: false },
          }
        },
      },
      sortBy: 'fecha_limite',
      des: false,
      search: '',
      searchBy: 'cliente',
      items_loaded: 50,
      itemsTarea: {
        tareas: {
          tareasDisponibles: 0
        },
        tareasEliminadas: 0,
        tareasParadas: 0
      },
      lista_search_by: {
        'cliente': { valor: 'cliente' },
      },
    },

  },
  panel: 'tareas',

  tracking_keywords_edit: { activo: false, seleccionados: {} },
  keyword_tracking_selected: false,
  items_info: '0 de 0 tareas'
}


export default function (state = empleado, action) {
  switch (action.type) {

    case "PANEL_EMPLEADO":{
      return dotProp.set(state, `panel`, action.panelEmpleado);
    }
    case "SET_FILTRO_TAREAS_EMPLEADO":{
      return dotProp.set(state, `paneles.tareas.filtros`, action.filtros);
    }
    case "SET_TAREAS_EMPLEADO": {
      return dotProp.set(state, `tareasEmpleado`, action.tareas)
    }
    case "CHANGE_ORDER_TAREAS_EMPLEADO": {
      return dotProp.set(state, `paneles.tareas.${action.obj.item}`, action.obj.value)
    } 


    default:
      return state;
  }
}
