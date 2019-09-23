import React, { Component } from 'react';
import ListaFiltros from '../../../Filtros/ListaFiltros'
import ItemsFiltro from '../../../Filtros/ItemsFiltro'
import NewKeywords from './NewKeywords'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setEditKeywordsTracking, setFiltrosTrackingKeywords, setPopUpInfo } from '../../../../redux/actions';
import firebase from '../../../../firebase/Firebase';
import DatePicker from './DatePicker';
const db = firebase.database().ref();

class Filtros extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show_filtros: false,
      show_new_cliente: false,
    }
  }

  changeEdit = () => {

    if (
      (this.props.empleado.clientes && this.props.empleado.clientes.tracking && this.props.empleado.clientes.tracking[this.props.cliente.id_cliente])
      ||
      (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_keywords)
    ) {
      this.props.setEditKeywordsTracking({ activo: this.props.tracking_keywords_edit.activo ? false : true, seleccionados: {} })
    } else {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No tiene permiso para modificar estas keywords' })
    }


  }

  deleteKeywords = () => {
    var selecionados_limpios = {}
    if (this.props.tracking_keywords_edit.seleccionados) {
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k, o]) => {
        if (o.checked && this.props.cliente.id_cliente === o.id_cliente) {

          multiPath[`Clientes/${o.id_cliente}/servicios/tracking/keywords/${o.id_keyword}/eliminado`] = true

        } else if (o.checked) {
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length;
      if (n > 0) {

        db.update(multiPath)
          .then(() => {
            this.props.setEditKeywordsTracking({ activo: this.props.tracking_keywords_edit.activo, seleccionados: selecionados_limpios })
            this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: `Se ${n === 1 ? 'ha' : 'han'} borrado ${n} ${n === 1 ? 'keyword' : 'keywords'} correctamente` })
          })
          .catch(err => {
            this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se han podido borrar ninguna keyword' })
          })


      } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

    } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

  }
  pauseKeywords = () => {
    var selecionados_limpios = {}
    if (this.props.tracking_keywords_edit.seleccionados) {
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k, o]) => {
        if (o.checked && this.props.cliente.id_cliente === o.id_cliente) {

          multiPath[`Clientes/${o.id_cliente}/servicios/tracking/keywords/${o.id_keyword}/activo`] = false

        } else if (o.checked) {
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length;
      if (n > 0) {

        db.update(multiPath)
          .then(() => {
            this.props.setEditKeywordsTracking({ activo: this.props.tracking_keywords_edit.activo, seleccionados: selecionados_limpios })
            this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: `Se ${n === 1 ? 'ha' : 'han'} desactivado ${n} ${n === 1 ? 'keyword' : 'keywords'} correctamente` })
          })
          .catch(err => {
            this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se han podido desactivar ninguna keyword' })
          })

      } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

    } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

  }
  restoreKeywords = () => {
    var selecionados_limpios = {}
    if (this.props.tracking_keywords_edit.seleccionados) {
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k, o]) => {
        if (o.checked && this.props.cliente.id_cliente === o.id_cliente) {

          multiPath[`Clientes/${o.id_cliente}/servicios/tracking/keywords/${o.id_keyword}/eliminado`] = false
          multiPath[`Clientes/${o.id_cliente}/servicios/tracking/keywords/${o.id_keyword}/activo`] = true

        } else if (o.checked) {
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length / 2;
      if (n > 0) {

        db.update(multiPath)
          .then(() => {
            this.props.setEditKeywordsTracking({ activo: this.props.tracking_keywords_edit.activo, seleccionados: selecionados_limpios })
            this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: `Se ${n === 1 ? 'ha' : 'han'} activado ${n} ${n === 1 ? 'keyword' : 'keywords'} correctamente` })
          })
          .catch(err => {
            this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se han podido activar ninguna keyword' })
          })



      } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

    } else { this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'No se ha seleccionado ninguna keyword' }) }

  }


  render() {
    return (
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros => this.props.setFiltrosTrackingKeywords(filtros))} />
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <DatePicker />

          <div className='btn-options pr' onClick={() => this.setState({ show_filtros: this.state.show_filtros ? false : true })}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {
              this.state.show_filtros ?
                <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros => this.props.setFiltrosTrackingKeywords(filtros))} close={() => this.setState({ show_filtros: false })} />
                : null
            }

          </div>

          {/*Items barra*/}

          {/*
          <div className='item-container-icon-top-bar pr'>
            <i onClick={()=>this.descargarExcel()} className="material-icons hover-azul middle-item">save_alt</i>
            <form className="display_none" method="post" id="formTracking" target="_blank" action='https://seo.yoseomk.vps-100.netricahosting.com/api/tracking'>
              <input type="hidden" name="data" id="data" value="null"/>
            </form>
          </div>
          */}




          {this.props.panel === 'keywords' ?
            <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente ? 'color-azul' : ''}`} >
              <i onClick={() => this.setState({ show_new_cliente: true })} className="material-icons hover-azul middle-item">add</i>

              {this.state.show_new_cliente ?
                <NewKeywords close={() => this.setState({ show_new_cliente: false })} /> : null
              }

            </div>
            : null}


          {this.props.panel === 'keywords' ?
            <div className={`item-container-icon-top-bar pr ${this.props.tracking_keywords_edit.activo ? 'middle-item color-azul' : ''}`} >
              <i onClick={() => this.changeEdit()} className="material-icons hover-azul">edit</i>
            </div>
            : null
          }


          {this.props.panel === 'keywords' && this.props.tracking_keywords_edit.activo ?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={() => this.deleteKeywords()} className="material-icons hover-red color_eliminado">delete_forever</i>
            </div>
            : null
          }

          {this.props.panel === 'keywords' && this.props.tracking_keywords_edit.activo ?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={() => this.pauseKeywords()} className="material-icons hover-orange color_parado">pause</i>
            </div>
            : null
          }

          {this.props.tracking_keywords_edit.activo ?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={() => this.restoreKeywords()} className="material-icons hover-green color_green">restore</i>
            </div>
            : null
          }



        </div>

      </div>
    )
  }

}

function mapStateToProps(state) { return { panel: state.tracking.panel, filtros: state.tracking.paneles.keywords.filtros, cliente: state.cliente_seleccionado, tracking_keywords_edit: state.tracking.tracking_keywords_edit, empleado: state.empleado } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setEditKeywordsTracking, setFiltrosTrackingKeywords, setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
