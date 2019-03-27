import React, { Component } from 'react';
import dotProp from 'dot-prop-immutable';

class ListaVistas extends Component {

  componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
  componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
  clickOutSide = (e) => {if(!this.node.contains(e.target)){this.close()}}
  close = () =>{this.props.close()}

  updateCheckBox = (id_child,value)=>{
    let vistas = dotProp.set(this.props.vistas, `items.${id_child}.checked`, value);
    this.props.updateVistas(vistas)
  }

  updateRadioButton = (id_child,value)=>{
    let vistas = dotProp.set(this.props.vistas, `items.${id_child}.checked`, value);
    Object.entries(this.props.vistas.items).forEach(([k,i])=>{
      if(id_child!==k){
        i.checked=false;
      }
    })
    this.props.updateVistas(vistas)
  }



  render() {
    console.log(this.props.vistas);
    return (
      <div className='pop-up-lista-filtros container-vistas' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>
        <div className='container-list-filter'>
          {this.props.vistas.type==='checkbox'?
            <div>
              {Object.entries(this.props.vistas.items).map(([k2,i2])=>{
                return(
                  <Checkbox key={k2} text={i2.text} checked={i2.checked} changeValue={value=>this.updateCheckBox(k2,value)}/>
                )
              })}
            </div>
            :
            <div>
              {Object.entries(this.props.vistas.items).map(([k2,i2])=>{
                return(
                  <RadioButton key={k2} text={i2.text} checked={i2.checked} changeValue={value=>this.updateRadioButton(k2,value)}/>
                )
              })}
            </div>
          }
        </div>
      </div>
    )
  }
}

export default ListaVistas;

class Checkbox extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.checked!==nextProps.checked)return true;
    return false;
  }

  render(){
    return(
      <div className='container-item-check-box' onClick={()=>this.props.changeValue(this.props.checked?false:true)}>
        <div>
          <div className={`checkbox-container-w2a checkbox-w2a ${this.props.checked?'checkbox-w2a-active':''}`} ></div>
        </div>
        <span>{this.props.text}</span>

      </div>
    )
  }

}

class RadioButton extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.checked!==nextProps.checked)return true;
    return false;
  }

  render(){
    return(
      <div className='container-item-check-box' onClick={()=>this.props.changeValue(true)}>
        <div>
          <div className={`checkbox-container-w2a radiobutton-w2a ${this.props.checked?'radiobutton-w2a-active':''}`} ></div>
        </div>
        <span>{this.props.text}</span>

      </div>
    )
  }

}
