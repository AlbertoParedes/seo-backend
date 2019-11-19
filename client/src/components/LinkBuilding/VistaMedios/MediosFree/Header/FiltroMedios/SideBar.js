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


    return(
      <div className='container-block-side' onClick={()=>{this.close()}}>

        <div className={`container-side ${this.state.visible?'container-side-activo':''}`} onClick={(e)=>e.stopPropagation(e)}>
          
          <div className='title-side-bar-medios pr'>

            <div className='close-side-bar-medios'><i className="material-icons " onClick={()=>this.close()}> cancel </i></div>

            <div className='text-title-medios'>Importar medios</div>
            
            <div className='subtext-title-medios'>{this.props.subtext}</div>
            <div className='container-opciones-medios'>
              <div className={`opciones-bar-medios opc-activa}`} onClick={()=>{this.setState({disponibles:true,usados:false})}}>disponibles</div>
            </div>

          </div>
          
          
          <div className='scroll-side scroll-bar-medios pr' >

            <div className='medios-cliente-disponible pr search-side-bar'>
              <i class="material-icons"> search </i>
              <input value={this.state.search} onChange={e=>this.setState({search:e.target.value})} placeholder={'Buscar medio'} />
            </div>

            {this.props.mediosNuevos?

              this.props.mediosNuevos.reduce((result, m, k)=>{
                /*if(this.state.search.trim()!=='' && !m.medio.includes(this.state.search.trim())){
                  
                }*/
                if (k < 20) {
                  result.push(
                    <ItemMedio medio={m} key={k}/>
                  )
                }
                return result;
                
              }, [])

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

class ItemMedio extends Component{

  constructor(props){
    super(props)
    this.state={
      showAjustes:false,
      showEstados: false,
      showTematicas: false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    var update = false


    if(this.props.medio!==nextProps.medio ){
      update = true
    }
    if(this.state!==nextState){
      update=true
    }
    return update
  }

  //comprobar tematica, tipo, enlace y estado
  
  render(){
    return(
      <div  className='medios-cliente-disponible pr' onClick={e=>e.stopPropagation()}>
        <div className='info-cli-dispo'>
          <div className='arrow-container-sidebar' onClick={()=>this.setState({showAjustes:!this.state.showAjustes})}>
            <i className={`material-icons ${this.state.showAjustes?'open-arrow-sidebar':''}`} > arrow_right </i>
          </div>
          <div className="pr edit-url-container-estrategia">
            <input className={`item-keyword-estrategia-input ${!this.props.correctUrl?'obligatorio_color':''}`} value={this.props.medio.medio} onChange={()=>{}}/>
          </div>
          

        </div>
        {this.state.showAjustes?
          <div className='vista-fechas'>
            <ul>

              <li>
                <div>
                  <div>Estado</div>
                  <div onClick={()=>{this.setState({showEstados:!this.state.showEstados})}}>{this.props.medio.medio}</div>
                  {this.state.showEstados?
                    <div>
                        <ul>
                          <li>Activado</li>
                          <li>Desactivado</li>
                          <li>Eliminado</li>
                          <li>En cuarentena</li>
                        </ul>
                    </div>
                  :null}
                </div>

                <div>
                  <span>Tematica</span>
                  <div onClick={()=>{this.setState({showTematicas:!this.state.showTematicas})}}>{this.props.medio.tematica}</div>
                  {this.state.showTematicas? //sole se van a poder seleccionar una opcion o todas
                    <div>
                        <ul>
                          <li>Todo</li>
                        </ul>
                    </div>
                  :null}
                </div>
                
              </li>

              <li>
                <div>
                  <span>Categoria</span>
                  <div onClick={()=>{this.setState({showCategorias:!this.state.showCategorias})}}>{this.props.medio.categoria}</div>
                  {this.state.showCategorias? //sole se van a poder seleccionar una opcion o todas
                    <div>
                        <ul>
                          <li>Perfiles</li>
                        </ul>
                    </div>
                  :null}
                </div>
                
              </li>
              
            </ul>
          </div>
        :null}
        
      </div>
    )
  }


}

