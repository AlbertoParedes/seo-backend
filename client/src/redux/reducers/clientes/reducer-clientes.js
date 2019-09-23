import dotProp from 'dot-prop-immutable';
var clientes = {

  task: {
    lista: {
      filtros: {

        status: {
          title: 'Estado',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'completado': { text: 'Completados', text_info: 'Completados', checked: true },
            'progreso': { text: 'En progreso', text_info: 'En progreso', checked: true },
            'noCompletado': { text: 'No completados', text_info: 'No completados', checked: true },
          }
        },

        empleados: {
          title: 'Empleados',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {}
        },


      },
      sortBy: 'fecha_creacion',
      des: false,
      search: '',
      searchBy: 'titulo',
      items_loaded: 50,
      lista_search_by: {
        'titulo': { valor: 'título' }
      },
    },
    addTask: false,
    editTask: false,
    tarea_seleccionada: null
  }

}


export default function (state = clientes, action) {
  var newProps = false
  switch (action.type) {

    case "ADD_TASK":
      return dotProp.set(state, `task.addTask`, action.valor);
    case "EDIT_TASK":
      return dotProp.set(state, `task.editTask`, action.valor);
    case "CHANGE_TAREA_SELECCIONADA":
      return dotProp.set(state, `task.tarea_seleccionada`, action.tarea);

    case "TASK_FILTROS_CLIENTES":
      return dotProp.set(state, `clientes.task.lista.filtros`, action.filtros);


    default:
      return state;
  }
}
