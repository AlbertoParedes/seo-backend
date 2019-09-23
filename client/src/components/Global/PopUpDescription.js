import React, { Component } from 'react'

class PopUpDescription extends Component {
  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.cancelarPopUp() } }
  cancelarPopUp = () => { this.props.close() }
  render() {
    return (
      <div className='popup-description' ref={node => this.node = node} onClick={e => e.stopPropagation()}>
        {this.props.text}
      </div>
    )

  }
}

export default PopUpDescription