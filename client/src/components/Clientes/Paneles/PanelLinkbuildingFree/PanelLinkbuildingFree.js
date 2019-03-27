import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import { connect } from 'react-redux';
import InformacionLinkbuilding from './InformacionLinkbuilding'
import InformacionEmpleados from './InformacionEmpleados'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import dotProp from 'dot-prop-immutable';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class PanelLinkbuildingFree extends Component {



  render(){
    console.log(this.props.cliente_seleccionado);
    return(
      <div className='container-informacion'>

        <InformacionLinkbuilding
          status={this.props.cliente_seleccionado.servicios.linkbuilding.free.activo?'Activo':'Parado'}
          follows={this.props.cliente_seleccionado.follows.toString().toLowerCase()}
          nofollows={this.props.cliente_seleccionado.nofollows.toString().toLowerCase()}
        />

        <InformacionEmpleados
          empleados={this.props.cliente_seleccionado.empleados && this.props.cliente_seleccionado.empleados.linkbuilding_free ? this.props.cliente_seleccionado.empleados.linkbuilding_free: false}
          all_empleados={this.props.all_empleados}
          follows={this.props.cliente_seleccionado.follows}
          nofollows={this.props.cliente_seleccionado.nofollows}
          cliente_seleccionado={this.props.cliente_seleccionado}
          empleados_disponibles={this.props.empleados_disponibles}
        />

        <InformacionAdicional />


      </div>
    )
  }

}

function mapStateToProps(state){return{ cliente_seleccionado:state.cliente_seleccionado, all_empleados:state.empleados, empleados_disponibles:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros.empleados.items }}
export default connect(mapStateToProps)(PanelLinkbuildingFree);



class InformacionAdicional extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>3. Información adicional</p>

        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>

      </div>
    )
  }
}
