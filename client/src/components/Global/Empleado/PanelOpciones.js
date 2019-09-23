import React, { Component } from 'react'

class PanelOpciones extends Component {
  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.props.close() } }
  render() {
    return (
      <div className='panel_popup_empleado' ref={node => this.node = node}>

        <div className='container_popup_empleado'>
          <div className='align-center'>
            <img class="picture-profile img-empleado-pu" alt="" src={this.props.empleado.foto} />
          </div>
          <div>

            <div className='name-empleado-popup' >{this.props.empleado.nombre} {this.props.empleado.apellidos}</div>
            <div className='email-empleado-popup' >{this.props.empleado.email}</div>
            <div className='role-empleado-popup' >{this.props.empleado.role}</div>

          </div>
        </div>

        <div className='opc-popup-empleado'>
          <div className='btn-cerrar-sesion' onClick={() => this.props.signOut()}>Cerrar sesión</div>
        </div>


      </div>
    )
  }
}

export default PanelOpciones