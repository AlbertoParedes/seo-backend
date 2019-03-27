import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_info!==nextProps.items_info)return true;
    return false;
  }

  render(){
    var enlaces = this.props.items_info.enlaces
    var clientes = this.props.items_info.clientes
    var eliminados = this.props.items_info.clientes_eliminados
    var pausados = this.props.items_info.clientes_parados

    return(
      <p className='subtitle-header'>

      <span>
        <span className={` ${enlaces.follows_total_done<enlaces.follows_total && enlaces.follows_total_done!==0?'color-wrong':''} ${enlaces.follows_total_done>enlaces.follows_total && enlaces.follows_total_done!==0?'color-new':''}`}>{enlaces.follows_total_done}</span> de <span>{enlaces.follows_total}</span> enlaces
      </span>

      <span className='item-info-separate'>|</span>

      <span>
        <span className={`${clientes.clientes_finalizados<clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-wrong':''} ${clientes.clientes_finalizados>clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-new':''}`}>{clientes.clientes_finalizados}</span> de <span>{clientes.clientes_disponibles}</span> clientes
      </span>

      {eliminados>0?<span className='item-info-separate'>|</span>:null}

      {eliminados>0?
        <span>
          <span className='color-wrong'>{eliminados}</span> {eliminados===1?'cliente eliminado':''} {eliminados!==1?'clientes eliminados':''}
        </span>
      :null}

      {pausados>0?<span className='item-info-separate'>|</span>:null}

      {pausados>0?
        <span>
          <span className='color-pausa'>{pausados}</span> {pausados===1?'cliente pausado':''} {pausados!==1?'clientes pausados':''}
        </span>
      :null}


      </p>

    )
  }
}

function mapStateToProps(state){return{ items_info : state.linkbuilding.enlaces.tipos.free.items_info }}
export default connect(mapStateToProps)(InfoItems);
