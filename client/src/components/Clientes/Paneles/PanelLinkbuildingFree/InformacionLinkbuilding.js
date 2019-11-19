import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import { URLESTADOCLIENTE } from '../../../Global/Data/constants'
import * as functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../redux/actions';
import moment from 'moment';
import _ from 'underscore';
import firebase from '../../../../firebase/Firebase';
import $ from 'jquery'
import SideBar from './SideBar';


const db = firebase.database().ref();

class InformacionLinkbuilding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      follows: this.props.follows,
      nofollows: this.props.nofollows,
      seo: this.props.seo,
      enlaces_por_seo: this.props.enlaces_por_seo,
      estrategia: this.props.estrategia,
      showEstrategia:false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.status !== nextProps.status ||
      this.props.follows !== nextProps.follows ||
      this.props.nofollows !== nextProps.nofollows ||
      this.props.enlaces_por_seo !== nextProps.enlaces_por_seo ||
      this.props.estrategia !== nextProps.estrategia ||
      this.props.seo !== nextProps.seo) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {


    
    

    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
    if (this.props.follows !== newProps.follows) { this.setState({ follows: newProps.follows }) }
    if (this.props.nofollows !== newProps.nofollows) { this.setState({ nofollows: newProps.nofollows }) }
    if (!_.isEqual(this.state.enlaces_por_seo, newProps.enlaces_por_seo)) { this.setState({ enlaces_por_seo: newProps.enlaces_por_seo }) }
    if (this.props.seo !== newProps.seo) { this.setState({ seo: newProps.seo }) }
    if (!_.isEqual(this.props.estrategia, newProps.estrategia)) { this.setState({ estrategia: newProps.estrategia }) }

  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var fecha = moment().format('YYYY-MM');
    var enlaces_por_seo = this.state.enlaces_por_seo ? JSON.parse(JSON.stringify(this.state.enlaces_por_seo)) : false;

    if (this.state.follows.toString().includes('.') || this.state.follows.toString().includes(',') || this.state.follows.toString().trim() === '' || (+this.state.follows) < 0) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'El número de follows es incorrecto' })

      return false;
    } else if (this.state.nofollows.toString().includes('.') || this.state.nofollows.toString().includes(',') || this.state.nofollows.toString().trim() === '' || (+this.state.nofollows) < 0) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'El número de nofollows es incorrecto' })

      return false;
    }
    //comprobamos la estrategia
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
          isCorrect =  !Object.entries(estrategia.urls).some(([t,url])=> i !== t && url && u && functions.cleanProtocolo(url.url.toLowerCase())===functions.cleanProtocolo(u.url.toLowerCase()))
          if(isCorrect) isCorrect = functions.isLink(u.url)
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
    //console.log(isCorrect,estrategia);
    
    


    var multiPath = {};
    //si el seo se ha cambiado y antes era enterprise se tendrá que restar otra vez al bote 100€ y comprobar que no se hayan hecho ningun enlace, sino no te dejara cambiar de seo
    if (this.props.seo === 'Enterprise' && this.props.seo !== this.state.seo) {
      if (this.props.enlaces_por_seo.mensualidades[fecha].enlaces) {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Ya se han creado enlaces por tener seo Enterprise' })
        return false
      } else {
        enlaces_por_seo.bote = enlaces_por_seo.bote - 100;
        enlaces_por_seo.mensualidades[fecha] = null;
        if (!enlaces_por_seo.mensualidades || Object.keys(enlaces_por_seo.mensualidades).length === 1) {
          enlaces_por_seo.bote = null
        }
      }
    }



    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/activo`] = this.state.status === 'Activado' ? true : false
    multiPath[`Clientes/${this.props.id_cliente}/seo`] = this.state.seo
    multiPath[`Clientes/${this.props.id_cliente}/follows`] = (+this.state.follows)
    multiPath[`Clientes/${this.props.id_cliente}/nofollows`] = (+this.state.nofollows)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${functions.getTodayDate()}/follows`] = (+this.state.follows)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${functions.getTodayDate()}/nofollows`] = (+this.state.nofollows)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/estrategia`] = estrategia


    //si cambia los enlaces_por_seo(enterprise) se hara esto
    if (!_.isEqual(enlaces_por_seo, this.props.enlaces_por_seo)) {
      multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/paid/enlaces_por_seo/`] = enlaces_por_seo;
    }


    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.status !== this.state.status) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.status, this.state.status, 'status', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
    }
    if (this.props.seo !== this.state.seo) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.seo, this.state.seo, 'seo', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
    }
    if (this.props.follows !== this.state.follows) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.follows, this.state.follows, 'follows', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
    }
    if (this.props.nofollows !== this.state.nofollows) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.nofollows, this.state.nofollows, 'nofollows', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
    }

    if (!_.isEqual(estrategia, this.props.estrategia)) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.estrategia, estrategia, 'estrategia', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/linkbuilding_gratuito/${id_log}`)
    }


    const oldStatus = this.props.status;
    const newStatus = this.state.status;
    console.log(estrategia);

    
    
    db.update(multiPath)
      .then(() => {

        

        var data = {}
        if (oldStatus !== newStatus) {
          if (this.state.status === 'Activado') {
            data.subject = `LINKBUILDING GRATUITO ACTIVADO: ${this.props.clientes[this.props.id_cliente].web}`;
            data.status = 'good';
            data.frase = `El linkbuilding gratuito del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-good'>activado</span>`
          } else if (this.state.status === 'Desactivado') {
            data.subject = `LINKBUILDING GRATUITO DESCTIVADO: ${this.props.clientes[this.props.id_cliente].web}`
            data.status = 'warning'
            data.frase = `El linkbuilding gratuito del cliente <a href='${this.props.clientes[this.props.id_cliente].web}' class='link-cliente'>${this.props.clientes[this.props.id_cliente].web}</a> ha sido <span class='word-warning'>desactivado</span>`
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
        console.log(err);
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })

  }

  changeSeo = (seo) => {
    if (this.state.seo === seo) return false;
    var follows = 0, nofollows = 0, enlaces_por_seo = JSON.parse(JSON.stringify(this.state.enlaces_por_seo))
    if (seo === 'Lite') {
      follows = 3;
      nofollows = 5;
    } else if (seo === 'Pro') {
      follows = 4;
      nofollows = 10;
    } else if (seo === 'Premium') {
      follows = 6;
      nofollows = 15;
    } else if (seo === 'A medida') {
      follows = 0;
      nofollows = 0;
    }

    else if (seo === 'Professional') {
      follows = 0;
      nofollows = 0;
    } else if (seo === 'Business') {
      follows = 0;
      nofollows = 0;
    } else if (seo === 'Enterprise') {
      follows = 0;
      nofollows = 0;
      if (!enlaces_por_seo) {
        enlaces_por_seo = {
          bote: 100,
          mensualidades: {
            [moment().format('YYYY-MM')]: { seo: 'Enterprise', inversion_mensual: 100 }
          }
        }
      } else if (this.props.seo !== 'Enterprise') {
        enlaces_por_seo.bote += 100;
        enlaces_por_seo.mensualidades[moment().format('YYYY-MM')] = { seo: 'Enterprise', inversion_mensual: 100 }
      }

    }

    this.setState({ seo, follows, nofollows, enlaces_por_seo })
  }

  callBack = () => {
    this.setState({showEstrategia:false})
  }


  render() {

    var privilegio = false, privilegioEstrategia=false;
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_free.edit.info;
    } catch (e) { }
    try {
      privilegioEstrategia = this.props.empleado.privilegios.linkbuilding_free.edit.change_estrategia;
    } catch (e) { }
    

    var edited = false;
    if (this.props.status !== this.state.status ||
      this.props.follows.toString() !== this.state.follows.toString() ||
      this.props.nofollows.toString() !== this.state.nofollows.toString() ||
      !_.isEqual(this.props.enlaces_por_seo, this.state.enlaces_por_seo) ||
      !_.isEqual(this.props.estrategia, this.state.estrategia) ||
      this.props.seo !== this.state.seo) {
      edited = true;
    }


    const estrategiaView = () => {
      var isCorrect = true;
      var text = "Sin destinos asignados"
      if(Object.keys(this.state.estrategia).length>0 && Object.keys(this.state.estrategia.urls).length>0){
        isCorrect = !Object.entries(this.state.estrategia.urls).some(([i,o])=>{
          return (!functions.isLink(o.url) && o.url.trim()!=="") || ( ( o.url.trim()==="") && (o.keywords && Object.keys(o.keywords).length>0 && Object.entries(o.keywords).some(([i,k])=>k.keyword.trim()!==""))) ||  Object.entries(this.state.estrategia.urls).some(([j,o2])=> i!==j && o.url.trim()!==""  && functions.cleanProtocolo(o.url)===functions.cleanProtocolo(o2.url) )
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

    var enterprise = this.state.seo === 'Enterprise' && this.state.enlaces_por_seo && this.state.enlaces_por_seo.mensualidades && this.state.enlaces_por_seo.mensualidades[moment().format('YYYY-MM')]
    
    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        {/*Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} lista={data.estados_act_des} title='Estado' text={this.state.status} changeValor={(status) => this.setState({ status })} />
          <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} lista={data.seo} title='Seo' text={this.state.seo} changeValor={(seo) => this.changeSeo(seo)} />
        </div>


        {/*follows y no follows*/}
        <div className='col-2-input'>
          <SimpleInput title='Follows' _class_container={this.state.follows.toString().includes('.') || this.state.follows.toString().includes(',') || this.state.follows.toString().trim() === '' || (+this.state.follows) < 0 ? 'error-form-input' : null} type={`${privilegio /*&& this.state.seo==='A medida'*/ ? 'float' : 'block'}`} text={this.state.follows.toString()} changeValue={follows => { this.setState({ follows }) }} />
          <SimpleInput title='Nofollows' _class_container={this.state.nofollows.toString().includes('.') || this.state.nofollows.toString().includes(',') || this.state.nofollows.toString().trim() === '' || (+this.state.nofollows) < 0 ? 'error-form-input' : null} type={`${privilegio /*&& this.state.seo==='A medida'*/ ? 'float' : 'block'}`} text={this.state.nofollows.toString()} changeValue={nofollows => { this.setState({ nofollows }) }} />
        </div>

        {
          enterprise ?
          <div className='col-2-input'>
            <SimpleInput title='Bote según seo' type={`${privilegio ? 'block' : 'block'}`} text={this.state.enlaces_por_seo.bote.toString()} changeValue={enlaces_por_seo => { this.setState({ enlaces_por_seo }) }} />
            {estrategiaView()}
          </div>
          : estrategiaView()
        }
       

        {this.state.showEstrategia?
          <SideBar 
            idCliente={this.props.id_cliente}
            estrategia={this.state.estrategia}
            subtext={this.props.clientes[this.props.id_cliente].web}
            callBack={(list)=>{this.callBack()}}
            setNewEstrategia={estrategia=>this.setState({estrategia})}
            path={`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/estrategia/urls`}
            privilegio={privilegioEstrategia}
          />  
        :null}


      </div>
    )
  }
}

function mapStateToProps(state) { return { clientes: state.clientes, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(InformacionLinkbuilding);