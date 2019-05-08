import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import { connect } from 'react-redux';
import InformacionLinkbuilding from './InformacionLinkbuilding'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import PopUpLista from '../../../Global/Popups/ListaOpciones'
import dotProp from 'dot-prop-immutable';
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionEmpleados extends Component {
  constructor(props){
    super(props);
    this.state={
      empleados:this.props.empleados,
      all_empleados:this.all_empleados,
      follows:this.props.follows,
      nofollows:this.props.nofollows,
      show_empleados: false,
      fecha : new Date().getFullYear() + '-' + ( (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1) ),
      empleados_eliminados:{}
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.empleados !== nextProps.empleados ||
      this.props.all_empleados !== nextProps.all_empleados ||
      this.props.follows !== nextProps.follows ||
      this.props.nofollows !== nextProps.nofollows){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.empleados!==newProps.empleados){ this.setState({empleados: newProps.empleados}) }
    if(this.props.all_empleados!==newProps.all_empleados){ this.setState({all_empleados: newProps.all_empleados}) }
    if(this.props.follows!==newProps.follows){ this.setState({follows: newProps.follows}) }
    if(this.props.nofollows!==newProps.nofollows){ this.setState({nofollows: newProps.nofollows}) }
  }

  changeFollows = (num, id_empleado) =>{

    var total_follows_asignado = 0
    Object.entries(this.state.empleados).forEach(([k,e])=>{
      if(k===id_empleado){
        total_follows_asignado = total_follows_asignado + (+num)
      }else{
        total_follows_asignado = total_follows_asignado + (+e.follows)
      }
    })
    if(num==='' || ( total_follows_asignado<=(+this.state.follows) && (+num)>=0 ) ){
      var empleados = dotProp.set(this.state.empleados, `${id_empleado}.follows`, num.toString().trim()===''?'':(+num));
      if(empleados==this.state.empleados){//erreglar este apartado
      }
      this.setState({empleados})
    }else{
      console.log('Te estas pasando de follows');
    }
  }

  changeNoFollows = (num, id_empleado) =>{

    var total_follows_asignado = 0
    Object.entries(this.state.empleados).forEach(([k,e])=>{
      if(k===id_empleado){
        total_follows_asignado = total_follows_asignado + (+num)
      }else{
        total_follows_asignado = total_follows_asignado + (+e.nofollows)
      }
    })
    if(num==='' || ( total_follows_asignado<=(+this.state.nofollows) && (+num)>=0 ) ){
      var empleados = dotProp.set(this.state.empleados, `${id_empleado}.nofollows`, num.toString().trim()===''?'':(+num));
      if(empleados==this.state.empleados){//erreglar este apartado
      }
      this.setState({empleados})
    }else{
      console.log('Te estas pasando de nofollows');
    }
  }

  undoData = () => {
    this.setState({
      empleados:this.props.empleados,
      all_empleados:this.all_empleados,
      follows:this.props.follows,
      nofollows:this.props.nofollows,
      show_empleados: false,
      fecha : new Date().getFullYear() + '-' + ( (new Date().getMonth()+1)<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1) ),
      empleados_eliminados:{}
    })
  }

  saveData = () => {

    var empleados = this.state.empleados, multiPath={}, error=false;
    var totalFollows = 0, totalNoFollows=0;

    Object.entries(empleados).forEach(([k,e])=>{
      if((+e.follows)<0 || e.follows.toString().includes('.') || e.follows.toString()==='' || (+e.nofollows)<0 || e.nofollows.toString().includes('.') || e.nofollows.toString()===''){
        console.log('Existen errores en los campos');
        error=true
      }else{

        totalFollows += e.follows?(+e.follows):0
        totalNoFollows += e.nofollows?(+e.nofollows):0

        empleados[k].follows=(+e.follows);
        empleados[k].nofollows=(+e.nofollows);

        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/follows`]=(+e.follows)
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/nofollows`]=(+e.nofollows)

      }
    })

    if(Object.keys(empleados).length>0 && ((+totalFollows)!==this.props.follows || (+totalNoFollows)!==this.props.nofollows) && Object.keys(this.props.empleados).length!==Object.keys(this.state.empleados_eliminados).length){
      console.log('Existen errores en la suma de los enlaces');
      return false
    }

    if(!error){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_free`]=empleados

      Object.entries(this.state.empleados_eliminados).forEach(([k,e])=>{

        try {
          if(this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k]){
            if(this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k].enlaces_follows ||
              this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados[k].enlaces_nofollows){
                multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}/eliminado`]=true

            }else{
              multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${k}`]=null
            }
          }
        } catch (e) {}

      })

      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})

    }else{

    }


  }

  openEmpleados = () => {
    this.setState({show_empleados:true})
  }

  addEmpleado = (id) =>{
    if(!this.state.empleados[id]){
      var multiPath = {}
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/follows`]=0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/nofollows`]=0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/empleados/${id}/eliminado`]=null
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/empleados/linkbuilding_free/${id}`]={
        follows:0,
        nofollows:0,
        nombre:this.props.empleados_disponibles[id].valor ,
        id_empleado:id
      }

      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})
    }
  }

  deleteEmpleado = (id_empleado) => {
    var empleados_eliminados = this.state.empleados_eliminados //dotProp.set(this.state.empleados_eliminado, `${id_empleado}.eliminado` ,true);

    empleados_eliminados[id_empleado]=true

    var empleados = dotProp.delete(this.state.empleados, `${id_empleado}`);

    this.setState({empleados, empleados_eliminados})
  }

  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_free.edit.empleados;
    } catch (e) {}

    var edited = false;
    if(JSON.stringify(this.props.empleados)!==JSON.stringify(this.state.empleados)){
      edited = true;
    }
    console.log(this.props.empleados, this.state.empleados);

    var totalFollows = 0, totalNoFollows=0;
    try {
      Object.entries(this.state.empleados).forEach(([k,e])=>{
        totalFollows += e.follows?(+e.follows):0
        totalNoFollows += e.nofollows?(+e.nofollows):0
      })
    } catch (e) {

    }
    totalFollows = (+totalFollows)
    totalNoFollows = (+totalNoFollows)
    console.log(totalFollows, totalNoFollows);

    return(
      <div className='sub-container-informacion'>

        {privilegio?
          edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/>
        :
          <div className='settings-panels'>
            <div className='div-save-icon pr' onClick={()=>this.openEmpleados()}>
              <i className="material-icons">add</i>
              {this.state.show_empleados?
                <PopUpLista selectOpcion={(id)=>{this.addEmpleado(id);}} opciones={this.props.empleados_disponibles} _class='opciones-search-show position-add-enlaces' close={()=>this.setState({show_empleados:false})}/>:null
              }

            </div>
          </div>
        :null}


        <p className='title-informacion-alumno'>3. Empleados</p>

        <div className='ei-parent'>

        {this.state.empleados && Object.keys(this.state.empleados).length>0?
          Object.entries(this.state.empleados).map(([k,e])=>{
            return(
              <EmpleadoItem key={k}
                empleado={this.props.all_empleados[k]}
                follows={e.follows}
                nofollows={e.nofollows}
                tipo='follows'
                changeFollows={(num)=>this.changeFollows(num,k)}
                changeNoFollows={(num)=>this.changeNoFollows(num,k)}
                deleteEmpleado = {()=>this.deleteEmpleado(k)}
                errorFollows = {(+this.props.follows)===(+totalFollows)?false:true}
                errorNofollows = {(+this.props.nofollows)===(+totalNoFollows)?false:true}
                privilegio={privilegio}
                />
            )

          })
        :
        <div className="div_info_panel_linkbuilding">No hay empleados asignados</div>
        }

        </div>

      </div>
    )
  }
}

export default InformacionEmpleados
