import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionLinkbuilding extends Component {
  constructor(props){
    super(props);
    this.state={
      status:this.props.status,
      bote:this.props.bote,
      beneficio:this.props.beneficio,
      inversion_mensual:this.props.inversion_mensual,
      porcentaje_perdida:this.props.porcentaje_perdida,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.status !== nextProps.status ||
        this.props.bote !== nextProps.bote ||
        this.props.beneficio !== nextProps.beneficio ||
        this.props.inversion_mensual !== nextProps.inversion_mensual ||
        this.props.porcentaje_perdida !== nextProps.porcentaje_perdida ){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.status!==newProps.status){ this.setState({status: newProps.status}) }
    if(this.props.bote!==newProps.bote){ this.setState({bote: newProps.bote}) }
    if(this.props.beneficio!==newProps.beneficio){ this.setState({beneficio: newProps.beneficio}) }
    if(this.props.inversion_mensual!==newProps.inversion_mensual){ this.setState({inversion_mensual: newProps.inversion_mensual}) }
    if(this.props.porcentaje_perdida!==newProps.porcentaje_perdida){ this.setState({porcentaje_perdida: newProps.porcentaje_perdida}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {
    var fechaMes = functions.getTodayDate()
    console.log(fechaMes);
    var preciosModificados = false
    try {
      if(this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].presupuestado_aparte || this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].subida_precios){
        preciosModificados = true
      }
    } catch (e) {}


    var multiPath={}

    /*if(this.props.bote!==this.state.bote){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+this.state.bote)
    }*/
    var bote = (+this.props.bote)
    var beneficio = (+this.state.beneficio)
    var inversion_mensual = (+this.state.inversion_mensual)
    var porcentaje_perdida = (+this.state.porcentaje_perdida)

    var inversion_mensual_old = this.props.inversion_mensual?(+this.props.inversion_mensual):0
    var beneficio_old = this.props.beneficio? (100-(+this.props.beneficio))/100  :0


    if(preciosModificados && (inversion_mensual_old!==inversion_mensual || beneficio_old!==beneficio) ){
      console.log('No se puede modificar porque hay precios modificados este mes');
      return false
    }


    if(inversion_mensual_old!==inversion_mensual || beneficio_old!==beneficio){
      //revertir la mensualidad añadida para poder restarle la nueva cantidad al bote
      bote = bote - inversion_mensual_old * beneficio_old;
      bote = bote + inversion_mensual * ((100-beneficio)/100)
    }

    if((+this.props.bote)!==(+bote)){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+bote)
    }else if((+this.props.bote)!==(+this.state.bote)){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+this.state.bote)
    }
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/activo`]=this.state.status==='Activado'?true:false

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/inversion_mensual`]=(+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/beneficio`]=(+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/porcentaje_perdida`]=(+porcentaje_perdida)

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/inversion_mensual`]=(+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/beneficio`]=(+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/porcentaje_perdida`]=(+porcentaje_perdida)

    console.log(multiPath);
    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})

  }

  cambiarNumeros = (valor,id) => {
    var num = functions.getNumber(valor)

    var decimales = num.toString().split('.');
    if(decimales[1] && decimales[1].length>2){
      return false
    }

     this.setState({[id]:num.toString()})
  }

  checkNumber = (valor) => {

    valor = functions.getNumber(valor)
    if( valor.toString().includes('.') || valor.toString().includes(',') ){
      var decimales = valor.toString().substring(valor.toString().indexOf('.'), valor.toString().length )
      if(decimales.length>2){
        return functions.getDecimcals(valor)
      }else{
        return valor
      }
    }else{
      return functions.getDecimcals(valor)
    }

    return '0'
  }


  render() {





    var bote = '0'
    bote = this.checkNumber(this.state.bote)

    var inversion_mensual = '0'
    inversion_mensual = this.checkNumber(this.state.inversion_mensual)

    var beneficio = '0'
    beneficio = this.checkNumber(this.state.beneficio)

    var porcentaje_perdida = '0'
    porcentaje_perdida = this.checkNumber(this.state.porcentaje_perdida)
    console.log(porcentaje_perdida);

    var edited = false;
    if(this.props.status!==this.state.status ||
       this.checkNumber(this.props.bote)!==bote ||
       this.checkNumber(this.props.beneficio)!==beneficio ||
       this.checkNumber(this.props.inversion_mensual)!==inversion_mensual ||
       this.checkNumber(this.props.porcentaje_perdida)!==porcentaje_perdida){
      edited = true;
    }

    var privilegio = false, privilegio_bote = false;
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.change_inversion;
      privilegio_bote = this.props.empleado.privilegios.linkbuilding_paid.edit.change_bote;
    } catch (e) {}

    if(privilegio_bote && (this.checkNumber(this.props.beneficio)!==beneficio || this.checkNumber(this.props.inversion_mensual)!==inversion_mensual)){
      privilegio_bote = false
    }
    if(privilegio && bote!==this.checkNumber(this.props.bote) ){
      privilegio = false
    }



    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        <SimpleInputDesplegable type={`${privilegio?'':'block'}`} _class='div_text_mitad' lista={data.estados_act_des} title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>

        {/*Estado y inversion_mensual*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio?'float':'block'}`} title='Inversión mensual (€)'  text={inversion_mensual.toString()} changeValue={(inversion_mensual)=>this.cambiarNumeros(inversion_mensual,'inversion_mensual')} />
          <SimpleInput type={`${privilegio?'float':'block'}`} title='Beneficio (%)'  text={beneficio.toString()} changeValue={(beneficio)=>this.cambiarNumeros(beneficio,'beneficio')} />
        </div>

        {/*INVERSION MENSUAL Y BENEFICIO*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio?'float':'block'}`} title='Porcentaje de pérdida (%)' text={porcentaje_perdida.toString()} changeValue={(porcentaje_perdida)=>this.cambiarNumeros(porcentaje_perdida,'porcentaje_perdida')}/>
          <SimpleInput type={`${privilegio_bote?'float':'block'}`}  _class_input='dni-input' title='Bote (€)'  text={bote.toString()} changeValue={(bote)=>this.cambiarNumeros(bote,'bote')}/>
        </div>


      </div>
    )
  }
}

export default InformacionLinkbuilding
