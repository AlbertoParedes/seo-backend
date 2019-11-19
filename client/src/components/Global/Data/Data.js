const data = {

  filtros: {

    filtro_tracking: {

      lista: {

        empleados: {
          title: 'Empleados',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
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

      },//lista

      keywords: {
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

      }

    },//filtro tracking


    filtro_clientes: {
      lista: {
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
        tipo: {
          title: 'Tipo de cliente',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'our': { text: 'Yoseo', text_info: 'clientes yoseo', checked: true },
            'old': { text: 'Normal', text_info: 'clientes normales', checked: true },
            'new': { text: 'Nuevo', text_info: 'clientes nuevos', checked: true },
            'better_links': { text: 'A mejorar', text_info: 'clientes a mejorar', checked: true },
          }
        },
      }
    },//filtros clientes

    lb_filtros_clientes_free: {
      lista: {
        type: {
          title: 'Tipo de LinkBuilding',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Linkbuilding Gratuito', checked: true },
            'paid': { text: 'De pago', text_info: 'Linkbuilding de pago', checked: false },
          }
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

      }
    },//lb_filtros clientes

    lb_filtros_clientes_paid: {
      lista: {
        type: {
          title: 'Tipo de LinkBuilding',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Linkbuilding Gratuito', checked: false },
            'paid': { text: 'De pago', text_info: 'Linkbuilding de pago', checked: true },
          }
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

      }
    },//lb_filtros clientes

    lb_filtros_medios_free: {
      lista: {
        type: {
          title: 'Tipo de medios',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Medios Gratuitos', checked: true },
            'paid': { text: 'De pago', text_info: 'Medios de pago', checked: false },
          }
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
      }
    },

    lb_filtros_medios_paid: {
      lista: {
        type: {
          title: 'Tipo de medios',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Medios Gratuitos', checked: true },
            'paid': { text: 'De pago', text_info: 'Medios de pago', checked: false },
          }
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
        plataformas: {
          title: 'Plataformas',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'prensalink': { text: 'Prensalink', text_info: 'Prensalink', checked: true },
            'prensarank': { text: 'Prensarank', text_info: 'Prensarank', checked: true },
            'que': { text: 'Que', text_info: 'Que', checked: true },
          }
        }
      }
    },

    lb_filtros_enlaces_free: {
      lista: {
        type: {
          title: 'Tipo de enlaces',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Enlaces Gratuitos', checked: true },
            'paid': { text: 'De pago', text_info: 'Enlaces de pago', checked: false },
          }
        },
        estado: {
          title: 'Estados de enlaces',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'si': { text: 'Terminados', text_info: 'Enlaces terminados', checked: true },
            'no': { text: 'Sin terminar', text_info: 'enlaces sin terminar', checked: true },
          }
        },
        status: {
          title: 'Estados de clientes',
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

        tipo_cliente: {
          title: 'Tipo de cliente',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'new': { text: 'Nuevos', text_info: 'Nuevos', checked: true },
            'old': { text: 'Antiguos', text_info: 'Antiguos', checked: true },
            'our': { text: 'Yoseo', text_info: 'Yoseo', checked: true },
            'better_links': { text: 'Favoritos', text_info: 'Favoritos', checked: true },
          }
        },

        blog: {
          title: 'Tiene blog',
          type: 'radiobutton',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'si': { text: 'Si', text_info: 'Con blog', checked: false },
            'no': { text: 'No', text_info: 'Sin blog', checked: false },
          }
        }, seo: ['Lite', 'Pro', 'Premium', 'A medida', 'Professional', 'Business', 'Enterprise'],

        seo: {
          title: 'Seo',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'Lite': { text: 'Lite', text_info: 'Lite', checked: true },
            'Pro': { text: 'Pro', text_info: 'Pro', checked: true },
            'Premium': { text: 'Premium', text_info: 'Premium', checked: true },
            'A medida': { text: 'A medida', text_info: 'A medida', checked: true },
            'Professional': { text: 'Professional', text_info: 'Professional', checked: true },
            'Business': { text: 'Business', text_info: 'Business', checked: true },
            'Enterprise': { text: 'Enterprise', text_info: 'Enterprise', checked: true },
          }
        },

        idioma: {
          title: 'Idioma',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'Alemán': { text: 'Alemán', text_info: 'Alemán', checked: true },
            'Árabe': { text: 'Árabe', text_info: 'Árabe', checked: true },
            'Español': { text: 'Español', text_info: 'Español', checked: true },
            'Francés': { text: 'Francés', text_info: 'Francés', checked: true },
            'Inglés': { text: 'Inglés', text_info: 'Inglés', checked: true },

          }
        },
        /*tipo_cliente:{
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
        },*/

        empleados: {
          title: 'Empleados',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {}
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

    lb_filtros_enlaces_paid: {
      lista: {
        type: {
          title: 'Tipo de enlaces',
          type: 'radiobutton',
          required: true,
          items: {
            'free': { text: 'Gratuitos', text_info: 'Enlaces Gratuitos', checked: true },
            'paid': { text: 'De pago', text_info: 'Enlaces de pago', checked: false },
          }
        },
        status: {
          title: 'Estados de clientes',
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

        tipo_cliente: {
          title: 'Tipo de cliente',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          items: {
            'new': { text: 'Nuevos', text_info: 'Nuevos', checked: true },
            'old': { text: 'Antiguos', text_info: 'Antiguos', checked: true },
            'our': { text: 'Yoseo', text_info: 'Yoseo', checked: true },
            'better_links': { text: 'Favoritos', text_info: 'Favoritos', checked: true },
          }
        },

        blog: {
          title: 'Tiene blog',
          type: 'radiobutton',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'si': { text: 'Si', text_info: 'Con blog', checked: false },
            'no': { text: 'No', text_info: 'Sin blog', checked: false },
          }
        }, seo: ['Lite', 'Pro', 'Premium', 'A medida', 'Professional', 'Business', 'Enterprise'],

        seo: {
          title: 'Seo',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'Lite': { text: 'Lite', text_info: 'Lite', checked: true },
            'Pro': { text: 'Pro', text_info: 'Pro', checked: true },
            'Premium': { text: 'Premium', text_info: 'Premium', checked: true },
            'A medida': { text: 'A medida', text_info: 'A medida', checked: true },
            'Professional': { text: 'Professional', text_info: 'Professional', checked: true },
            'Business': { text: 'Business', text_info: 'Business', checked: true },
            'Enterprise': { text: 'Enterprise', text_info: 'Enterprise', checked: true },
          }
        },

        idioma: {
          title: 'Idioma',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: true
          },
          required: true,
          items: {
            'Español': { text: 'Español', text_info: 'Español', checked: true },
            'Inglés': { text: 'Inglés', text_info: 'Inglés', checked: true },
            'Árabe': { text: 'Árabe', text_info: 'Árabe', checked: true },
          }
        },

        empleados: {
          title: 'Empleados',
          type: 'checkbox',
          todos: {
            text: 'Todos',
            checked: false
          },
          items: {}
        },

      }
    },

  },

  vistas: {

    vistas_linkbuilding: {
      vistas: {
        title: 'Vistas',
        type: 'radiobutton',
        items: {
          'clientes': { text: 'Clientes', text_info: 'Clientes', checked: false },
          'medios': { text: 'Medios', text_info: 'Medios', checked: false },
          'enlaces': { text: 'Enlaces', text_info: 'Enlaces', checked: true },
        }
      },
    }

  },



  months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

  seo: ['Lite', 'Pro', 'Premium', 'A medida', 'Professional', 'Business', 'Enterprise'],
  estados: ['Activado', 'Desactivado', 'Eliminado'],
  estados_servicios: ['Activado', 'Desactivado'],
  estados_act_des: ['Activado', 'Desactivado'],

  idiomas: ['Alemán', 'Árabe', 'Español', 'Francés', 'Inglés'],
  tipos_de_enlaces: ['Follows', 'Nofollows', 'Follows y Nofollows'],

  compartir_enlaces: {
    unico: { texto: 'Único' },
    compartido_1: { texto: 'Compartido entre 1' },
    compartido_2: { texto: 'Compartido entre 2' },
    compartido_3: { texto: 'Compartido entre 3' },
    compartido_4: { texto: 'Compartido entre 4' },
  },

  tipos: {
    our: { texto: 'Cliente yoseo' },
    old: { texto: 'Cliente normal' },
    new: { texto: 'Cliente nuevo' },
    better_links: { texto: 'Cliente a mejorar' },
  },

  prioridadTask: {
    baja: { texto: 'Baja' },
    media: { texto: 'Media' },
    alta: { texto: 'Alta' },
    urgente: { texto: 'Urgente' },

  },

  taskStatius: {
    no_completado:{texto:'No completado'},
    en_proceso:{
      id_parent:'en_proceso',
      texto:'En proceso',
      isSubmenu:true,
      _class:'submenu_en_proceso_task',
      submenu:{
        simple:{texto:'Simple'},
        numerico:{texto:'Numérico'}
      }
    },
    completado:{texto:'Completado'}
  },
  repetirTask: {
    nunca: {
      texto: 'Nunca'
    },
    diariamente: {
      texto: 'Diariamente'
    },
    periodicamente: {
      texto: 'Periodicamente',
      intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
      intervalo_text:{
        0:'',
        1:'día(s) después de finalizar'
      }
    },
    semanalmente: {
      texto: 'Semanalmente',
      intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      dia: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
      intervalo_text:{
        0:'cada',
        1:'semana(s)'
      },
      dia_texto:{
        0:'Día de la semana:'
      }
    },
    mensualmente: {
      texto: 'Mensualmente',
      intervalo: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      dia: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "Último"],
      intervalo_text:{
        0:'cada',
        1:'mes(es)'
      },
      dia_texto:{
        0:'Día del mes:'
      }
    },
    anualmente: {
      texto: 'Anualmente'
    },
  },

  categoriaMediosFree: {
    colaboraciones:{
      id:'colaboraciones',
      texto:'Colaboraciones'
    },

    comentarios:{
      id:'comentarios',
      texto:'Comentarios'
    },
    directorios:{
      id:'directorios',
      texto:'Directorios'
    },
    foros:{
      id:'foros',
      texto:'Foros'
    },
    herramientas_de_analisis:{
      id:'herramientas_de_analisis',
      texto:'Herramientas de análisis'
    },
    marcadores:{
      id:'marcadores',
      texto:'Marcadores'
    },
    pbn:{
      id:'pbn',
      texto:'PBN'
    },
    perfiles:{
      id:'perfiles',
      texto:'Perfiles'
    },
    redes_sociales_o_agregadores:{
      id:'redes_sociales_o_agregadores',
      texto:'RRSS y agregadores'
    },
    webs2_0:{
      id:'webs2_0',
      texto:'Webs 2.0'
    },
    
  },
  tematicasPrensarank: [
    'Todas',
    'Actualidad y Política',
    'Amor, bodas, relaciones o parejas',
    'Apuestas y casino',
    'Arte y diseño',
    'Bebés y Niños',
    'Belleza',
    'Cine y TV',
    'Cocina y gastronomía',
    'Dating',
    'Deportes',
    'Economía',
    'Educación',
    'Empresa (Publicitario)',
    'Hogar, Decoración y Bricolaje',
    'Humor y Ocio',
    'Informática Internet',
    'Juegos y videoconsolas',
    'Música y Espectáculos',
    'Marketing y SEO',
    'Mascotas',
    'Moda',
    'Motor',
    'Naturaleza',
    'Otros',
    'Religión, Místico',
    'Salud',
    'Servicios Inmobiliarios (Venta, Alquiler)',
    'SexShop',
    'Sexualidad',
    'Tarot, videncia y esoterismo',
    'Tecnología Física',
    'Viajes, hoteles y turismo']
  

}
export default data
