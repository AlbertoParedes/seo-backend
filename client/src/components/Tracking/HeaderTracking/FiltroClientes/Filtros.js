import React, { Component } from 'react';
import ListaFiltros from '../../../Filtros/ListaFiltros'
import ItemsFiltro from '../../../Filtros/ItemsFiltro'
import NewClientes from './NewClientes'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import $ from 'jquery'
import { setFiltrosTrackingLista, setEditClientesTracking } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class Filtros extends Component {
  constructor(props){
    super(props);
    this.state={
      show_filtros:false,
      show_new_cliente: false
    };
  }
  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  changeEdit = () => {

    this.props.setEditClientesTracking({activo: this.props.tracking_clientes_edit.activo?false:true, seleccionados:{}})

  }
  deleteClientes = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_clientes_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_clientes_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked){
          multiPath[`Clientes/${o.id_cliente}/eliminado`]=true
        }

      })
      var n = Object.keys(multiPath).length;
      if(n>0){
        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditClientesTracking({activo: this.props.tracking_clientes_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} borrado ${n} ${n===1?'cliente':'clientes'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido borrar ningun cliente`) })
      }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

    }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

  }

  pauseClientes = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_clientes_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_clientes_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked){
          multiPath[`Clientes/${o.id_cliente}/tracking/activo`]=false
        }

      })
      var n = Object.keys(multiPath).length;
      if(n>0){
        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditClientesTracking({activo: this.props.tracking_clientes_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} desactivado ${n} ${n===1?'cliente':'clientes'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido desactivar ningun cliente`) })
      }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

    }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

  }

  restoreClientes = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_clientes_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_clientes_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked){

          multiPath[`Clientes/${o.id_cliente}/eliminado`]=false
          multiPath[`Clientes/${o.id_cliente}/tracking/activo`]=true

        }

      })
      var n = Object.keys(multiPath).length/2;
      if(n>0){
        console.log(multiPath);

        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditClientesTracking({activo: this.props.tracking_clientes_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} activado ${n} ${n===1?'cliente':'clientes'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido activar ningun cliente`) })

      }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

    }else{ this.mensajeInformativo('No se ha seleccionado ningun cliente') }

  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros_tracking_lista} updateFiltros={(filtros=>this.props.setFiltrosTrackingLista(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>
          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {
              this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros_tracking_lista} updateFiltros={(filtros=>this.props.setFiltrosTrackingLista(filtros))} close={()=>this.setState({show_filtros:false})}/>
              :null
            }

          </div>


          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?'color-azul':''}`} >
            <i onClick={()=>this.setState({show_new_cliente:true})} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_cliente?
              <NewClientes close={()=>this.setState({show_new_cliente:false})}/> : null
            }

          </div>

          <div className={`item-container-icon-top-bar pr ${this.props.tracking_clientes_edit.activo?'middle-item color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul">edit</i>
          </div>

          {this.props.tracking_clientes_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.deleteClientes()} className="material-icons hover-red color_eliminado">delete_forever</i>
            </div>
            :null
          }



          {this.props.tracking_clientes_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.pauseClientes()} className="material-icons hover-orange color_parado">pause</i>
            </div>
            :null
          }

          {this.props.tracking_clientes_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.restoreClientes()} className="material-icons hover-green color_green">restore</i>
            </div>
            :null
          }


        </div>
      </div>
    )
  }
}

function mapStateToProps(state){return{ filtros_tracking_lista : state.filtros_tracking_lista, tracking_clientes_edit: state.tracking_clientes_edit,  empleado:state.empleado }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setEditClientesTracking, setFiltrosTrackingLista }, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
