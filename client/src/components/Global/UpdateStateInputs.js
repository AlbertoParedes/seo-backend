import React, { Component } from 'react';

class InformacionTutor extends Component {
  render() {
    return(
      <div className='settings-panels'>
        <div className='div-undo-icon' onClick={()=>this.props.undoData()}><i className="material-icons">undo</i></div>
        <div className='div-save-icon' onClick={()=>this.props.saveData()}><i className="material-icons">save</i></div>
      </div>
    )
  }
}

export default InformacionTutor
