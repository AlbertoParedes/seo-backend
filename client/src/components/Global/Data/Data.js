const data = {

  filtros:{

    filtro_tracking:{

      lista:{

        empleados:{
          title:'Empleados',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:true
          },
          items:{}
        },

        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },

      },//lista

      keywords : {
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },

      }

    },//filtro tracking


    filtro_clientes:{
      lista:{
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },
      }
    },//filtros clientes

    lb_filtros_clientes_free:{
      lista:{
        type:{
          title:'Tipo de LinkBuilding',
          type:'radiobutton',
          required:true,
          items:{
            'free':{text:'Gratuitos',text_info:'Linkbuilding Gratuito',checked:true},
            'paid':{text:'De pago',text_info:'Linkbuilding de pago',checked:false},
          }
        },
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },

      }
    },//lb_filtros clientes

    lb_filtros_clientes_paid:{
      lista:{
        type:{
          title:'Tipo de LinkBuilding',
          type:'radiobutton',
          required:true,
          items:{
            'free':{text:'Gratuitos',text_info:'Linkbuilding Gratuito',checked:false},
            'paid':{text:'De pago',text_info:'Linkbuilding de pago',checked:true},
          }
        },
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },

      }
    },//lb_filtros clientes

    lb_filtros_medios_free:{
      lista:{
        type:{
          title:'Tipo de medios',
          type:'radiobutton',
          required:true,
          items:{
            'free':{text:'Gratuitos',text_info:'Medios Gratuitos',checked:true},
            'paid':{text:'De pago',text_info:'Medios de pago',checked:false},
          }
        },
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },
      }
    },

    lb_filtros_medios_paid:{
      lista:{
        type:{
          title:'Tipo de medios',
          type:'radiobutton',
          required:true,
          items:{
            'free':{text:'Gratuitos',text_info:'Medios Gratuitos',checked:true},
            'paid':{text:'De pago',text_info:'Medios de pago',checked:false},
          }
        },
        status:{
          title:'Estado',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },
        plataformas:{
          title:'Plataformas',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:true
          },
          items:{
            'prensalink':{text:'Prensalink',text_info:'Prensalink',checked:true},
            'prensarank':{text:'Prensarank',text_info:'Prensarank',checked:true},
            'que':{text:'Que',text_info:'Que',checked:true},
          }
        }
      }
    },

    lb_filtros_enlaces_free:{
      lista:{
        type:{
          title:'Tipo de enlaces',
          type:'radiobutton',
          required:true,
          items:{
            'free':{text:'Gratuitos',text_info:'Enlaces Gratuitos',checked:true},
            'paid':{text:'De pago',text_info:'Enlaces de pago',checked:false},
          }
        },
        status:{
          title:'Estados de clientes',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{
            'activos':{text:'activos',text_info:'Activos',checked:true},
            'pausados':{text:'Pausados',text_info:'Pausados',checked:false},
            'eliminados':{text:'Eliminados',text_info:'Eliminados',checked:false},
          }
        },

        tipo_cliente:{
          title:'Tipo de cliente',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:true
          },
          items:{
            'new':{text:'Nuevos',text_info:'Nuevos',checked:true},
            'old':{text:'Antiguos',text_info:'Antiguos',checked:true},
            'our':{text:'Yoseo',text_info:'Yoseo',checked:true},
            'better_links':{text:'Favoritos',text_info:'Favoritos',checked:true},
          }
        },

        tipo_cliente:{
          title:'Clientes terminados',
          type:'radiobutton',
          todos:{
            text:'Todos',
            checked:true
          },
          items:{
            'terminados':{text:'Terminados',text_info:'Terminados',checked:false},
            'sin_terminar':{text:'Sin terminar',text_info:'Sin terminar',checked:false},
          }
        },

        empleados:{
          title:'Empleados',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:false
          },
          items:{}
        },



        /*plataformas:{
          title:'Plataformas',
          type:'checkbox',
          todos:{
            text:'Todos',
            checked:true
          },
          items:{
            'prensalink':{text:'Prensalink',text_info:'Prensalink',checked:true},
            'prensarank':{text:'Prensarank',text_info:'Prensarank',checked:true},
            'que':{text:'Que',text_info:'Que',checked:true},
          }
        }*/
      }
    },

  },

  vistas:{

    vistas_linkbuilding:{
      vistas:{
        title:'Vistas',
        type:'radiobutton',
        items:{
          'clientes':{text:'Clientes',text_info:'Clientes',checked:false},
          'medios':{text:'Medios',text_info:'Medios',checked:false},
          'enlaces':{text:'Enlaces',text_info:'Enlaces',checked:true},
        }
      },
    }

  },



  months : ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],

  seo:['Lite','Pro','Premium', 'A medida'],
  estados : ['Activo', 'Parado', 'Eliminado'],
  estados_servicios: ['Activado','Desactivado'],
  estados_act_des : ['Activo', 'Parado'],

}
export default data
