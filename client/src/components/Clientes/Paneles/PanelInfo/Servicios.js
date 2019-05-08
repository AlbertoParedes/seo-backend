import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class Servicios extends Component {
  constructor(props){
    super(props);
    this.state={
      tracking:this.props.tracking,
      linkbuilfing_free:this.props.linkbuilfing_free,
      linkbuilfing_paid:this.props.linkbuilfing_paid,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.tracking !== nextProps.tracking ||
        this.props.linkbuilfing_free !== nextProps.linkbuilfing_free ||
        this.props.horas_semanales !== nextProps.horas_semanales){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.tracking!==newProps.tracking){ this.setState({tracking: newProps.tracking}) }
    if(this.props.linkbuilfing_free!==newProps.linkbuilfing_free){ this.setState({linkbuilfing_free: newProps.linkbuilfing_free}) }
    if(this.props.linkbuilfing_paid!==newProps.linkbuilfing_paid){ this.setState({linkbuilfing_paid: newProps.linkbuilfing_paid}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    var multiPath = {};

    var tracking = this.state.tracking==='Activado'?true:false
    var linkbuilfing_free = this.state.linkbuilfing_free==='Activado'?true:false
    var linkbuilfing_paid = this.state.linkbuilfing_paid==='Activado'?true:false

    if(linkbuilfing_free){
      try { var m = this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[functions.getTodayDate()]
      } catch (e) {
        multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${[functions.getTodayDate()]}`]={
          comentario:'',
          follows:this.props.cliente_seleccionado.follows,
          nofollows:this.props.cliente_seleccionado.nofollows
        }
      }
    }

    multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/activo`]=tracking
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/activo`]=linkbuilfing_free
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/activo`]=linkbuilfing_paid

    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})


  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.info_cliente.edit.servicios;
    } catch (e) {}

    var edited = false;
    if(this.props.tracking!==this.state.tracking ||
       this.props.linkbuilfing_free!==this.state.linkbuilfing_free ||
       this.props.linkbuilfing_paid!==this.state.linkbuilfing_paid){
      edited = true;
    }
    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>2. Servicios</p>

        {/*TRACKING*/}
        <SimpleInputDesplegable type={`${privilegio?'':'block'}`} _class='div_text_mitad' lista={data.estados_servicios} title='Tracking'  text={this.state.tracking} changeValor={(tracking)=>this.setState({tracking})}/>

        {/*Tracking free y de pago y Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio?'':'block'}`} lista={data.estados_servicios} title='Linkbuilding gratuito'  text={this.state.linkbuilfing_free} changeValor={(linkbuilfing_free)=>this.setState({linkbuilfing_free})}/>
          <SimpleInputDesplegable type={`${privilegio?'':'block'}`} lista={data.estados_servicios} title='Linkbuilding de pago'  text={this.state.linkbuilfing_paid} changeValor={(linkbuilfing_paid)=>this.setState({linkbuilfing_paid})}/>
        </div>

      </div>
    )
  }
}

export default Servicios
