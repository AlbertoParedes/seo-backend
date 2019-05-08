import React, {Component} from 'react';
import functions from './functions'
class DesplegableInfo extends Component {

    constructor(props){
      super(props);
      this.state = {
        title:this.props.title,
        text:this.props.text,
        _class:this.props._class,
        _class_input:this.props._class_input,
        show_lista:false
      }
    }

    componentWillReceiveProps = newProps => {
      if(this.state.text!==newProps.text){this.setState({text:newProps.text})}
    }

    openDesplegable = () => {
      if(this.props.type && this.props.type==='block'){
        console.log('No tienes suficientes permisos');
        return false
      }
      this.setState({show_lista:true})
    }

    render() {
      return (
        <div className={`container-simple-input ${this.state._class?this.state._class:''}`}>
          <div className='title-input'>{this.state.title}:</div>
          <div className={`container-input pr ${this.state.show_lista?'activate-container-selec':''}`} onClick={()=>this.openDesplegable()}>

            <div className={`text-seleccionable ${this.props._class_input?this.props._class_input:''}`}>
              <span className='display_flex'>
                <span>{this.props.number}</span>
                {(+this.props.number)>0?<i className="material-icons arrow-desplegable"> arrow_right_alt </i>:null}
                <span className='block-with-text'>{this.props.text}</span>
              </span>
            </div>

            <div className='arrow-seleccionable-input'><i className={`material-icons arrow-down-select ${this.state.show_lista?'arrow-top-select':''}`}>arrow_drop_down</i></div>
            {/*si no hay tipo por defecto esperaremos un array*/}
            { !this.props.type && this.state.show_lista?
                <Lista lista={this.props.lista} close={()=>this.setState({show_lista:false})} changeValor={(valor)=>this.props.changeValor(valor)}/>
              :null
            }
            {this.props.type && this.props.type==='object' && this.state.show_lista?
              <ListaObject lista={this.props.lista} close={()=>this.setState({show_lista:false})} changeValor={(valor)=>this.props.changeValor(valor)}/>
              :null
            }

            {this.props.type && this.props.type==='object-kw' && this.state.show_lista?
              <ListaObjectKw obligacion={this.props.obligacion?this.props.obligacion:false} nuevo={this.props.nuevo} lista={this.props.lista} close={()=>this.setState({show_lista:false})} setNuevo={(valor)=>this.props.setNuevo(valor)} deleteItem={(id=>this.props.deleteItem(id))}/>
              :null
            }
          </div>
        </div>
      );
    }
}

export default DesplegableInfo;

//Este metodo solo es para las keywords y los destinos de cada cliente
class ListaObjectKw extends Component {

    componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
    componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
    clickOutSide = (e) => {if(!this.node.contains(e.target)){this.props.close()}}

    render() {

      return (
        <div className='lista-seleccionable-input' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>

          <div className='new-destino-anchor'>
            <i className="material-icons align-center new-destino">forward</i>
            <input className='break_sentence' value={this.props.nuevo} onChange={e=>this.props.setNuevo(e.target.value)} placeholder={this.props.title==='Anchors'?'Añade un anchor nuevo':'Añade un destino nuevo'}/>
          </div>

          {Object.entries(this.props.lista).map(([k,o])=>{

            var right = true;
            if(this.props.obligacion==='isLink' && o.web){
              right = functions.isLink(o.web)
            }

            //vemos si se repite web o anchor
            var repetido = false
            if(o.anchor){
              repetido = Object.entries(this.props.lista).some(([k1,e])=>{ return o.anchor.trim()===e.anchor.trim() && k1!==k} )
            }else{
              repetido = Object.entries(this.props.lista).some(([k1,e])=>{return o.web.toLowerCase().trim()===e.web.toLowerCase().trim() && k1!==k})
            }

            return(
              <div className='item-destino-anchor' key={k}>
                <span className={right && !repetido?'':'color-wrong'}>{o.anchor?o.anchor:o.web}</span>
                <i onClick={()=>this.props.deleteItem(o.anchor?o.id_anchor:o.id_destino)} className="material-icons delete-destino-anchor"> delete_outline </i>
              </div>
            )
          })
          }
        </div>
      );
    }
}

class ListaObject extends Component {

    componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
    componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
    clickOutSide = (e) => {if(!this.node.contains(e.target)){this.props.close()}}

    render() {
      return (
        <div className='lista-seleccionable-input' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>
          {Object.entries(this.props.lista).map(([k,o])=>{
            return(
              <div key={k} onClick={()=>{this.props.changeValor(k);this.props.close()}}>{o.texto}</div>
            )
          })
          }
        </div>
      );
    }
}

class Lista extends Component {

    componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
    componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
    clickOutSide = (e) => {if(!this.node.contains(e.target)){this.props.close()}}

    render() {
      return (
        <div className='lista-seleccionable-input' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>
          {this.props.lista.map((o,k)=>{
            return(
              <div key={k} onClick={()=>{this.props.changeValor(o);this.props.close()}}>{o}</div>
            )
          })
          }
        </div>
      );
    }
}
