import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import {cleanProtocolo, getTodayDate, isLink, createLogs, getNumber, checkNumber} from '../../../Global/functions'
import { URLESTADOCLIENTE } from '../../../Global/Data/constants'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import SideBar from '../PanelLinkbuildingFree/SideBar'
import _ from 'underscore';
import $ from 'jquery'
import Switch from '../../../Global/Switch'

const db = firebase.database().ref();

class InformacionLinkbuilding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      bote: this.props.bote,
      beneficio: this.props.beneficio,
      inversion_mensual: this.props.inversion_mensual,
      porcentaje_perdida: this.props.porcentaje_perdida,
      estrategia: this.props.estrategia,
      showEstrategia: false,
      micronichos: this.props.micronichos,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.status !== nextProps.status ||
      this.props.bote !== nextProps.bote ||
      this.props.beneficio !== nextProps.beneficio ||
      this.props.inversion_mensual !== nextProps.inversion_mensual ||
      this.props.micronichos !== nextProps.micronichos ||
      this.props.estrategia !== nextProps.estrategia ||
      this.props.porcentaje_perdida !== nextProps.porcentaje_perdida) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
    if (this.props.bote !== newProps.bote) { this.setState({ bote: newProps.bote }) }
    if (this.props.beneficio !== newProps.beneficio) { this.setState({ beneficio: newProps.beneficio }) }
    if (this.props.inversion_mensual !== newProps.inversion_mensual) { this.setState({ inversion_mensual: newProps.inversion_mensual }) }
    if (this.props.porcentaje_perdida !== newProps.porcentaje_perdida) { this.setState({ porcentaje_perdida: newProps.porcentaje_perdida }) }
    if (!_.isEqual(this.props.estrategia, newProps.estrategia)) { this.setState({ estrategia: newProps.estrategia }) }
    if (this.props.micronichos !== newProps.micronichos) { this.setState({ micronichos: newProps.micronichos }) }

  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {
    var fechaMes = getTodayDate()

    var preciosModificados = false
    try {
      if (this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].presupuestado_aparte || this.props.cliente_seleccionado.servicios.linkbuilding.paid.home.mensualidades[fechaMes].subida_precios) {
        preciosModificados = true
      }
    } catch (e) { }


    var multiPath = {}

    /*if(this.props.bote!==this.state.bote){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`]=(+this.state.bote)
    }*/
    var bote = (+this.props.bote)
    var beneficio = (+this.state.beneficio)
    var inversion_mensual = (+this.state.inversion_mensual)
    var porcentaje_perdida = (+this.state.porcentaje_perdida)

    var inversion_mensual_old = this.props.inversion_mensual ? (+this.props.inversion_mensual) : 0
    var beneficio_old = this.props.beneficio ? (100 - (+this.props.beneficio)) / 100 : 0


    if (preciosModificados && (inversion_mensual_old !== inversion_mensual || beneficio_old !== beneficio)) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se puede modificar porque hay precios modificados este mes' })
      return false
    }

    //comprobamos la estrategia ------------------------------------------------------------------------------------------------------------------
    var isCorrect = true
    var estrategia = JSON.parse(JSON.stringify(this.state.estrategia))
    if(Object.keys(estrategia).length>0 && estrategia.urls){
      //recorremos todas las urls 
      Object.entries(estrategia.urls).forEach(([i,u])=>{
        if(!isCorrect) return false
        //si la url esta vacia no podremos guardar los datos
        if(u.url.trim()===""){
          if(u.keywords && Object.entries(u.keywords).some(([i,k])=>k.keyword.trim()!=="")){
            isCorrect = false
          }else{
            estrategia.urls[i]=null
          }
        }else if(estrategia.urls && Object.keys(estrategia.urls).length>0){
          isCorrect =  !Object.entries(estrategia.urls).some(([t,url])=> i !== t && url && u && cleanProtocolo(url.url.toLowerCase())===cleanProtocolo(u.url.toLowerCase()))
          if(isCorrect) isCorrect = isLink(u.url)
        }
        if(isCorrect && u && u.keywords && Object.keys(u.keywords).length>0){
          //recorremos las keywords de las url para ver si hay vacios, y en el caso de que haya vacios remplazarlos por null para asi, no guardarlos en la bbss
          Object.entries(u.keywords).forEach(([j,k])=>{
            if(k.keyword.trim()===''){ k.keyword = null; }
          })
        }

      })
    }
    if(!isCorrect){
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Existen errores en la estrategia' })
      return false
    }
    //----------------------------------------------------------------------------------------------------------------------------------------


    if (inversion_mensual_old !== inversion_mensual || beneficio_old !== beneficio) {
      //revertir la mensualidad añadida para poder restarle la nueva cantidad al bote
      bote = bote - inversion_mensual_old * beneficio_old;
      bote = bote + inversion_mensual * ((100 - beneficio) / 100)
    }

    if ((+this.props.bote) !== (+bote)) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`] = (+bote)
    } else if ((+this.props.bote) !== (+this.state.bote)) {
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/bote`] = (+this.state.bote)
    }
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/activo`] = this.state.status === 'Activado' ? true : false

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/inversion_mensual`] = (+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/beneficio`] = (+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/porcentaje_perdida`] = (+porcentaje_perdida)

    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/inversion_mensual`] = (+inversion_mensual)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/beneficio`] = (+beneficio)
    multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/home/mensualidades/${fechaMes}/porcentaje_perdida`] = (+porcentaje_perdida)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/estrategia`] = estrategia
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/micronichos/activo`] = this.state.micronichos;

    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.status !== this.state.status) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, this.props.status, this.state.status, 'status', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (inversion_mensual_old !== inversion_mensual) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, inversion_mensual_old, inversion_mensual, 'inversion_mensual', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (this.props.beneficio !== this.state.beneficio) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, this.props.beneficio ? this.props.beneficio : 0, this.state.beneficio ? this.state.beneficio : 0, 'beneficio', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if ((+this.props.porcentaje_perdida) !== porcentaje_perdida) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, (+this.props.porcentaje_perdida), porcentaje_perdida, 'porcentaje_perdida', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if ((+this.props.bote) !== (+bote)) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, (+this.props.bote), (+bote), 'bote', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (!_.isEqual(estrategia, this.props.estrategia)) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, this.props.estrategia, estrategia, 'estrategia', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    if (this.props.micronichos !== this.state.micronichos) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid`).push().key;
      createLogs(multiPath, timestamp, this.props.micronichos, this.state.micronichos, 'micronichos', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_paid/${id_log}`)
    }

    const oldStatus = this.props.status;
    const newStatus = this.state.status;
    db.update(multiPath)
      .then(() => {

        var data = {}
        if (oldStatus !== newStatus) {
          if (this.state.status === 'Activado') {
            data.subject = `LINKBUILDING DE PAGO ACTIVADO: ${this.props.clientes[this.props.id_cliente].web}`;
            data.status = 'good';
            data.frase = `El linkbuilding de pago del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-good'>activado</span>`
          } else if (this.state.status === 'Desactivado') {
            data.subject = `LINKBUILDING DE PAGO DESCTIVADO: ${this.props.clientes[this.props.id_cliente].web}`
            data.status = 'warning'
            data.frase = `El linkbuilding de pago del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-warning'>desactivado</span>`
          }

          data.empleado = this.props.empleado.nombre + " " + this.props.empleado.apellidos;
          data.cliente = this.props.clientes[this.props.id_cliente].web;

          $.post(URLESTADOCLIENTE, data, (request, data) => {
            //console.log(request, data);
          })

        }

        if(estrategia.urls){
          var vacio = true
          Object.entries(estrategia.urls).forEach(([i,o])=>{
            if(o===null){
              delete estrategia.urls[i]
            }else{
              vacio = false
            }
          })
          this.setState({estrategia: vacio?{}:estrategia})
        }

        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })

      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }

  cambiarNumeros = (valor, id) => {
    var num = getNumber(valor)

    var decimales = num.toString().split('.');
    if (decimales[1] && decimales[1].length > 2) {
      return false
    }

    this.setState({ [id]: num.toString() })
  }

  callBack = () => {
    this.setState({showEstrategia:false})
  }

  callbackSwitch = (json) => {
    this.setState({ micronichos: json.valor })
  }


  render() {





    var bote = '0'
    bote = checkNumber(this.state.bote)

    var inversion_mensual = '0'
    inversion_mensual = checkNumber(this.state.inversion_mensual)

    var beneficio = '0'
    beneficio = checkNumber(this.state.beneficio)

    var porcentaje_perdida = '0'
    porcentaje_perdida = checkNumber(this.state.porcentaje_perdida)


    var edited = false;
    if (this.props.status !== this.state.status ||
      checkNumber(this.props.bote) !== bote ||
      checkNumber(this.props.beneficio) !== beneficio ||
      checkNumber(this.props.inversion_mensual) !== inversion_mensual ||
      this.props.micronichos !== this.state.micronichos ||
      !_.isEqual(this.props.estrategia, this.state.estrategia) ||
      checkNumber(this.props.porcentaje_perdida) !== porcentaje_perdida) {
      edited = true;
    }

    var privilegio = false, privilegio_bote = false, privilegioEstrategia=false;
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_paid.edit.change_inversion;
      privilegio_bote = this.props.empleado.privilegios.linkbuilding_paid.edit.change_bote;
    } catch (e) { }
    try {
      privilegioEstrategia = this.props.empleado.privilegios.linkbuilding_paid.edit.change_estrategia;
    } catch (e) { }

    if (privilegio_bote && (checkNumber(this.props.beneficio) !== beneficio || checkNumber(this.props.inversion_mensual) !== inversion_mensual)) {
      privilegio_bote = false
    }
    if (privilegio && bote !== checkNumber(this.props.bote)) {
      privilegio = false
    }

    const estrategiaView = () => {
      var isCorrect = true;
      var text = "Sin destinos asignados"
      if(Object.keys(this.state.estrategia).length>0 && Object.keys(this.state.estrategia.urls).length>0){
        isCorrect = !Object.entries(this.state.estrategia.urls).some(([i,o])=>{
          return (!isLink(o.url) && o.url.trim()!=="") || ( ( o.url.trim()==="") && (o.keywords && Object.keys(o.keywords).length>0 && Object.entries(o.keywords).some(([i,k])=>k.keyword.trim()!==""))) ||  Object.entries(this.state.estrategia.urls).some(([j,o2])=> i!==j && o.url.trim()!==""  && cleanProtocolo(o.url)===cleanProtocolo(o2.url) )
        })
        text = ""
        Object.entries(this.state.estrategia.urls).forEach(([i,o])=>{
          if(o.url.trim()!=='')
            text= `${text}${text!==''?',':''} ${o.url.trim()}`
        })
      }
          
      return(
        <div className={`container-simple-input`} onClick={()=>this.setState({showEstrategia:true})}>
        <div className="title-input">Destinos y anchors:</div>
        <div className={`container-input ${!isCorrect?'error-form-input':''}`}>
          <input className="curso-pointer" readonly="" value={text}/>
        </div>
      </div>
      )
    }



    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} _class='div_text_mitad' lista={data.estados_act_des} title='Estado' text={this.state.status} changeValor={(status) => this.setState({ status })} />

        {/*Estado y inversion_mensual*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Inversión mensual (€)' text={inversion_mensual.toString()} changeValue={(inversion_mensual) => this.cambiarNumeros(inversion_mensual, 'inversion_mensual')} />
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Beneficio (%)' text={beneficio.toString()} changeValue={(beneficio) => this.cambiarNumeros(beneficio, 'beneficio')} />
        </div>

        {/*INVERSION MENSUAL Y BENEFICIO*/}
        <div className='col-2-input'>
          <SimpleInput type={`${privilegio ? 'float' : 'block'}`} title='Porcentaje de pérdida (%)' text={porcentaje_perdida.toString()} changeValue={(porcentaje_perdida) => this.cambiarNumeros(porcentaje_perdida, 'porcentaje_perdida')} />
          <SimpleInput type={`${privilegio_bote ? 'float' : 'block'}`} _class_input='dni-input' title='Bote (€)' text={bote.toString()} changeValue={(bote) => this.cambiarNumeros(bote, 'bote')} />
        </div>

        {estrategiaView(true)}

        {this.state.showEstrategia?
          <SideBar 
            idCliente={this.props.id_cliente}
            estrategia={this.state.estrategia}
            subtext={this.props.clientes[this.props.id_cliente].web}
            callBack={(list)=>{this.callBack()}}
            setNewEstrategia={estrategia=>this.setState({estrategia})}
            path={`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/home/estrategia/urls`}
            privilegio={privilegioEstrategia}
          />  
        :null}


        {/*BLOG*/}
        <div className='display_flex container-simple-input pdd-top-40'>
          <div className="title-input align-center mg-right-10 pdd-v-0">Micronichos</div>
          <span className='options-switch'>NO</span>
          <Switch class_div='switch-table' valor={this.state.micronichos} json={{ id: 'micronichos' }} type={`${privilegio ? '' : 'block'}`} callbackSwitch={(json) => this.callbackSwitch(json)} />
          <span className='options-switch'>SI</span>
        </div>


      </div>
    )
  }
}

function mapStateToProps(state) { return { clientes: state.clientes, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(InformacionLinkbuilding);
