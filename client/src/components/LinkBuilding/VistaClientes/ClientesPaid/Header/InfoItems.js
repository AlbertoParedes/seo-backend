import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_info!==nextProps.items_info)return true;
    return false;
  }

  render(){
    return(
      <p className='subtitle-header'>{this.props.items_info}</p>
    )
  }
}

function mapStateToProps(state){return{ items_info : state.linkbuilding.clientes.tipos.paid.items_info }}
export default connect(mapStateToProps)(InfoItems);
