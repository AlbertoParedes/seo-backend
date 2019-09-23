import React, { Component } from 'react'
import data from '../../../../../Global/Data/Data'
import * as functions from '../../../../../Global/functions'
import ConfirmAlert from '../../../../../Global/ConfirmAlert'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import NuevosEnlaces from './NuevosEnlaces'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class EnlacesDisponibles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlaces_disponibles: this.props.enlaces_disponibles,
      show_new_enlace: false,
      eliminar: false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.enlaces_disponibles !== nextProps.enlaces_disponibles) {
      return true;
    } else if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.enlaces_disponibles !== newProps.enlaces_disponibles) { this.setState({ enlaces_disponibles: newProps.enlaces_disponibles }) }
  }

  undoData = () => { this.setState(this.props) }

  saveData = () => {

    var multiPath = {};
    multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.id_medio}/enlaces_disponibles`] = this.state.enlaces_disponibles;
    db.update(multiPath)
      .then(() => {
        this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se han guardado los cambios correctamente' })
      })
      .catch(err => {
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al guardar' })
      })



  }
  openNewEnlace = (valor) => {
    this.setState({ show_new_enlace: valor })
  }

  eliminarEnlace = (item) => {

    this.setState({ eliminar: true })


  }
  confirmResult = (result, item) => {
    if (result === 'cancelar') {
      this.setState({ eliminar: false })
    } else {
      var multiPath = {}
      multiPath[`Servicios/Linkbuilding/Paid/Medios/medios/${this.props.medio_seleccionado.id_medio}/enlaces/${item.id_enlace}`] = null


      db.update(multiPath)
        .then(() => {
          this.props.setPopUpInfo({ visibility: true, status: 'done', moment: Date.now(), text: 'Se ha eliminado correctamente' })
          this.setState({ eliminar: false })
        })
        .catch(err => {
          this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Error al eliminar' })
        })
    }


  }

  render() {
    var edited = false;
    if (this.props.enlaces_disponibles !== this.state.enlaces_disponibles) {
      edited = true;
    }


    return (
      <div className='sub-container-informacion'>

        {edited ? <UpdateStateInputs saveData={() => this.saveData()} undoData={() => this.undoData()} />
          :
          <div className='settings-panels'>
            <div className='div-save-icon pr' onClick={() => this.openNewEnlace(true)}>
              <i className="material-icons">add</i>
              {this.state.show_new_enlace ?
                <NuevosEnlaces close={() => this.openNewEnlace(false)} /> : null
              }

            </div>
          </div>
        }

        <p className='title-informacion-alumno'>1. Enlaces disponibles</p>

        {this.state.enlaces_disponibles.length > 0 ?
          <div className='container-enlaces-paid'>
            {this.state.enlaces_disponibles.map((item, key) => {

              var fechas = '', clientes = '';
              if (item.mini_enlaces) {
                item.mini_enlaces.forEach((e, k2) => {
                  if (e.fecha_selected) {
                    fechas = functions.getStringDate(e.fecha_selected) + fechas + ' | '

                    if (e.micronicho && e.micronicho !== 'home') {
                      clientes = clientes + functions.cleanProtocolo(this.props.clientes[e.id_cliente].servicios.linkbuilding.paid.micronichos.webs[e.micronicho].web) + ', '
                    } else {
                      clientes = clientes + functions.cleanProtocolo(this.props.clientes[e.id_cliente].web) + ', '
                    }

                  }
                })
              }
              fechas += '~'; fechas = fechas.replace(' | ~', '')
              clientes += '~'; clientes = clientes.replace(', ~', '')
              if (fechas.endsWith('~')) fechas = fechas.replace('~', '')
              if (clientes.endsWith('~')) clientes = clientes.replace('~', '')

              return (
                <div key={key} className={`item-enlace-comprado pr`}>

                  {item.mini_enlaces && item.mini_enlaces.some((e) => { return e.id_cliente }) ? null
                    :
                    <i onClick={() => this.eliminarEnlace(item)} className="material-icons clear-empleado">clear</i>
                  }


                  {this.state.eliminar ?
                    <ConfirmAlert
                      text_1={'¿Estás seguro que deseas eliminar el enlace comprado en '}
                      bold_1={`${item.id_plataforma ? this.props.plataformas[item.id_plataforma].texto : ''}`}
                      text_2={' por '}
                      bold_2={`${functions.getDecimcals(item.precio_con_iva)} € `}
                      text_3={'?'}
                      cancelar={'Cancelar'}

                      aceptar={'Eliminar'}
                      confirmResult={(result) => this.confirmResult(result, item)}
                    /> : null
                  }

                  <div className='datos-enlace-right'>
                    <div>
                      <span className='item-enlace-comprado-title'>Precio de compra: </span>
                      <span className='item-enlace-comprado-data'>{`${functions.getDecimcals(item.precio_con_iva)} €  (${functions.getDecimcals(item.precio)} € sin IVA)`}</span>
                    </div>
                    <div>
                      <span className='item-enlace-comprado-title'>Plataforma: </span>
                      <span className='item-enlace-comprado-data'>{item.id_plataforma ? this.props.plataformas[item.id_plataforma].texto : ''}</span>
                    </div>
                    <div>
                      <span className='item-enlace-comprado-title'>Fecha de compra: </span>
                      <span className='item-enlace-comprado-data'>{functions.getDateNTimeFromDate(item.timestamp)}</span>
                    </div>

                    <div>
                      <span className='item-enlace-comprado-title'>Tipo de enlace: </span>
                      <span className='item-enlace-comprado-data'>{data.compartir_enlaces[item.compartir].texto}</span>
                    </div>
                  </div>

                  <div className='datos-enlace-left'>

                    <div>
                      <span className='item-enlace-comprado-title'>Compra realizada por: </span>
                      <span className='item-enlace-comprado-data'>{this.props.empleados[item.id_empleado].nombre + ' ' + this.props.empleados[item.id_empleado].apellidos}</span>
                    </div>

                    <div>
                      <span className='item-enlace-comprado-title'>Disponible para: </span>
                      <span className='item-enlace-comprado-data'>Todos</span>
                    </div>


                    {item.mini_enlaces && fechas.trim() !== '' ?
                      <div>
                        <span className='item-enlace-comprado-title'>Fecha de asignación: </span>
                        <span className='item-enlace-comprado-data'>{fechas/*functions.getStringDate(item.fecha_selected)*/}</span>
                      </div>
                      : null
                    }

                    {item.mini_enlaces && fechas.trim() !== '' ?
                      <div>
                        <span className='item-enlace-comprado-title'>Cliente asignado: </span>
                        <span className='item-enlace-comprado-data'>{clientes/*this.props.clientes[item.id_cliente].web*/}</span>
                      </div>
                      : null
                    }



                  </div>
                </div>
              )
            })}
          </div>


          :
          <div className="div_info_panel_linkbuilding">No hay enlaces disponibles</div>
        }

      </div>
    )
  }
}

function mapStateToProps(state) { return { empleados: state.empleados, clientes: state.clientes, medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado, plataformas: state.linkbuilding.medios.tipos.paid.plataformas } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(EnlacesDisponibles);

