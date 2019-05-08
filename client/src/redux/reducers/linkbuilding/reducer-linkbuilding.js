import dotProp from 'dot-prop-immutable';
var linkbuilding = {

  vistas:{},//clientes | medios | enlaces


  clientes:{
    tipos:{
      free:{
        paneles:{
          lista:{
            filtros:{},
            sortBy:'dominio',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:'0 de 0 clientes'
      },

      paid:{
        paneles:{
          lista:{
            filtros:{},
            sortBy:'dominio',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:'0 de 0 clientes'
      }
    },
  },

  medios:{
    tipos:{
      free:{
        medios:{},
        categoria_seleccionada:null,
        medio_seleccionado:null,
        paneles:{
          lista:{
            filtros:{},
            sortBy:'web',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:'0 de 0 medios',
      },

      paid:{
        medios:{},
        medio_seleccionado:null,
        paneles:{
          lista:{
            filtros:{},
            sortBy:'web',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:'0 de 0 medios',
        plataformas:{}
      }
    },

  },

  enlaces:{
    fecha: new Date().getFullYear()+'-'+( (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1) ),
    tipos:{
      free:{
        paneles:{
          lista:{
            filtros:{},
            sortBy:'dominio',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:{
          enlaces:{follows_total_done:0,follows_total:0},
          clientes:{clientes_finalizados:0, clientes_disponibles:0},
          clientes_eliminados:0,clientes_parados:0
        },
        enlaces:null // este atributo es cuando pedimos los enlaces de un cliente y poder añadir mas follows o no desde el header
      },

      paid:{
        paneles:{
          lista:{
            filtros:{},
            sortBy:'dominio',
            des:false,
            search:'',
            searchBy:'web',
            items_loaded:50,
            lista_search_by:{
              'web':{valor:'web'},
              'nombre':{valor:'nombre'}
            },
          }
        },
        panel:'',
        items_info:{
          clientes:{clientes_finalizados:0, clientes_disponibles:0},
          clientes_eliminados:0,clientes_parados:0
        },
      }
    },

  },

}


export default function (state=linkbuilding, action){
  switch (action.type) {

    case "LB_VISTAS" :
      return dotProp.set(state, `vistas`, action.vistas);

    case "LB_PANEL_CLIENTES":
      return dotProp.set(state, `clientes.panel`, action.panel);

    case "LB_PANEL_MEDIOS":
      return dotProp.set(state, `medios.panel`, action.panel);

    case "LB_PANEL_ENLACES":
      return dotProp.set(state, `enlaces.panel`, action.panel);




    case "LB_FILTROS_CLIENTES_FREE_LISTA":
      return dotProp.set(state, `clientes.tipos.free.paneles.lista.filtros`, action.filtros);

    case "LB_FILTROS_CLIENTES_PAID_LISTA":
      return dotProp.set(state, `clientes.tipos.paid.paneles.lista.filtros`, action.filtros);
    case "LB_PANEL_CLIENTES_FREE":
      return dotProp.set(state, `clientes.tipos.free.panel`, action.panel);
    case "LB_PANEL_CLIENTES_PAID":
      return dotProp.set(state, `clientes.tipos.paid.panel`, action.panel);

    case 'LB_SORTBY_DES_CLIENTES_LISTA':
      var newProps = dotProp.set(state, `clientes.tipos.free.paneles.lista.sortBy`, action.data.sortBy);
      newProps.clientes.tipos.free.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_CLIENTES_LISTA":
      return dotProp.set(state, `clientes.tipos.free.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_CLIENTES_LISTA":
      return dotProp.set(state, `clientes.tipos.free.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_CLIENTES_LISTA":
      return dotProp.set(state, `clientes.tipos.free.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_CLIENTES_FREE":
      return dotProp.set(state, `clientes.tipos.free.items_info`, action.items_info);


    case 'LB_SORTBY_DES_CLIENTES_LISTA_PAID':
      var newProps = dotProp.set(state, `clientes.tipos.paid.paneles.lista.sortBy`, action.data.sortBy);
      newProps.clientes.tipos.paid.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_CLIENTES_LISTA_PAID":
      return dotProp.set(state, `clientes.tipos.paid.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_CLIENTES_LISTA_PAID":
      return dotProp.set(state, `clientes.tipos.paid.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_CLIENTES_LISTA_PAID":
      return dotProp.set(state, `clientes.tipos.paid.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_CLIENTES_PAID":
      return dotProp.set(state, `clientes.tipos.paid.items_info`, action.items_info);




    case "LB_MEDIOS_FREE":
      return dotProp.set(state, `medios.tipos.free.medios`, action.medios);
    case "LB_FILTROS_MEDIOS_FREE_LISTA":
      return dotProp.set(state, `medios.tipos.free.paneles.lista.filtros`, action.filtros);

    case "LB_PANEL_MEDIOS_FREE":
      return dotProp.set(state, `medios.tipos.free.panel`, action.panel);

    case "LB_CATEGORIA_MEDIOS_FREE":
      return dotProp.set(state, `medios.tipos.free.categoria_seleccionada`, action.categoria_seleccionada);

    case "LB_MEDIO_MEDIOS_FREE":
      return dotProp.set(state, `medios.tipos.free.medio_seleccionado`, action.medio_seleccionado);

    case "LB_PANEL_MEDIOS_FREE_ITEMS_INFO":
      return dotProp.set(state, `medios.tipos.free.items_info`, action.items_info);
    case 'LB_SORTBY_DES_MEDIOS_LISTA_FREE':
      var newProps = dotProp.set(state, `medios.tipos.free.paneles.lista.sortBy`, action.data.sortBy);
      newProps.medios.tipos.free.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_MEDIOS_LISTA_FREE":
      return dotProp.set(state, `medios.tipos.free.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_MEDIOS_LISTA_FREE":
      return dotProp.set(state, `medios.tipos.free.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_MEDIOS_LISTA_FREE":
      return dotProp.set(state, `medios.tipos.free.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_MEDIOS_FREE":
      return dotProp.set(state, `medios.tipos.free.items_info`, action.items_info);




    case "LB_MEDIOS_PAID":
      return dotProp.set(state, `medios.tipos.paid.medios`, action.medios);
    case "LB_MEDIO_MEDIOS_PAID":
      return dotProp.set(state, `medios.tipos.paid.medio_seleccionado`, action.medio);
    case "LB_FILTROS_MEDIOS_PAID_LISTA":
      return dotProp.set(state, `medios.tipos.paid.paneles.lista.filtros`, action.filtros);

    case "LB_PANEL_MEDIOS_PAID":
      return dotProp.set(state, `medios.tipos.paid.panel`, action.panel);

    case 'LB_SORTBY_DES_MEDIOS_LISTA_PAID':
      var newProps = dotProp.set(state, `medios.tipos.paid.paneles.lista.sortBy`, action.data.sortBy);
      newProps.medios.tipos.paid.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_MEDIOS_LISTA_PAID":
      return dotProp.set(state, `medios.tipos.paid.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_MEDIOS_LISTA_PAID":
      return dotProp.set(state, `medios.tipos.paid.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_MEDIOS_LISTA_PAID":
      return dotProp.set(state, `medios.tipos.paid.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_MEDIOS_PAID":
      return dotProp.set(state, `medios.tipos.paid.items_info`, action.items_info);

    case "LB_PLATAFORMAS_MEDIOS_PAID":
      return dotProp.set(state, `medios.tipos.paid.plataformas`, action.plataformas);





    case "LB_FILTROS_ENLACES_FREE_LISTA":
      return dotProp.set(state, `enlaces.tipos.free.paneles.lista.filtros`, action.filtros);

    case "LB_PANEL_ENLACES_FREE":
      return dotProp.set(state, `enlaces.tipos.free.panel`, action.panel);

    case 'LB_SORTBY_DES_ENLACES_LISTA_FREE':
      var newProps = dotProp.set(state, `enlaces.tipos.free.paneles.lista.sortBy`, action.data.sortBy);
      newProps.enlaces.tipos.free.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_ENLACES_LISTA_FREE":
      return dotProp.set(state, `enlaces.tipos.free.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_ENLACES_LISTA_FREE":
      return dotProp.set(state, `enlaces.tipos.free.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_ENLACES_LISTA_FREE":
      return dotProp.set(state, `enlaces.tipos.free.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_ENLACES_FREE":
      return dotProp.set(state, `enlaces.tipos.free.items_info`, action.items_info);


    //Enlaces de pago--------------------------------

    case "LB_FILTROS_ENLACES_PAID_LISTA":
      return dotProp.set(state, `enlaces.tipos.paid.paneles.lista.filtros`, action.filtros);

    case "LB_PANEL_ENLACES_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.panel`, action.panel);

    case 'LB_SORTBY_DES_ENLACES_LISTA_PAID':
      var newProps = dotProp.set(state, `enlaces.tipos.paid.paneles.lista.sortBy`, action.data.sortBy);
      newProps.enlaces.tipos.paid.paneles.lista.des=action.data.des
      return newProps

    case "LB_SEARCH_DES_ENLACES_LISTA_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.paneles.lista.search`, action.text);

    case "LB_SEARCHBY_DES_ENLACES_LISTA_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.paneles.lista.searchBy`, action.text);

    case "LB_ITEMS_LOADED_DES_ENLACES_LISTA_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.paneles.lista.items_loaded`, action.items);

    case "LB_INFO_ENLACES_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.items_info`, action.items_info);
    case "SET_ENLACES_PAID":
      return dotProp.set(state, `enlaces.tipos.paid.enlaces`, action.enlaces);
      //-----------------------------------------------







      case "SET_FECHA_ENLACES":
        return dotProp.set(state, `enlaces.fecha`, action.fecha);

      case "SET_ENLACES_FREE":
        return dotProp.set(state, `enlaces.tipos.free.enlaces`, action.enlaces);





    case "FILTROS-FREE-PAID":
      var newClientes =  dotProp.set(state.clientes.tipos, `free.paneles.lista.filtros.type.items.free.checked`, action.newType.items.free.checked);
      newClientes.free.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;
      newClientes.paid.paneles.lista.filtros.type.items.free.checked=action.newType.items.free.checked;
      newClientes.paid.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;


      var newMedios =  dotProp.set(state.medios.tipos, `free.paneles.lista.filtros.type.items.free.checked`, action.newType.items.free.checked);
      newMedios.free.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;
      newMedios.paid.paneles.lista.filtros.type.items.free.checked=action.newType.items.free.checked;
      newMedios.paid.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;

      var newEnlaces =  dotProp.set(state.enlaces.tipos, `free.paneles.lista.filtros.type.items.free.checked`, action.newType.items.free.checked);
      newEnlaces.free.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;
      newEnlaces.paid.paneles.lista.filtros.type.items.free.checked=action.newType.items.free.checked;
      newEnlaces.paid.paneles.lista.filtros.type.items.paid.checked=action.newType.items.paid.checked;



      var newFilros =  dotProp.set(state, `clientes.tipos`, newClientes);
      newFilros.medios.tipos = newMedios
      newFilros.enlaces.tipos = newEnlaces

      return newFilros

    default :
      return state;
  }
}
