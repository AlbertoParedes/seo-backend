import React, { Component } from 'react';
import dotProp from 'dot-prop-immutable';

class ItemsFiltro extends Component {

  updateItem = (id_parent,id_child,value)=>{
    var filtros = dotProp.set(this.props.filtros, `${id_parent}.items.${id_child}.checked`, value);

    if(filtros[id_parent].required && filtros[id_parent].type==='radiobutton'){
      Object.entries(filtros[id_parent].items).forEach(([k,o])=>{
        if(id_child!==k && value ===false){
          o.checked=true;
        }

      })
    }

    var encontrado = Object.entries(filtros[id_parent].items).some(([k,o])=>{ return o.checked })
    if(!encontrado && filtros[id_parent].todos && filtros[id_parent].type==='radiobutton'){
      filtros[id_parent].todos.checked=true;
    }else if(!encontrado && filtros[id_parent].todos && filtros[id_parent].type==='checkbox'){
      filtros[id_parent].todos.checked=true;
      Object.entries(filtros[id_parent].items).forEach(([k,o])=>{
        o.checked=true;
      })
    }
    this.props.updateFiltros(filtros)
  }

  render() {

    return (
      <div className='container-filtros'>
        {
          Object.entries(this.props.filtros).map(([k,i])=>{

            var anyTrue = Object.entries(i.items).some(([key,obj])=>{return !obj.checked})
            if(anyTrue===false)return null;

            return(
              Object.entries(i.items).map(([k2,i2])=>{
                return(
                  <Item  key={k2} text={i2.text_info} checked={i2.checked} changeValue={value=>this.updateItem(k,k2,value)}/>
                )
              })
            )
          })
        }
      </div>
    )
  }
}

export default ItemsFiltro;

class Item extends Component {

  shouldComponentUpdate = nextProps => {
    if(this.props.checked!==nextProps.checked)return true;
    return false;
  }

  render(){
    if(!this.props.checked)return null;
    return(
      <div>
        {this.props.text}
        <svg onClick={()=>this.props.changeValue(false)} className="delete_item_filter" height="24" viewBox="0 0 24 24" width="17"><path className="btn_detele_item_filter" d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"></path></svg>
      </div>
    )
  }

}
