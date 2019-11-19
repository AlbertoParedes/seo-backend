import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.itemsEmpleadoTareas!==nextProps.itemsEmpleadoTareas)return true;
    return false;
  }

  render(){
    var tareas = this.props.itemsEmpleadoTareas.tareas
    var eliminados = this.props.itemsEmpleadoTareas.tareasEliminadas
    var pausados = this.props.itemsEmpleadoTareas.tareasParadas

    return(
      <p className='subtitle-header'>

      {/*<span>
        <span className={`${clientes.clientes_finalizados<clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-wrong':''} ${clientes.clientes_finalizados>clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-new':''}`}>{clientes.clientes_finalizados}</span> de <span>{clientes.clientes_disponibles}</span> clientes activos
      </span>*/}

      <span>
        <span>{tareas.tareasDisponibles}</span> {tareas.tareasDisponibles===1?'tarea activa':''} {tareas.tareasDisponibles!==1?'tareas activas':''}
      </span>

      {eliminados>0?<span className='item-info-separate'>|</span>:null}

      {eliminados>0?
        <span>
          <span className='color-wrong'>{eliminados}</span> {eliminados===1?'tarea eliminada':''} {eliminados!==1?'tareas eliminadas':''}
        </span>
      :null}

      {pausados>0?<span className='item-info-separate'>|</span>:null}

      {pausados>0?
        <span>
          <span className='color-pausa'>{pausados}</span> {pausados===1?'tarea pausada':''} {pausados!==1?'tareas pausadas':''}
        </span>
      :null}


      </p>

    )
  }
}

function mapStateToProps(state){return{ itemsEmpleadoTareas : state.panelEmpleado.paneles.tareas.itemsTarea }}
export default connect(mapStateToProps)(InfoItems);
