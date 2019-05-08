import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import DesplegableInfo from '../../../Global/DesplegableInfo'

//import bbdd from '../../../Global/Data/resultados'

import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionTracking extends Component {
  constructor(props){
    super(props);
    this.state={
      status:this.props.status,
      dominio_a_buscar:this.props.dominio_a_buscar,
      keywords:this.props.keywords,

      id_tracking:''
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.status !== nextProps.status ||
        this.props.dominio_a_buscar !== nextProps.dominio_a_buscar ||
        this.props.keywords !== nextProps.keywords ){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.status!==newProps.status){ this.setState({status: newProps.status}) }
    if(this.props.dominio_a_buscar!==newProps.dominio_a_buscar){ this.setState({dominio_a_buscar: newProps.dominio_a_buscar}) }
    if(this.props.keywords!==newProps.keywords){ this.setState({keywords: newProps.keywords}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    var multiPath={};

    multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/activo`]=this.state.status==='Activado'?true:false
    //multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/keywords`]=this.state.keywords
    multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/dominio_a_buscar`]=this.state.dominio_a_buscar

    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})


  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.tracking.edit.info || (this.props.empleados && this.props.empleados[this.props.empleado.id_empleado]);
    } catch (e) {}

    var edited = false;
    if(this.props.status!==this.state.status ||
       this.props.dominio_a_buscar!==this.state.dominio_a_buscar ||
       this.props.keywords!==this.state.keywords){
      edited = true;
    }

    var lista_keywords = '', i=0
    Object.entries(this.state.keywords).forEach(([k,a])=>{
      lista_keywords = lista_keywords + a.keyword;
      if(i<Object.keys(this.state.keywords).length-1){ lista_keywords=lista_keywords + ', ';}
      i++
    })

    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del tracking</p>

        {/*Estado*/}



        {/*follows y no follows*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio?'':'block'}`} lista={data.estados_act_des} title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput title='Dominio a buscar' _class_container={this.state.dominio_a_buscar.trim()===''? 'error-form-input':null}  type={`${privilegio?'':'block'}`}  text={this.state.dominio_a_buscar.toString()} changeValue={dominio_a_buscar=>{this.setState({dominio_a_buscar})}} />

        </div>
        <DesplegableInfo type={`block`}  lista={this.state.keywords}
          title='Keywords'
          number={Object.keys(this.state.keywords).length}
          text={lista_keywords}
          objecto={this.state.keywords}
          changeValor={(keywords)=>this.setState({keywords})}
          nuevo={this.state.nuevoAnchor}
          setNuevo={(nuevo)=>this.setNuevoAnchor(nuevo)}
          deleteItem = {(id)=>this.deleteItemAnchor(id)}

        />

      </div>
    )
  }
}

export default InformacionTracking
