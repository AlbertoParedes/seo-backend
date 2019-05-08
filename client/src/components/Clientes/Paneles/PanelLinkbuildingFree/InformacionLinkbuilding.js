import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import functions from '../../../Global/functions'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class InformacionLinkbuilding extends Component {
  constructor(props){
    super(props);
    this.state={
      status:this.props.status,
      follows:this.props.follows,
      nofollows:this.props.nofollows,
      seo:this.props.seo,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.status !== nextProps.status ||
        this.props.follows !== nextProps.follows ||
        this.props.nofollows !== nextProps.nofollows ||
        this.props.seo !== nextProps.seo ){
      return true;
    }else if( this.state !== nextState){
      return true;
    }
    return false;
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.props.status!==newProps.status){ this.setState({status: newProps.status}) }
    if(this.props.follows!==newProps.follows){ this.setState({follows: newProps.follows}) }
    if(this.props.nofollows!==newProps.nofollows){ this.setState({nofollows: newProps.nofollows}) }
    if(this.props.seo!==newProps.seo){ this.setState({seo: newProps.seo}) }
  }

  undoData = () =>{ this.setState(this.props) }

  saveData = () => {

    if(this.state.follows.toString().includes('.')  || this.state.follows.toString().includes(',') || this.state.follows.toString().trim()==='' || (+this.state.follows)<0){
      console.log('El número de follows es incorrecto');
      return false;
    } else if(this.state.nofollows.toString().includes('.')  || this.state.nofollows.toString().includes(',') || this.state.nofollows.toString().trim()==='' || (+this.state.nofollows)<0){
      console.log('El número de nofollows es incorrecto');
      return false;
    }


    var multiPath={};

    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/activo`]=this.state.status==='Activado'?true:false
    multiPath[`Clientes/${this.props.id_cliente}/seo`]=this.state.seo
    multiPath[`Clientes/${this.props.id_cliente}/follows`]=(+this.state.follows)
    multiPath[`Clientes/${this.props.id_cliente}/nofollows`]=(+this.state.nofollows)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${functions.getTodayDate()}/follows`]=(+this.state.follows)
    multiPath[`Clientes/${this.props.id_cliente}/servicios/linkbuilding/free/home/mensualidades/${functions.getTodayDate()}/nofollows`]=(+this.state.nofollows)




    console.log(multiPath);

    db.update(multiPath)
    .then(()=>{console.log('Ok');})
    .catch(err=>{console.log(err);})



  }

  changeSeo = (seo) => {
    var follows =0, nofollows = 0
    if(seo==='Lite'){
      follows = 3;
      nofollows = 5;
    }else if(seo==='Pro'){
      follows = 4;
      nofollows = 10;
    }else if(seo==='Premium'){
      follows = 6;
      nofollows = 15;
    }else if(seo==='A medida'){
      follows = 0;
      nofollows = 0;
    }

    this.setState({seo, follows, nofollows})
  }


  render() {

    var privilegio = false
    try {
      privilegio = this.props.empleado.privilegios.linkbuilding_free.edit.info;
    } catch (e) {}

    var edited = false;
    if(this.props.status!==this.state.status ||
       this.props.follows!==this.state.follows ||
       this.props.nofollows!==this.state.nofollows ||
       this.props.seo!==this.state.seo){
      edited = true;
    }
    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        {/*Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable type={`${privilegio?'':'block'}`} lista={data.estados_act_des} title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>
          <SimpleInputDesplegable type={`${privilegio?'':'block'}`} lista={data.seo} title='Seo'  text={this.state.seo} changeValor={(seo)=>this.changeSeo(seo)}/>
        </div>


        {/*follows y no follows*/}
        <div className='col-2-input'>
          <SimpleInput title='Follows' _class_container={this.state.follows.toString().includes('.')  || this.state.follows.toString().includes(',') || this.state.follows.toString().trim()==='' || (+this.state.follows)<0? 'error-form-input':null}  type={`${privilegio /*&& this.state.seo==='A medida'*/?'float':'block'}`} text={this.state.follows.toString()} changeValue={follows=>{this.setState({follows})}} />
          <SimpleInput title='Nofollows' _class_container={this.state.nofollows.toString().includes('.')  || this.state.nofollows.toString().includes(',') || this.state.nofollows.toString().trim()==='' || (+this.state.nofollows)<0? 'error-form-input':null}  type={`${privilegio /*&& this.state.seo==='A medida'*/?'float':'block'}`}  text={this.state.nofollows.toString()} changeValue={nofollows=>{this.setState({nofollows})}} />
        </div>


      </div>
    )
  }
}

export default InformacionLinkbuilding
