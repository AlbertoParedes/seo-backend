import React, {Component} from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import Fecha from '../../../../../Global/Fecha';
import data from '../../../../../Global/Data/Data';
import functions from '../../../../../Global/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setVistaLinkBuilding, setFiltrosEnlacesFreeListaLinkbuilding, setFechaEnlaces } from '../../../../../../redux/actions';
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();

class Filtros extends Component{

  constructor(props){
    super(props)
    this.state={
      show_filtros:false,
      show_vistas: false,
      show_calendar:false,
      stringMes:'',
      fecha:this.props.fecha,
      show_new_enlaces:false,
      show_medios:false,
      medios_usados:{},

      new_enlaces:{
        follows:{valor:'Follow'},
        nofollows:{valor:'Nofollow'}
      }
    }
  }

  changeFiltros = (filtros) => {
    /*if(this.props.filtros_free.type!==filtros.type){
      var filtros_paid = dotProp.set(this.props.filtros_paid, `type`, filtros.type);
      filtros_paid.type=filtros.type;
      this.props.setFiltrosMediosPaidListaLinkbuilding(filtros_paid)
    }
*/
    this.props.setFiltrosEnlacesFreeListaLinkbuilding(filtros)

  }

  setFecha = () => {
    var array = this.state.fecha.split('-');
    var mes = (+array[1]);
    var stringMes = data.months[mes-1]
    this.setState({stringMes})
  }

  componentWillReceiveProps = newProps =>{
    if(this.state.fecha!==newProps.fecha){
      this.setState({fecha:newProps.fecha},()=>{this.setFecha()})
    }
  }
  componentWillMount = () => {
    this.setFecha()
  }

  selectOpcionNewEnlace = (id) =>{
    if(id==='follows'){

      var num_follows = Object.entries(this.props.enlaces).filter(([k,e])=>e.tipo==='follow');
      if(num_follows.length >= (+this.props.cliente_seleccionado.follows)){
        console.log('Ya se han creado todos los follows para este cliente');
      }else{
        var key = db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key, multiPath = {};
        multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
          id_empleado:this.props.empleado.id_empleado, status:'new',id_enlace:key, tipo:'follow'
        }
        db.update(multiPath)
        .then(()=>{ console.log('OK'); })
        .catch( err => console.log(err));
      }

    }else if(id==='nofollows'){
      var num_nofollows = Object.entries(this.props.enlaces).filter(([k,e])=>e.tipo==='nofollow');
      if(num_nofollows.length >= (+this.props.cliente_seleccionado.nofollows)){
        console.log('Ya se han creado todos los nofollows para este cliente');
      }else{
        var key = db.child(`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces`).push().key, multiPath = {};
        multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${this.props.cliente_seleccionado.id_cliente}/mensualidades/${this.state.fecha}/enlaces/${key}`] = {
          id_empleado:this.props.empleado.id_empleado, status:'new',id_enlace:key, tipo:'nofollow'
        }
        db.update(multiPath)
        .then(()=>{ console.log('OK'); })
        .catch( err => console.log(err));
      }
    }
  }

  changeMediosUsados = () => {
    var medios_usados = {};
    console.log(this.props.cliente_seleccionado);
    console.log(this.props.medios);
    Object.entries(this.props.cliente_seleccionado.servicios.linkbuilding.free.home.medios_usados_follow).forEach(([k,m])=>{
      console.log(m);
      medios_usados[k]={
        valor:this.props.medios[m.categoria].medios[k].web
      }
    })
    this.setState({medios_usados, show_medios:true})
  }

  goLink = (id) =>{
    console.log(id);
  }

  render(){
    console.log('fecha',this.props.fecha);
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros_free} updateFiltros={(filtros=>this.changeFiltros(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>

          <div className='btn-options pr'>
            <i className="material-icons"> calendar_today </i> <span>{this.state.stringMes}</span>
            <Fecha setFecha={fecha=>this.props.setFechaEnlaces(fecha)} clss={'input-fecha-enlaces'} id={'date-enlaces-free'} position={'fecha_enlaces_position'} month={this.props.fecha.split('-')[1]} year={this.props.fecha.split('-')[0]}/>
          </div>

          <div className='btn-options pr' onClick={()=>this.setState({show_vistas:this.state.show_vistas?false:true})}>
            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas?
                <ListaVistas vistas={this.props.vistas} updateVistas={(vistas=>this.props.setVistaLinkBuilding(vistas))} close={()=>this.setState({show_vistas:false})}/>:null
            }
          </div>


          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros_free} updateFiltros={(filtros=>this.changeFiltros(filtros))} close={()=>this.setState({show_filtros:false})}/>:null
            }
          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_enlaces?'color-azul':''}`} >
            <i onClick={()=>this.setState({show_new_enlaces:true})} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_enlaces?
              <PopUpLista selectOpcion={(id)=>this.selectOpcionNewEnlace(id)} opciones={this.state.new_enlaces} _class='opciones-search-show position-add-enlaces' close={()=>this.setState({show_new_enlaces:false})}/>:null
            }

          </div>



          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?' color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul middle-item">save_alt</i>
          </div>

          <div className={`item-container-icon-top-bar pr ${this.state.show_medios?' color-azul':''}`} >
            <i onClick={()=>this.changeMediosUsados()} className="material-icons hover-azul middle-item">account_balance</i>
            {this.state.show_medios ?
              <PopUpLista
                selectOpcion={(id)=>{this.goLink(id)}}
                opciones={this.state.medios_usados} title='Medios usados'
                _class='rigth-popup-medios-usados' _class_div='max-width' _class_container='size-medios-popup scroll-bar-exterior'
                close={()=>this.setState({show_medios:false})}
                tag='a' buscar={true}/>
            :null}
          </div>

          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?'middle-item color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul">edit</i>
          </div>


        </div>

      </div>
    )
  }

}

function mapStateToProps(state){return{
  vistas : state.linkbuilding.vistas,
  fecha:state.linkbuilding.enlaces.fecha ,
  filtros_free: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
  filtros_paid: state.linkbuilding.enlaces.tipos.paid.paneles.lista.filtros,
  enlaces:state.linkbuilding.enlaces.tipos.free.enlaces,
  cliente_seleccionado: state.cliente_seleccionado,
  empleado:state.empleado,
  medios: state.linkbuilding.medios.tipos.free.medios
}}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setVistaLinkBuilding, setFiltrosEnlacesFreeListaLinkbuilding, setFechaEnlaces }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
