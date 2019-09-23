import React, { Component } from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import DesplegableInfo from '../../../Global/DesplegableInfo'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../../../Global/functions'
import { setPopUpInfo } from '../../../../redux/actions';
import equal from 'deep-equal'
//import bbdd from '../../../Global/Data/resultados'
import SideBar from './SideBar'

import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      dominios: this.props.dominios,
      competidores: this.props.competidores,

      id_tracking: '',
      editDominios:false,
      editCompetidores:false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {

    if (this.props.status !== nextProps.status ||
      this.props.dominios !== nextProps.dominios ||
      this.props.competidores !== nextProps.competidores) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.status !== newProps.status) { this.setState({ status: newProps.status }) }
    if (this.props.dominios !== newProps.dominios) { this.setState({ dominios: newProps.dominios }) }
    if (this.props.competidores !== newProps.competidores) { this.setState({ competidores: newProps.competidores }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};

    multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/activo`] = this.state.status === 'Activado' ? true : false


    //multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/competidores`]=this.state.competidores
    //multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/dominios`] = this.state.dominios.trim()



    {/*LOGS*/ }
    let id_log;
    var timestamp = (+new Date());
    var id_empleado = this.props.empleado.id_empleado;

    if (this.props.status !== this.state.status) {
      id_log = db.child(`Servicios/Logs/clientes/${this.props.id_cliente}/informacion/tracking`).push().key;
      functions.createLogs(multiPath, timestamp, this.props.status, this.state.status, 'status', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/tracking/${id_log}`)
    }

    var dominios = this.state.dominios;
    if(!equal(this.state.dominios,this.props.dominios)){
      Object.entries(this.state.dominios).forEach(([k,o])=>{
        if(o.new){
          o.new=null
        }
      })
      multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/dominios`] = dominios
      functions.createLogs(multiPath, timestamp, this.props.dominios, this.state.dominios, 'dominios', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/tracking/${id_log}`)
    }

    var competidores = this.state.competidores;
    if(!equal(this.state.competidores,this.props.competidores)){
      Object.entries(this.state.competidores).forEach(([k,o])=>{
        if(o.new){
          o.new=null
        }
      })
      multiPath[`Clientes/${this.props.id_cliente}/servicios/tracking/competidores`] = competidores
      functions.createLogs(multiPath, timestamp, this.props.competidores, this.state.competidores, 'competidores', id_empleado, `Servicios/Logs/clientes/${this.props.id_cliente}/informacion/tracking/${id_log}`)
    }


    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })


  }

  callBack = (list, obj) =>{

    var st = {
      editDominios:false,
      editCompetidores:false
    }
    if(!equal(this.state[obj],list)){
      st[obj] = list
    }
    
    console.log('kknn',st);
    

    this.setState(st)
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.tracking.edit.info || (this.props.empleados && this.props.empleados[this.props.empleado.id_empleado]);
    } catch (e) { }

    var edited = false;
    if (this.props.status !== this.state.status ||
        !equal(this.props.dominios, this.state.dominios) ||
        !equal(this.props.competidores, this.state.competidores)
      ) {
      edited = true;
    }

    var lista_dominios = '', numDomin = 0
    Object.entries(this.state.dominios).forEach(([k, a]) => {
      if(a.status==='activo'){
        lista_dominios = lista_dominios + a.valor+ ', ';
        numDomin++
      }
    })
    lista_dominios+=';'; lista_dominios = lista_dominios.replace(', ;','').replace(';','')

    var lista_competidores = '', numCom = 0;
    Object.entries(this.state.competidores).forEach(([k, a]) => {
      if(a.status==='activo'){
        lista_competidores = lista_competidores + a.valor+ ', ';
        numCom++
      }
    })
    lista_competidores+=';'; lista_competidores = lista_competidores.replace(', ;','').replace(';','')

    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} /> : null}

        <p className='title-informacion-alumno'>1. Información del tracking</p>

        {/*Estado*/}



        {/*follows y no follows*/}
        <SimpleInputDesplegable type={`${privilegio ? '' : 'block'}`} lista={data.estados_act_des} title='Estado' _class='div_text_mitad' text={this.state.status} changeValor={(status) => this.setState({ status })} />


        <div className='col-2-input'>
          <DesplegableInfo type={`block`} lista={this.state.dominios}
            title='Dominios'
            number={numDomin}
            text={lista_dominios}
            callbackValue={true}
            callBack={()=>{this.setState({editDominios:true})}}
          />

          <DesplegableInfo type={`block`} lista={this.state.competidores}
            title='Competidores'
            number={numCom}
            text={lista_competidores}
            callbackValue={true}
            callBack={()=>{this.setState({editCompetidores:true})}}
          />

        </div>

        

        {this.state.editDominios?
          <SideBar 
            list={this.state.dominios} 
            title='Dominios' 
            placeHolderNew='Agrega un nuevo dominio'
            path={`Clientes/${this.props.id_cliente}/servicios/tracking/dominios`}
            callBack={(list)=>{this.callBack(list,'dominios')}}
          />:null
        }

        {this.state.editCompetidores?
          <SideBar 
            list={this.state.competidores} 
            title='Competidores' 
            placeHolderNew='Agrega un nuevo competidor'
            path={`Clientes/${this.props.id_cliente}/servicios/tracking/competidores`}
            callBack={(list)=>{this.callBack(list,'competidores')}}
          />:null
        }
        


      </div>
    )
  }
}

function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(null, matchDispatchToProps)(InformacionTracking);