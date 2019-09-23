import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setNotificaciones } from '../../../redux/actions';
import PanelOpciones from './PanelOpciones'
import ContainerNotificacion from './ContainerNotificacion'
import firebase from '../../../firebase/Firebase';
class EmpleadoMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_notificaciones: false,
      show_opciones: false,
      notificaciones: this.props.notificaciones
    }
  }

  componentWillReceiveProps = newProps => {
    if (this.state.notificaciones !== newProps.notificaciones) { this.setState({ notificaciones: newProps.notificaciones }, () => this.orderNotificaciones()) }
  }

  componentWillMount = () => {
    this.orderNotificaciones()
  }

  orderNotificaciones = () => {
    var notificaciones = this.state.notificaciones;

    notificaciones.sort((a, b) => {
      if (a.prioridad > b.prioridad) { return 1; }
      if (a.prioridad < b.prioridad) { return -1; }
      return 0;
    });
    this.setState({ notificaciones })
  }

  signOut() {
    firebase.auth().signOut();
    //browserHistory.replace(`${process.env.PUBLIC_URL}/signin`);
    window.location.replace(`${process.env.PUBLIC_URL}/signin`);
  }
  render() {

    var prioridadAlta = this.state.notificaciones.some((item) => { return item.prioridad === 1 })
    var prioridadMedia = this.state.notificaciones.some((item) => { return item.prioridad === 2 })

    return (
      <div className='container-perfil-empleado'>

        <div className='display_flex container-icon-toolbar-empleado'>
          {this.state.notificaciones.length > 0 ?
            <div>
              <i className={`material-icons ${prioridadAlta ? 'color-red-noti' : ''} ${prioridadMedia ? 'color-orange-noti' : ''}  shake-animation`} onClick={() => this.setState({ show_notificaciones: true })}> notification_important </i>
              {this.state.show_notificaciones ?
                <ContainerNotificacion notificaciones={this.state.notificaciones} close={() => this.setState({ show_notificaciones: false })} />
                : null
              }
            </div>
            : null
          }

        </div>

        <div className='display_flex pr pointer' onClick={() => this.setState({ show_opciones: true })}>
          <div className='align-center'>
            <img className='picture-profile' alt='' src={this.props.empleado.foto} />
          </div>
          <div className='display_flex'>
            <div className='empleado-name-role'>
              <div date-tipo='name' className='align-center'>{this.props.empleado.nombre} {this.props.empleado.apellidos}</div>
              <div date-tipo='role'>{this.props.empleado.role}</div>
            </div>
            <i className="material-icons align-center">expand_more</i>
          </div>

          {this.state.show_opciones ?
            <PanelOpciones empleado={this.props.empleado} onClick={(e) => e.stopPropagation()} signOut={() => { this.signOut() }} close={() => { this.setState({ show_opciones: false }) }} />
            : null}
          <div>
          </div>

        </div>



      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    empleado: state.empleado,
    notificaciones: state.global.notificaciones
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    setNotificaciones
  }, dispatch)
}
export default connect(mapStateToProps, matchDispatchToProps)(EmpleadoMenu);
//<div className="div_log_out"><i className="material-icons i_log_out" onClick={() => this.signOut()}>exit_to_app</i></div>


