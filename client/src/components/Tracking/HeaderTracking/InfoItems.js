import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_clientes!==nextProps.items_clientes)return true;
    return false;
  }

  render(){
    return(
      <p className='subtitle-header'>{this.props.items_clientes.showing} de {this.props.items_clientes.size} clientes</p>
    )
  }
}

function mapStateToProps(state){return{ items_clientes : state.items_clientes }}
export default connect(mapStateToProps)(InfoItems);
