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

  },



  months : ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

}
export default data
