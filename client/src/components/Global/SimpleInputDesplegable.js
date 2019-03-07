import React, {Component} from 'react';
class SimpleInputDesplegable extends Component {

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


    render() {
      return (
        <div className={`container-simple-input ${this.state._class?this.state._class:''}`}>
          <div className='title-input'>{this.state.title}:</div>
          <div className={`container-input pr ${this.state.show_lista?'activate-container-selec':''}`} onClick={()=>this.setState({show_lista:true})}>
            <div className={`text-seleccionable ${this.props._class_input?this.props._class_input:''}`}>{this.state.text?this.state.text:''}</div>
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
          </div>
        </div>
      );
    }
}

export default SimpleInputDesplegable;

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
