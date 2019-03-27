import React, {Component} from 'react';
import functions from '../functions'
import search from '../Imagenes/search.svg';

class InputPopUp extends Component {

    constructor(props){
      super(props);
      this.state = {
        valor: this.props.valor,
        newValor : this.props.valor,
        visible:false,
        tipo : this.props.tipo,
        json: this.props.json,
        error : '',
      }
    }

    componentWillMount = () => {
      document.addEventListener('mousedown',this.clickOutSide, false);
      var self = this
      setTimeout(function() { self.setState({visible:true}) }, 10);
  }
    componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
    clickOutSide = (e) => {if(!this.node.contains(e.target)){this.cancelarPopUp()}}
    cancelarPopUp = () =>{
      this.setState({visible:false},()=>{
        var self = this
        setTimeout(function() { self.props.close() }, 500);

      })
    }

    enterKey = (event) => {if(event.key === 'Enter'){this.guardarPopUpInput(event.currentTarget)}}

    componentWillReceiveProps = (newProps) => {
      if(this.state.valor!==newProps.valor)this.setState({valor:newProps.valor})
      if(this.state.json!==newProps.json)this.setState({json:newProps.json})
    }
    cambiandoInput = (x) => {
      this.setState({newValor: x.value, error:''})
    }
    guardarPopUpInput = () =>{
      var newValor = this.state.newValor;
      if(this.state.tipo === "text"){
        if(this.props.obligacion){
          if(this.props.obligacion==="link"){
            if(newValor.trim()!=='' && !newValor.trim().startsWith('http://') && !newValor.trim().startsWith('https://')) { this.setState({error: 'Debe empezar por http:// o https://'}); return false;}
            if(newValor.trim()!=='' && !newValor.includes('.') ) { this.setState({error: 'Debe contener un " . "'}); return false;}
          }
        }
      }

      this.props.guardarValor(newValor)
      if(this.props.cerrarClick){
        this.cancelarPopUp()
      }
    }

    render() {
      return (
        <div className={`container-opt-search ${this.props._class}`}  ref={node=>this.node=node}>

          <div className={`opciones-search-popup pop-up-inputs ${this.props._class_div?this.props._class_div:''} ${this.state.visible?'opciones-search-show-popup':''}`}>
            <div className={`sub-pop-up-inputs ${this.props._class_container?this.props._class_container:''}`}>
              {this.props.title?
                <div className='title-pop-up'>{this.props.title}</div>
              :null}


              <div className='div-sub-pop-up-inputs'>
                <input className="input_edit" type="text"
                  value={this.state.newValor ? this.state.newValor: ''}
                  placeholder={this.props.placeholder}
                  onChange={event => this.cambiandoInput(event.currentTarget)}
                  onKeyPress={ event => this.enterKey(event)}
                  autoFocus={true}
                />

              </div>

              {this.state.error!==''?<div className="info_input_wrong"><span>{this.state.error}</span></div>:null}

              <div className="options_input_pop_up">
                <div className="btn_cancelar_pop_up" onClick={ () => this.cancelarPopUp()}>Cancelar</div>
                <div className="btn_guardar_pop_up" onClick={ () => this.guardarPopUpInput()}>Guardar</div>
              </div>

            </div>
          </div>
        </div>
      );
    }
}

export default InputPopUp;
