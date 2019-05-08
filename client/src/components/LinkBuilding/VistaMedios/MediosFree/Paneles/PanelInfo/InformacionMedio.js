import React,{Component} from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import Switch from '../../../../../Global/Switch'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionMedio extends Component {
  constructor(props){
    super(props);
    this.state={
      web:this.props.web,
      dr:this.props.dr,
      ur:this.props.ur,
      status:this.props.status,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.web !== nextProps.web ||
        this.props.dr !== nextProps.dr ||
        this.props.ur !== nextProps.ur ||
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
    if(this.props.dr!==newProps.dr){ this.setState({dr: newProps.dr}) }
    if(this.props.ur!==newProps.ur){ this.setState({ur: newProps.ur}) }
    if(this.props.status!==newProps.status){ this.setState({status: newProps.status}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    var multiPath={};

    var web_repetida =  Object.entries(this.props.medios).some(([k,c])=>{
      var web_encontrada = Object.entries(c.medios).some(([k2,m])=>{ return functions.getDominio(m.web) === functions.getDominio(this.state.web) && k2!==this.props.id_medio })
      if(web_encontrada) return true
      return false
    })
    if(web_repetida){
      console.log('Este cliente ya existe');
      return false;
    }else if(!functions.isLink(this.state.web)){
      console.log('La web del cliente debe empezar por http:// o https:// y contener un " . "');
      return false;
    }
    else if( this.state.web.trim()===''){
      //this.props.mensajeInformativo('Exiten errores en los campos')
      console.log('Existen errores en los campos');
      return false;
    }

    var multiPath = {};
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/web`]=this.state.web.trim();
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/dr`]=this.state.dr.trim()!==''?(+this.state.dr):null
    multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/ur`]=this.state.ur.trim()!==''?(+this.state.ur):null

    var activo = false, eliminado=false;
    if(this.state.status==='Eliminado'){
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/eliminado`]=true
    }else if(this.state.status==='Activado'){
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/activo`]=true
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/eliminado`]=false
    }else if(this.state.status==='Desactivado'){
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/activo`]=false
      multiPath[`Servicios/Linkbuilding/Free/Medios/categorias/${this.props.categoria}/medios/${this.props.id_medio}/eliminado`]=false
    }

    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})



  }

  render() {
    var edited = false;
    if(this.props.web!==this.state.web ||
       this.props.dr!==this.state.dr ||
       this.props.ur!==this.state.ur ||
       this.props.status!==this.state.status
      ){
      edited = true;
    }
    //comprobar que el cliente no esta repetido
    var web_repetida =  Object.entries(this.props.medios).some(([k,c])=>{
      var web_encontrada = Object.entries(c.medios).some(([k2,m])=>{ return functions.getDominio(m.web) === functions.getDominio(this.state.web) && k2!==this.props.id_medio })
      if(web_encontrada) return true
      return false
    })
    var isLink = functions.isLink(this.state.web)

    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del medio</p>

        {/*ID*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable lista={data.estados} title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput type='block' title='Código' text={this.props.id_medio}/>
        </div>


        {/*URL*/}
        <div className='col-2-input'>
          <SimpleInput  title='Web del nuevo medio' _class_container={this.state.web.trim()==='' || web_repetida || !isLink ? 'error-form-input':null}  text={this.state.web} changeValue={web=>{this.setState({web})}}/>
        </div>

        {/*dr*/}
        <div className='col-2-input'>
          <SimpleInput type='int' title='DR' _class_container={this.state.dr.trim()==='' ? 'error-form-input':null}  text={this.state.dr.toString()} changeValue={dr=>{this.setState({dr})}}/>
          <SimpleInput type='int' title='UR' _class_container={this.state.ur.trim()==='' ? 'error-form-input':null}  text={this.state.ur.toString()} changeValue={ur=>{this.setState({ur})}}/>
        </div>

        {/*ur y Estado*/}



      </div>
    )
  }

}
function mapStateToProps(state){return{ medios: state.linkbuilding.medios.tipos.free.medios}}
export default connect(mapStateToProps)(InformacionMedio);
