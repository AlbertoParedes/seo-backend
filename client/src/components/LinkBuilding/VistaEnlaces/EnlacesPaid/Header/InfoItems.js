import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_info!==nextProps.items_info)return true;
    return false;
  }

  render(){
    console.log(this.props.items_info);
    var clientes = this.props.items_info.clientes
    var eliminados = this.props.items_info.clientes_eliminados
    var pausados = this.props.items_info.clientes_parados

    return(
      <p className='subtitle-header'>

      {/*<span>
        <span className={`${clientes.clientes_finalizados<clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-wrong':''} ${clientes.clientes_finalizados>clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-new':''}`}>{clientes.clientes_finalizados}</span> de <span>{clientes.clientes_disponibles}</span> clientes activos
      </span>*/}

      <span>
        <span>{clientes.clientes_disponibles}</span> {clientes.clientes_disponibles===1?'cliente activo':''} {clientes.clientes_disponibles!==1?'clientes activos':''}
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

function mapStateToProps(state){return{ items_info : state.linkbuilding.enlaces.tipos.paid.items_info }}
export default connect(mapStateToProps)(InfoItems);
