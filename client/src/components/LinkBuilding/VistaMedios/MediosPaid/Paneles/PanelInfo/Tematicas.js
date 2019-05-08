import React,{Component} from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import data from '../../../../../Global/Data/Data'
import functions from '../../../../../Global/functions'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import Switch from '../../../../../Global/Switch'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../../../Global/UpdateStateInputs'
import { connect } from 'react-redux';
import firebase from '../../../../../../firebase/Firebase';
import PopUpLista from '../../../../../Global/Popups/ListaOpciones'
const db = firebase.database().ref();

class Tematicas extends Component {
  constructor(props){
    super(props);
    this.state={
      tematicas:this.props.tematicas,
      all_tematicas:this.all_tematicas,
      show_tematicas: false,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.tematicas !== nextProps.tematicas ||
      this.props.all_tematicas !== nextProps.all_tematicas){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.tematicas!==newProps.tematicas){ this.setState({tematicas: newProps.tematicas}) }
    if(this.props.all_tematicas!==newProps.all_tematicas){ this.setState({all_tematicas: newProps.all_tematicas}) }
  }


  undoData = () => { this.setState(this.props) }

  /*saveData = () => {

    var tematicas = this.state.tematicas, multiPath={}, error=false

    Object.entries(tematicas).forEach(([k,e])=>{
      if(e.follows==='' || e.nofollows===''){
        console.log('Error');
        error=true
      }else{
        tematicas[k].follows=(+e.follows);
        tematicas[k].nofollows=(+e.nofollows);

        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/tematicas/${k}/follows`]=(+e.follows)
        multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/tematicas/${k}/nofollows`]=(+e.nofollows)

      }
    })
    if(!error){
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/tematicas/linkbuilding_free`]=tematicas

      Object.entries(this.state.tematicas_eliminados).forEach(([k,e])=>{

        try {
          if(this.props.cliente_seleccionado.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].tematicas[k]){
            multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/tematicas/${k}/eliminado`]=true
          }
        } catch (e) {}

      })

      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})

    }else{

    }


  }

  opentematicas = () => {
    this.setState({show_tematicas:true})
  }

  addEmpleado = (id) =>{
    if(!this.state.tematicas[id]){
      var multiPath = {}
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/tematicas/${id}/follows`]=0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${this.state.fecha}/tematicas/${id}/nofollows`]=0
      multiPath[`Clientes/${this.props.cliente_seleccionado.id_cliente}/tematicas/linkbuilding_free/${id}`]={
        follows:0,
        nofollows:0,
        nombre:this.props.tematicas_disponibles[id].valor ,
        id_empleado:id
      }

      db.update(multiPath)
      .then(()=>{console.log('Ok');})
      .catch(err=>{console.log(err);})
    }
  }

  deleteEmpleado = (id_empleado) => {
    var tematicas_eliminados = this.state.tematicas_eliminados //dotProp.set(this.state.tematicas_eliminado, `${id_empleado}.eliminado` ,true);

    tematicas_eliminados[id_empleado]=true

    var tematicas = dotProp.delete(this.state.tematicas, `${id_empleado}`);

    this.setState({tematicas, tematicas_eliminados})
  }
*/
  render() {

    var edited = false;
    if(this.props.tematicas!==this.state.tematicas){
      edited = true;
    }

    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/>
        :
          <div className='settings-panels'>
            <div className='div-save-icon pr' onClick={()=>this.opentematicas()}>
              <i className="material-icons">add</i>
              {this.state.show_tematicas?
                <PopUpLista selectOpcion={(id)=>{this.addEmpleado(id);}} opciones={this.props.tematicas_disponibles} _class='opciones-search-show position-add-enlaces' close={()=>this.setState({show_tematicas:false})}/>:null
              }

            </div>
          </div>
        }


        <p className='title-informacion-alumno'>2. Temáticas</p>

        <div className='ei-parent'>

        {this.state.tematicas?
          Object.entries(this.state.tematicas).map(([k,e])=>{
            return(/*
              <EmpleadoItem key={k}
                empleado={this.props.all_tematicas[k]}
                follows={e.follows}
                nofollows={e.nofollows}
                tipo='follows'
                changeFollows={(num)=>this.changeFollows(num,k)}
                changeNoFollows={(num)=>this.changeNoFollows(num,k)}
                deleteEmpleado = {()=>this.deleteEmpleado(k)}
                />
                */
                <div>Hola</div>
            )

          })
        :null
        }

        </div>

      </div>
    )
  }
}

export default Tematicas
