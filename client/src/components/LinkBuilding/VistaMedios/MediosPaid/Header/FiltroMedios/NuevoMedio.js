import React,{Component} from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import Switch from '../../../../../Global/Switch'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class NuevosEnlaces extends Component {
  constructor(props){
    super(props);
    this.state={
      web:''
    }
  }

  guardarMedio = (e) => {

    var multiPath={};

    var web_repetida = Object.entries(this.props.medios).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k!==this.props.id_medio })
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
    var key = db.child(`Servicios/Linkbuilding/Paid/Medios/medios/`).push().key;
    var medio = {
      id_medio:key,
      activo:true,
      descripcion:'',
      dominio:functions.getDominio(this.state.web.trim()),
      dr:0,
      ur:0,
      eliminado:false,
      enlaces:{},
      tematicas:{},
      web:this.state.web.trim()
    }
    multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${key}`]=medio

    console.log(multiPath);

      db.update(multiPath)
      .then(()=>{
        console.log('Ok');
        this.props.setMedioSeleccionadoPaid(medio)
        this.props.setPanelMediosPaidLinkbuilding('info')
        e.stopPropagation();this.props.close();
      })
      .catch(err=>{console.log(err);})



  }


  render() {
    var web_repetida =  Object.entries(this.props.medios).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) && k!==this.props.id_medio })
    var isLink = functions.isLink(this.state.web)
    return(
      <div className='container-opt-search nuevos-enlaces-paid-medios'>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos pop-up-medios-paid-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Medio nuevo</div>

            <SimpleInput  title='Web del nuevo medio' _class_container={this.state.web.trim()==='' || web_repetida || !isLink ? 'error-form-input':null}  text={this.state.web} changeValue={web=>{this.setState({web})}}/>

            <div className='btns-finalizar-add-medios-paid'>

              <div className="btn-cancelar-confirm" onClick={(e)=>{e.stopPropagation();this.props.close();}}>Cancelar</div>
              <div className="btn-aceptar-confirm" onClick={(e)=>this.guardarMedio(e)}>Guardar</div>

            </div>


          </div>




        </div>


      </div>
    )
  }
}

function mapStateToProps(state){return{ medios: state.linkbuilding.medios.tipos.paid.medios}}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(NuevosEnlaces);
