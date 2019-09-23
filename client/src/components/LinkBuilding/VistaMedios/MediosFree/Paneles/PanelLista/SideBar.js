import React, {Component} from 'react'
import {cleanProtocolo} from '../../../../../Global/functions'
import moment from 'moment'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setVistaLinkBuilding, setClienteSeleccionado, setPanelClientesFreeLinkbuilding } from '../../../../../../redux/actions';
import data from '../../../../../Global/Data/Data'
import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();
class SideBar extends Component{

  constructor(props){
    super(props)
    this.state={
      
      disponibles:true,
      usados:false,
      search:'',
      visible: false
    }
  }


  enterKey = (event) => {if(event.key === 'Enter'){this.addNewInput(event.currentTarget.value)}}

  componentDidMount = () => {
    setTimeout(() => { 
      this.setState({visible:true})
    }, 0)
  }

  close = () => {

    this.setState({visible:false})

    setTimeout(() => { 
      this.props.callBack()
    }, 500)

  }

  openCliente = id_cliente => {
    var multiPath = {}
    const vistas = JSON.parse(JSON.stringify(data.vistas.vistas_linkbuilding.vistas))
    
    var vistaDisponible = Object.entries(vistas.items).find(([k, v]) => { return v.checked })
    if (vistaDisponible) {
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/vista`] = 'enlaces'
      db.update(multiPath)
    }

    if(this.props.cliente_seleccionado!==this.props.cliente){

      var multiPath = {}
      try {
        if(this.props.cliente_seleccionado.servicios.linkbuilding.free.editando_por.id_empleado===this.props.empleado.id_empleado){
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/editando_por`]=null
        }
      } catch (e) {}
      try {
        if(this.props.cliente_seleccionado.servicios.linkbuilding.paid.editando_por.id_empleado===this.props.empleado.id_empleado){
          multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/paid/editando_por`]=null
        }
      } catch (e) {}
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/cliente_seleccionado`]=id_cliente
      if(Object.keys(multiPath).length>0){ db.update(multiPath) }

      this.props.setClienteSeleccionado(this.props.clientes[id_cliente])
      this.props.setPanelClientesFreeLinkbuilding('info')



    }else{
      this.props.setPanelClientesFreeLinkbuilding('info')
    }


    this.props.setVistaLinkBuilding(vistas)
  }

  render(){

    const clientes_disponibles = this.props.clientes_disponibles
    const clientes_usados = this.props.clientes_usados

    return(
      <div className='container-block-side' onClick={()=>{this.close()}}>

        <div className={`container-side ${this.state.visible?'container-side-activo':''}`} onClick={(e)=>e.stopPropagation(e)}>
          
          <div className='title-side-bar-medios pr'>

            <div className='close-side-bar-medios'><i className="material-icons " onClick={()=>this.close()}> cancel </i></div>

            <div className='text-title-medios'>Clientes</div>
            
            <div className='subtext-title-medios'>{this.props.subtext}</div>
            <div className='container-opciones-medios'>
              <div className={`opciones-bar-medios ${this.state.disponibles?'opc-activa':''}`} onClick={()=>{this.setState({disponibles:true,usados:false})}}>disponibles</div>
              <div className={`opciones-bar-medios ${this.state.usados?'opc-activa':''}`} onClick={()=>{this.setState({disponibles:false,usados:true})}}>usados</div>
            </div>

          </div>
          
          
          <div className='scroll-side scroll-bar-medios pr' >

            <div className='medios-cliente-disponible pr search-side-bar'>
              <i class="material-icons"> search </i>
              <input value={this.state.search} onChange={e=>this.setState({search:e.target.value})} placeholder={'Buscar cliente'} />
            </div>

            {this.state.disponibles?

              clientes_disponibles.map((c, k)=>{
                var web = cleanProtocolo(this.props.clientes[c.id_cliente].web)
                if(this.state.search.trim()!=='' && !web.includes(this.state.search.trim())){
                  return false
                }
                return(
                  <div key={k} className='medios-cliente-disponible pointer pr' onClick={()=>{this.openCliente(c.id_cliente)}}>
                    <div>{web}</div>
                    {/*<div className='linea-separacion'></div>*/}
                  </div>
                )
              })

              :
              null
            }

            {this.state.usados?

              clientes_usados.map((c, k)=>{
                
                return(
                  <ClienteUsado key={k} datos={c} cliente={this.props.clientes[c.id_cliente]}/>
                  
                )
              })

              :
              null
            }
            

          </div>

          

        </div>

      


      </div>

    )
  }

}

function mapStateToProps(state){return{ empleado : state.empleado, cliente_seleccionado: state.cliente_seleccionado }}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setVistaLinkBuilding, setClienteSeleccionado, setPanelClientesFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(SideBar);

class ClienteUsado extends Component{
  constructor(props){
    super(props)
    this.state={
      showFechas:false
    }
  }
  render(){
    
    return(
      <div  className='medios-cliente-disponible pr'>
        <div className='info-cli-dispo' onClick={()=>this.setState({showFechas:this.state.showFechas?false:true})}>
          <div className='arrow-container-sidebar' >
            <i className={`material-icons ${this.state.showFechas?'open-arrow-sidebar':''}`} > arrow_right </i>
          </div>
          <div>{cleanProtocolo(this.props.cliente.web)}</div>
        </div>
        {this.state.showFechas?
          <div className='vista-fechas'>
            <ul>
              {Object.entries(this.props.datos.medio.fechas).map(([f,k])=>{

                var fecha = f.split('-')
                fecha = moment(`${fecha[1]}-01-${fecha[0]}`).locale('es').format('LL')
                fecha = fecha.split(' de ');
                fecha = fecha[1]+' de '+fecha[2]
                fecha = fecha.charAt(0).toUpperCase() + fecha.slice(1)
                return(
                  <li key={f}><span>{fecha}</span></li>
                )
              })}
            </ul>
          </div>
        :null}
        
        {/*<div className='linea-separacion'></div>*/}
      </div>
    )
  }
}