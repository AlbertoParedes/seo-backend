import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setClienteSeleccionado, setPanelHome, setPanelClientes } from '../../../redux/actions';

class ItemNotificacion extends Component {

  handleNotification = () => {
    console.log(this.props.item);

    if (this.props.item.id_cliente) {
      this.props.setClienteSeleccionado(this.props.clientes[this.props.item.id_cliente]);
    }
    if (this.props.item.panelHome) {
      this.props.setPanelHome(this.props.item.panelHome);
    }
    if (this.props.item.panelClientes) {
      this.props.setPanelClientes(this.props.item.panelClientes)
    }


    this.props.close()


  }

  render() {
    var prioridad = ''
    if (this.props.item.prioridad === 1) {
      prioridad = 'status-close'
    } else if (this.props.item.prioridad === 2) {
      prioridad = 'status-warning'
    } else if (this.props.item.prioridad === 3) {
      prioridad = 'status-done'
    }
    return (
      <div className='container-notificacion-item' onClick={() => this.handleNotification()}>

        <div className='container-icon-notification'>
          <div className={`container-icon-circle-noti ${prioridad}`}><i className="material-icons">{this.props.item.icon}</i></div>
        </div>

        <div data-tipo='container-info'>

          <div className='titile-notification'>{this.props.item.title}</div>
          <div>{this.props.item.subtitle}</div>

        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    empleado: state.empleado,
    notificaciones: state.global.notificaciones,
    clientes: state.clientes
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setClienteSeleccionado, setPanelHome, setPanelClientes
  }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(ItemNotificacion);