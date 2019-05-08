import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import { connect } from 'react-redux';
import InformacionLinkbuilding from './InformacionLinkbuilding'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import dotProp from 'dot-prop-immutable';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionEmpleados extends Component {
  constructor(props){
    super(props);
    this.state={
      empleados:this.props.empleados,
      all_empleados:this.all_empleados,
      follows:this.props.follows,
      nofollows:this.props.nofollows,
      show_empleados: false,
      fecha : new Date().getFullYear() + '-' + ( (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1) ),
      empleados_eliminados:{}
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.empleados !== nextProps.empleados ||
      this.props.all_empleados !== nextProps.all_empleados){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.empleados!==newProps.empleados){ this.setState({empleados: newProps.empleados}) }
    if(this.props.all_empleados!==newProps.all_empleados){ this.setState({all_empleados: newProps.all_empleados}) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var empleados = this.state.empleados, multiPath={}, error=false


    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_paid`]=empleados

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})


  }

  openEmpleados = () => {
    this.setState({show_empleados:true})
  }

  addEmpleado = (id) =>{
    if(!this.state.empleados[id]){
      var multiPath = {}
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_paid/${id}`]={
        nombre:this.props.empleados_disponibles[id].valor ,
        id_empleado:id
      }

      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})
    }
  }

  deleteEmpleado = (id_empleado) => {
    var empleados_eliminados = this.state.empleados_eliminados //dotProp.set(this.state.empleados_eliminado, `${id_empleado}.eliminado` ,true);

    empleados_eliminados[id_empleado]=true

    var empleados = dotProp.delete(this.state.empleados, `${id_empleado}`);

    this.setState({empleados, empleados_eliminados})
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.empleados;
    } catch (e) {}

    var edited = false;
    if(this.props.empleados!==this.state.empleados){
      edited = true;
    }

    return(
      <div className='sub-container-informacion'>
        {privilegio?
          edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/>
          :
            <div className='settings-panels'>
              <div className='div-save-icon pr' onClick={()=>this.openEmpleados()}>
                <i className="material-icons">add</i>
                {this.state.show_empleados?
                  <PopUpLista selectOpcion={(id)=>{this.addEmpleado(id);}} opciones={this.props.empleados_disponibles} _class='opciones-search-show position-add-enlaces' close={()=>this.setState({show_empleados:false})}/>:null
                }

              </div>
            </div>
        :null}



        <p className='title-informacion-alumno'>3. Empleados</p>

        <div className='ei-parent'>

        {this.state.empleados && Object.keys(this.state.empleados).length>0?
          Object.entries(this.state.empleados).map(([k,e])=>{
            return(
              <EmpleadoItem key={k}
                empleado={this.props.all_empleados[k]}
                deleteEmpleado = {()=>this.deleteEmpleado(k)}
                privilegio={privilegio}
                />
            )

          })
        :
          <div className="div_info_panel_linkbuilding">No hay empleados asignados</div>
        }

        </div>

      </div>
    )
  }
}

export default InformacionEmpleados
