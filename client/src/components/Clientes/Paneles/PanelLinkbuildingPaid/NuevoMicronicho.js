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

class NuevoMicronicho extends Component {
  constructor(props){
    super(props);
    this.state={
      web:''
    }
  }

  guardarMedio = (e) => {

    var micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs?this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs:{},
        web_repetida = false

    web_repetida =  Object.entries(micronichos).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) })

    var multiPath={};

    if(web_repetida){
      console.log('Este micronicho ya existe');
      return false;
    }else if(!functions.isLink(this.state.web)){
      console.log('La web del micronicho debe empezar por http:// o https:// y contener un " . "');
      return false;
    }
    else if( this.state.web.trim()===''){
      //this.props.mensajeInformativo('Exiten errores en los campos')
      console.log('Existen errores en los campos');
      return false;
    }

    var multiPath = {};
    var key = db.child(`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs`).push().key;
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/micronichos/webs/${key}`]={
      activo:true,
      medios_usados:{},
      presupuesto_dedicado:false,
      tipo_de_presupuesto:'grupal',
      web:this.state.web.trim()
    }

    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{
      console.log('Ok');
      e.stopPropagation();this.props.close();
    })
    .catch(err=>{console.log(err);})



  }


  render() {
    var micronichos = this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs?this.props.cliente_seleccionado.servicios.linkbuilding.paid.micronichos.webs:{},
        web_repetida = false

    web_repetida =  Object.entries(micronichos).some(([k,c])=>{ return functions.getDominio(c.web) === functions.getDominio(this.state.web) || functions.getDominio(this.props.cliente_seleccionado.web)===functions.getDominio(this.state.web) })
    var isLink = functions.isLink(this.state.web)
    return(
      <div className='container-opt-search nuevos-enlaces-paid-medios'>
        <div className='opciones-search-popup opciones-search-show-popup pop-up-enlaces-nuevos pop-up-medios-paid-nuevos'>
          <div className='size-medios-popup scroll-bar-exterior'>

            <div className="title-pop-up title-center-pop-up">Micronicho nuevo</div>

            <SimpleInput  title='Web del nuevo micronicho' _class_container={this.state.web.trim()==='' || web_repetida || !isLink ? 'error-form-input':null}  text={this.state.web} changeValue={web=>{this.setState({web})}}/>

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

function mapStateToProps(state){return{ cliente_seleccionado: state.cliente_seleccionado}}
export default connect(mapStateToProps)(NuevoMicronicho);
