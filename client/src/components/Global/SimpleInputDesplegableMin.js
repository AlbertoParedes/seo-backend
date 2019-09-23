import React, { Component } from 'react';
import ListaObject from './ListaObject'
export default class SimpleInputDesplegableMin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      text: this.props.text,
      _class: this.props._class,
      _class_input: this.props._class_input,
      show_lista:false
    }
  }

  componentWillReceiveProps = newProps => {
    if (this.state.text !== newProps.text) { this.setState({ text: newProps.text }) }
  }

  openList = (e) => {
    e.stopPropagation()
    if (this.props.type && this.props.type === 'block') {
      return null
    }

    this.setState({ show_lista: true })

  }

  changeValor = (valor,o) => {
    
    
    if(o && o.isSubmenu){
      //si es un submenu no haremos nada
    }else{
      this.props.changeValor(valor)
      this.close(o)
    }
    
    //this.props.changeValor(valor)
  }

  close = (o) => {
    //this.setState({show_lista:false})
    try {
      
      if(o){
        this.setState({show_lista:false})
        this.props.close(o)

        
      }else{
        this.setState({show_lista:false})
      }
      

    } catch (error) {

    }
  }

  render() {
    
    return (
      <span onClick={(e) => { this.openList(e) }} className={`spanPadreSimpleDesplegableMin ${this.props.isSubmenu?'isSubmenu':''} ${this.props._class_input ? this.props._class_input : ''}`} >

        {this.props.icon?
          <i className={`material-icons ${this.props.icon._class}`}>{this.props.icon.icon}</i>
        :null
        }

        {!this.props.isSubmenu?
          <span className={this.props._classSpan ? this.props._classSpan : null} >{this.state.text ? this.state.text : ''}</span>
          :null
        }

        {!this.props.type && this.state.show_lista ?
          <Lista lista={this.props.lista}  close={() => this.setState({ show_lista: false })} changeValor={(valor) => this.props.changeValor(valor)} />
          : null
        }
        {this.props.type && this.props.type === 'object' && (this.state.show_lista || this.props.isSubmenu) ?
          <ListaObject lista={this.props.lista} submenu={this.props.submenu} close={this.close} changeValor={(valor,o) => this.changeValor(valor,o)} />
          : null
        }
      </span>


    );
  }
}







class Lista extends Component {

  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.props.close() } }

  render() {
    return (
      <div className='lista-seleccionable-inputMin' onClick={e => e.stopPropagation()} ref={node => this.node = node}>
        {this.props.lista.map((o, k) => {
          return (
            <div key={k} onClick={() => { this.props.changeValor(o); this.props.close() }}>{o}</div>
          )
        })
        }
      </div>
    );
  }
}



{/*
      <div className={`container-simple-input simpleDesplegableMin ${this.state._class ? this.state._class : ''}`}>
        <div className={`container-input pr ${this.state.show_lista ? 'activate-container-selec' : ''}`} >
          <span onClick={() => { this.openList() }} className={`${this.props._class_input ? this.props._class_input : ''}`}>{this.state.text ? this.state.text : ''}</span>


          {!this.props.type && this.state.show_lista ?
            <Lista lista={this.props.lista} close={() => this.setState({ show_lista: false })} changeValor={(valor) => this.props.changeValor(valor)} />
            : null
          }
          {this.props.type && this.props.type === 'object' && this.state.show_lista ?
            <ListaObject lista={this.props.lista} close={() => this.setState({ show_lista: false })} changeValor={(valor) => this.props.changeValor(valor)} />
            : null
          }

        </div>
      </div>
      */}