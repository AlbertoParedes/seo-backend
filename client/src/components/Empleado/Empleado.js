import React, {Component} from 'react'
import HeaderTareas from './HeaderEmpleadoTareas/HeaderTareas'
import moment from 'moment'
import firebase from '../../firebase/Firebase';
import ListaTareas from './Paneles/PanelTareas/Lista'
import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux';
//import { setPanelTracking, setSearchTableClientesTracking, setSearchByTableClientesTracking, setPopUpInfo } from '../../../redux/actions';

const db = firebase.firestore(); 
class Empleado extends Component {

  constructor(props){
    super(props)
    this.state={
      tareasEmpleado: this.props.tareasEmpleado
    }
  }
  componentWillMount = () => {
    this.getTareas()
  }
  componentWillReceiveProps = (newProps) => {
    if(this.state.tareasEmpleado!==newProps.tareasEmpleado){
      this.setState({tareasEmpleado: newProps.tareasEmpleado},()=>{
        this.getTareas()
      })
    }
  }
  getTareas = () => {

    console.log(this.state.tareasEmpleado);
    
    


  }

  render(){
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >
        {/*HEADER*/}
        <HeaderTareas/>

        <div className='sub-container-panels'>
         {this.props.panel === 'tareas' ?
            <ListaTareas
              visibility={this.props.panel_clientes === 'tareas' ? true : false}
            />
            : null
          }
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    empleado: state.empleado,
    tareasEmpleado: state.panelEmpleado.tareasEmpleado,
    panel: state.panelEmpleado.panel
    
  }
}
//function matchDispatchToProps(dispatch) { return bindActionCreators({ setPanelTracking, setSearchTableClientesTracking, setSearchByTableClientesTracking, setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, null)(Empleado);