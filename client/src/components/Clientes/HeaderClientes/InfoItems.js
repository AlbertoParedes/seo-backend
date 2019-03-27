import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_clientes_lista!==nextProps.items_clientes_lista)return true;
    return false;
  }

  render(){
    return(
      <p className='subtitle-header'>{this.props.items_clientes_lista.showing} de {this.props.items_clientes_lista.size} clientes</p>
    )
  }
}

function mapStateToProps(state){return{ items_clientes_lista : state.items_clientes_lista }}
export default connect(mapStateToProps)(InfoItems);
