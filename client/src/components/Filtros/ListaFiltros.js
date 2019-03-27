import React, { Component } from 'react';
import dotProp from 'dot-prop-immutable';

class ListaFiltros extends Component {

  componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
  componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
  clickOutSide = (e) => {if(!this.node.contains(e.target)){this.close()}}
  close = () =>{this.props.close()}

  updateCheckBox = (id_parent,id_child,value)=>{
    let filtros;
    if(id_child==='todos'){
      filtros = dotProp.set(this.props.filtros, `${id_parent}.todos.checked`, value);
      // marcamos todos los items de este filtro segun el estado del item "todos".
      Object.entries(filtros[id_parent].items).forEach(([k,o])=>{
        o.checked=value;
      })

    }else{
      filtros = dotProp.set(this.props.filtros, `${id_parent}.items.${id_child}.checked`, value);
      console.log(filtros[id_parent]);

      //si existe alguno desmarcado, la casilla de todos la desmarcaremos tambien

      var all = Object.entries(filtros[id_parent].items).some(([k,f])=>{return f.checked===false})?false:true

      if(filtros[id_parent].todos){
        filtros[id_parent].todos.checked=all
      }

      //this.props.updateFiltros(filtros)
    }


    //var filtros = dotProp.set(this.props.filtros, `${id_parent}.items.${id_child}.checked`, value);
    this.props.updateFiltros(filtros)
  }

  updateRadioButton = (id_parent,id_child,value)=>{
    let filtros;
    if(id_child==='todos'){
      filtros = dotProp.set(this.props.filtros, `${id_parent}.todos.checked`, value);
      Object.entries(filtros[id_parent].items).forEach(([k,i])=>{
        i.checked=false;
      })
    }else{
      filtros = dotProp.set(this.props.filtros, `${id_parent}.items.${id_child}.checked`, value);
      if(filtros[id_parent].todos){ filtros[id_parent].todos.checked=false; }
      Object.entries(filtros[id_parent].items).forEach(([k,i])=>{
        if(id_child!==k){
          i.checked=false;
        }

      })
      //Object.entries(filtros[id_parent].items).forEach()
    }
    this.props.updateFiltros(filtros)
  }



  render() {
    return (
      <div className='pop-up-lista-filtros' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>
      {
        Object.entries(this.props.filtros).map(([k,i])=>{
          return(
            <div key={k} className='container-list-filter'>
              <div className='title-option-filter'>{i.title}</div>
              {i.type==='checkbox'?
                <div>
                  {i.todos?
                    <Checkbox text={i.todos.text} checked={i.todos.checked} changeValue={value=>this.updateCheckBox(k,'todos',value)}/>
                  :null}
                  {Object.entries(i.items).map(([k2,i2])=>{
                    return(
                      <Checkbox key={k2} text={i2.text} checked={i2.checked} changeValue={value=>this.updateCheckBox(k,k2,value)}/>
                    )
                  })}
                </div>
                :
                <div>
                  {i.todos?
                    <RadioButton text={i.todos.text} checked={i.todos.checked} changeValue={value=>this.updateRadioButton(k,'todos',value)}/>
                  :null}
                  {Object.entries(i.items).map(([k2,i2])=>{
                    return(
                      <RadioButton key={k2} text={i2.text} checked={i2.checked} changeValue={value=>this.updateRadioButton(k,k2,value)}/>
                    )
                  })}
                </div>
              }
            </div>
          )
        })
      }
      </div>
    )
  }
}

export default ListaFiltros;

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
