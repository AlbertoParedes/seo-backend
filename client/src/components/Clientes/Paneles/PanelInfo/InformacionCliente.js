import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionCliente extends Component {
  constructor(props){
    super(props);
    this.state={
      web:this.props.web,
      nombre:this.props.nombre,
      tipo:this.props.tipo,
      status:this.props.status,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.web !== nextProps.web ||
        this.props.nombre !== nextProps.nombre ||
        this.props.tipo !== nextProps.tipo ||
        this.props.status !== nextProps.status
      ){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.web!==newProps.web){ this.setState({web: newProps.web}) }
    if(this.props.nombre!==newProps.nombre){ this.setState({nombre: newProps.nombre}) }
    if(this.props.tipo!==newProps.tipo){ this.setState({tipo: newProps.tipo}) }
    if(this.props.status!==newProps.status){ this.setState({status: newProps.status}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    var multiPath={};

    var web_repetida =  Object.entries(this.props.clientes).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k!==this.props.id_cliente })
    if(web_repetida){
      console.log('Este cliente ya existe');
      return false;
    }else if(!functions.isLink(this.state.web)){
      console.log('La web del cliente debe empezar por http:// o https:// y contener un " . "');
      return false;
    }
    else if( this.state.web.trim()==='' || this.state.nombre.trim()==='' ){
      //this.props.mensajeInformativo('Exiten errores en los campos')
      console.log('Existen errores en los campos');
      return false;
    }



    var multiPath = {};
    multiPath[`Clientes/${this.props.id_cliente}/web`]=this.state.web.trim();
    multiPath[`Clientes/${this.props.id_cliente}/nombre`]=this.state.nombre.trim();
    multiPath[`Clientes/${this.props.id_cliente}/tipo`]=this.state.tipo;

    var activo = false, eliminado=false;
    if(this.state.status==='Eliminado'){
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`]=true
    }else if(this.state.status==='Activado'){
      multiPath[`Clientes/${this.props.id_cliente}/activo`]=true
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`]=false
    }else if(this.state.status==='Desactivado'){
      multiPath[`Clientes/${this.props.id_cliente}/activo`]=false
      multiPath[`Clientes/${this.props.id_cliente}/eliminado`]=false
    }
    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})



  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.info_cliente.edit.info;
    } catch (e) {}

    var edited = false;
    if(this.props.web!==this.state.web ||
       this.props.nombre!==this.state.nombre ||
       this.props.tipo!==this.state.tipo ||
       this.props.status!==this.state.status
      ){
      edited = true;
    }

    //comprobar que el cliente no esta repetido
    var web_repetida =  Object.entries(this.props.clientes).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k!==this.props.id_cliente })
    var isLink = functions.isLink(this.state.web)

    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del cliente</p>

        {/*ID*/}

        <SimpleInputDesplegable lista={data.estados} type={`${privilegio?'':'block'}`} _class='div_text_mitad' title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>


        {/*URL*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio?'':'block'}`} title='Web del cliente' _class_container={this.state.web.trim()==='' || web_repetida || !isLink ? 'error-form-input':null}  text={this.state.web} changeValue={web=>{this.setState({web})}}/>
        </div>

        {/*NOMBRE*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio?'':'block'}`} title='Nombre del cliente' _class_container={this.state.nombre.trim()==='' ? 'error-form-input':null}  text={this.state.nombre} changeValue={nombre=>{this.setState({nombre})}}/>
        </div>

        {/*tipo y Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio?'object':'block'}`} lista={data.tipos} title='Tipo de cliente'  text={data.tipos[this.state.tipo].texto} changeValor={(tipo)=>this.setState({tipo})}/>
          <SimpleInput type='block' title='Código' text={this.props.id_cliente}/>
        </div>


      </div>
    )
  }

}
function mapStateToProps(state){return{ clientes:state.clientes }}
export default connect(mapStateToProps)(InformacionCliente);
