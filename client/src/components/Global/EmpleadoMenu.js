import React, {Component} from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase/Firebase';
class EmpleadoMenu extends Component {

    constructor(props){
      super(props);
      this.state = {

      }
    }
    signOut(){firebase.auth().signOut();}
    render() {
      return (
        <div className='container-perfil-empleado'>
          <div className='align-center'>
            <img className='picture-profile' alt='' src={this.props.empleado.foto} />
          </div>
          <div className='display_flex'>
            <div className='empleado-name-role'>
              <div date-tipo='name' className='align-center'>{this.props.empleado.nombre} {this.props.empleado.apellidos}</div>
              <div date-tipo='role'>{this.props.empleado.role}</div>
            </div>
            <i className="material-icons align-center" onClick={()=>this.signOut()}>expand_more</i>
          </div>



        </div>
      );
    }
}

function mapStateToProps(state){return{ empleado:state.empleado }}

export default connect(mapStateToProps)(EmpleadoMenu);
//<div className="div_log_out"><i className="material-icons i_log_out" onClick={ () => this.signOut()}>exit_to_app</i></div>
