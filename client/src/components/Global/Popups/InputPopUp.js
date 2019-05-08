import React, {Component} from 'react';
import functions from '../functions'
import CheckBox from '../CheckBox'
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
        checkbox_value: this.props.checkbox_value
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
      if(this.state.checkbox_value!==newProps.checkbox_value){

        //this.setState({checkbox_value:newProps.checkbox_value})
      }
    }
    cambiandoInput = (x) => {
      var text = x.value
      if(this.state.tipo==='float'){

        if(!functions.isNumber(text)){
          return false;
        }else{
          text = functions.getNumber(text)
          var decimales = text.toString().split('.');
          if(decimales[1] && decimales[1].length>2){
            return false
          }
        }
      }

      this.setState({newValor: text, error:''})
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

      if(this.props.force==='cambiar_precio_venta'){


        if(this.props.checkbox && !this.state.checkbox_value && newValor.toString().trim()!=='' && this.props.neverLess && (+newValor) < this.props.neverLess){
          console.log('No puede ser menor que ', this.props.neverLess);
          this.setState({error:this.props.placeholder})
        }else if(this.props.checkbox && this.state.checkbox_value && this.props.neverLess_fijo && newValor.toString().trim()!=='' && this.props.neverLess_fijo && (+newValor) < this.props.neverLess_fijo){
          console.log('No puede ser menor que ', this.props.neverLess_fijo);
          this.setState({error:this.props.placeholder_fijo})
        }else{
          this.props.guardarValor(newValor, this.state.checkbox_value)
          if(this.props.cerrarClick){ this.cancelarPopUp() }
        }

      }else{
        this.props.guardarValor(newValor)
          if(this.props.cerrarClick){ this.cancelarPopUp() }
      }



    }

    render() {
      return (
        <div className={`container-opt-search ${this.props._class}`}  ref={node=>this.node=node} onClick={e=>e.stopPropagation()}>

          <div className={`opciones-search-popup pop-up-inputs ${this.props._class_div?this.props._class_div:''} ${this.state.visible?'opciones-search-show-popup':''}`}>
            <div className={`sub-pop-up-inputs ${this.props._class_container?this.props._class_container:''}`}>
              {this.props.title?
                <div className='title-pop-up'>{this.props.title}</div>
              :null}


              <div className='div-sub-pop-up-inputs'>
                {this.props.force && this.props.force==='cambiar_precio_venta'?
                  <input className="input_edit" type="text"
                    value={this.state.newValor ? this.state.newValor: ''}
                    placeholder={this.state.checkbox_value?this.props.placeholder_fijo:this.props.placeholder}
                    onChange={event => this.cambiandoInput(event.currentTarget)}
                    onKeyPress={ event => this.enterKey(event)}
                    autoFocus={true}
                  />
                  :
                  <input className="input_edit" type="text"
                    value={this.state.newValor ? this.state.newValor: ''}
                    placeholder={this.props.placeholder}
                    onChange={event => this.cambiandoInput(event.currentTarget)}
                    onKeyPress={ event => this.enterKey(event)}
                    autoFocus={true}
                  />
                }


              </div>

              {this.props.checkbox?
                <div className='checkbox_input_pop_up'>
                  <div data-role='label'>{this.props.text_checkbox}</div>
                  <CheckBox _class={`checkbox-in-table`} checked={this.state.checkbox_value} changeValue={value=>this.setState({checkbox_value:value})}/>
                </div>
              :null}

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
