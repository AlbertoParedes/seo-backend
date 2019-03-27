import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import UpdateStateInputs from '../../../Global/UpdateStateInputs'

class InformacionLinkbuilding extends Component {
  constructor(props){
    super(props);
    this.state={
      status:this.props.status,
      follows:this.props.follows,
      nofollows:this.props.nofollows,
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>{

    if( this.props.status !== nextProps.status ||
        this.props.follows !== nextProps.follows ||
        this.props.horas_semanales !== nextProps.horas_semanales){
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
  }

  undoData = () =>{ this.setState(this.props) }

  render() {
    var edited = false;
    if(this.props.status!==this.state.status ||
       this.props.follows!==this.state.follows ||
       this.props.nofollows!==this.state.nofollows){
      edited = true;
    }
    return(
      <div className='sub-container-informacion'>

        {edited? <UpdateStateInputs saveData={()=>this.saveData()} undoData={()=>this.undoData()}/> :null }

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        {/*Estado*/}
        <SimpleInputDesplegable _class='div_text_mitad' lista={data.estados_act_des} title='Estado'  text={this.state.status} changeValor={(status)=>this.setState({status})}/>

        {/*follows y no follows*/}
        <div className='col-2-input'>
          <SimpleInput title='Follows'  text={this.state.follows} changeValue={follows=>{this.setState({follows})}} />
          <SimpleInput title='Nofollows'  text={this.state.nofollows} changeValue={nofollows=>{this.setState({nofollows})}} />
        </div>


      </div>
    )
  }
}

export default InformacionLinkbuilding
