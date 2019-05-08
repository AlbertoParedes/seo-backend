import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_keywords!==nextProps.items_keywords)return true;
    return false;
  }

  render(){
    console.log(this.props.items_keywords);
    var keywords = this.props.items_keywords.keywords
    var eliminados = this.props.items_keywords.keywords_eliminadas
    var pausados = this.props.items_keywords.keywords_paradas

    return(
      <p className='subtitle-header'>

      {/*<span>
        <span className={`${clientes.clientes_finalizados<clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-wrong':''} ${clientes.clientes_finalizados>clientes.clientes_disponibles && clientes.clientes_finalizados!==0?'color-new':''}`}>{clientes.clientes_finalizados}</span> de <span>{clientes.clientes_disponibles}</span> clientes activos
      </span>*/}

      <span>
        <span>{keywords.keywords_disponibles}</span> {keywords.keywords_disponibles===1?'keyword activa':''} {keywords.keywords_disponibles!==1?'keywords activas':''}
      </span>

      {eliminados>0?<span className='item-info-separate'>|</span>:null}

      {eliminados>0?
        <span>
          <span className='color-wrong'>{eliminados}</span> {eliminados===1?'keyword eliminada':''} {eliminados!==1?'keywords eliminadas':''}
        </span>
      :null}

      {pausados>0?<span className='item-info-separate'>|</span>:null}

      {pausados>0?
        <span>
          <span className='color-pausa'>{pausados}</span> {pausados===1?'keyword pausada':''} {pausados!==1?'keywords pausadas':''}
        </span>
      :null}


      </p>

    )
  }
}

function mapStateToProps(state){return{ items_keywords : state.tracking.paneles.keywords.items_keywords}}
export default connect(mapStateToProps)(InfoItems);
