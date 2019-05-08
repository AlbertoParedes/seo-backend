import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import DesplegableInfo from '../../../Global/DesplegableInfo'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionAdicional extends Component {
  constructor(props){
    super(props);
    this.state={
      comentarios:this.props.comentarios
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.comentarios !== nextProps.comentarios){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.comentarios!==newProps.comentarios){ this.setState({comentarios: newProps.comentarios}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    var multiPath = {}
    multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/comentarios`] = this.state.comentarios.trim();

    db.update(multiPath)
    .then(()=>{
      console.log('OK');
    })
    .catch(err=>console.log(err))

  }

  callbackSwitch = (json) => {
    this.setState({micronichos:json.valor})
  }


  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.tracking.edit.info_adicional || (this.props.empleados && this.props.empleados[this.props.empleado.id_empleado]);
    } catch (e) {}


    var edited = false;
    if(this.props.comentarios!==this.state.comentarios){
      edited = true;
    }

    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>3. Información adicional</p>


        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios' type={`${privilegio?'':'block'}`} text={this.state.comentarios} changeValue={comentarios=>{this.setState({comentarios})}}/>


      </div>
    )
  }
}

export default InformacionAdicional
