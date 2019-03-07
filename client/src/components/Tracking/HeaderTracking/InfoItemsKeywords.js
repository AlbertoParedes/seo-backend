import React, { Component } from 'react';
import { connect } from 'react-redux';

class InfoItems extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.items_tracking_keywords!==nextProps.items_tracking_keywords)return true;
    return false;
  }

  render(){
    return(
      <p className='subtitle-header'>{this.props.items_tracking_keywords.showing} de {this.props.items_tracking_keywords.size} keywords</p>
    )
  }
}

function mapStateToProps(state){return{ items_tracking_keywords : state.items_tracking_keywords }}
export default connect(mapStateToProps)(InfoItems);
