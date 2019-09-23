import dotProp from 'dot-prop-immutable';
import moment from 'moment'
var tracking = {


  paneles: {
    lista: {
      filtros: {
        empleados: {
          title: 'Empleados',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {}
        },

        status: {
          title: 'Estado',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {
            'activos': { text: 'activos', text_info: 'Activos', checked: true },
            'pausados': { text: 'Pausados', text_info: 'Pausados', checked: false },
            'eliminados': { text: 'Eliminados', text_info: 'Eliminados', checked: false },
          }
        },
      },
      sortBy: 'dominio',
      des: false,
      search: '',
      searchBy: 'web',
      items_loaded: 50,
      items_clientes: {
        clientes: {
          clientes_disponibles: 0
        },
        clientes_eliminados: 0,
        clientes_parados: 0
      },
      lista_search_by: {
        'web': { valor: 'web' },
        'nombre': { valor: 'nombre' }
      },
    },
    keywords: {
      filtros: {
        status: {
          title: 'Estado',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {
            'activos': { text: 'activos', text_info: 'Activos', checked: true },
            'pausados': { text: 'Pausados', text_info: 'Pausados', checked: false },
            'eliminados': { text: 'Eliminados', text_info: 'Eliminados', checked: false },
          }
        },
      },
      sortBy: 'keyword',
      des: false,
      search: '',
      searchBy: 'keyword',
      items_loaded: 50,
      items_keywords: {
        keywords: {
          keywords_disponibles: 0
        },
        keywords_eliminadas: 0,
        keywords_paradas: 0
      },
      lista_search_by: {
        'keyword': { valor: 'keyword' },
        'first_position': { valor: 'posición' },
        'first_url': { valor: 'url' }
      },
      dates: {
        endDate: moment(),
        startDate: moment().subtract(30 - 1, 'days')
      }
    }
  },
  panel: 'lista',
  tracking_keywords_edit: { activo: false, seleccionados: {} },
  keyword_tracking_selected: false,

  items_info: '0 de 0 clientes'



}


export default function (state = tracking, action) {
  switch (action.type) {

    case "PANEL_TRACKING":
      return dotProp.set(state, `panel`, action.panel_tracking);

    case "TRACKING_SEARCH_CLIENTES":
      return dotProp.set(state, `paneles.lista.search`, action.text);

    case "TRACKING_SEARCH_BY_CLIENTES":
      return dotProp.set(state, `paneles.lista.searchBy`, action.text);
    case "FILTROS_TRACKING_CLIENTES":
      return dotProp.set(state, `paneles.lista.filtros`, action.filtros);
    case "ITEMS_TRACKING_CLIENTES":
      return dotProp.set(state, `paneles.lista.items_clientes`, action.item);


    case "TRACKING_SEARCH_KEYWORDS":
      return dotProp.set(state, `paneles.keywords.search`, action.text);

    case "TRACKING_SEARCH_BY_KEYWORDS":
      return dotProp.set(state, `paneles.keywords.searchBy`, action.text);

    case "TRACKING_KEYWORDS_EDIT":
      return dotProp.set(state, `tracking_keywords_edit`, action.tracking_keywords_edit);

    case "FILTROS_TRACKING_KEYWORDS":
      return dotProp.set(state, `paneles.keywords.filtros`, action.filtros_tracking_keywords);

    case "KEYWORD_TRACKING_SELECTED":
      return dotProp.set(state, `keyword_tracking_selected`, action.keyword_tracking_selected);

    case "ITEMS_TRACKING_KEYWORDS":
      return dotProp.set(state, `paneles.keywords.items_keywords`, action.items_tracking_keywords);

    case "CHANGE_DATES_KEYWORDS":
      return dotProp.set(state, `paneles.keywords.dates`, action.dates);

    default:
      return state;
  }
}
