import React, { Component } from 'react';
import SimpleInputDesplegable from './SimpleInputDesplegableMin'
class ListaObject extends Component {

  componentWillMount = () => { document.addEventListener('mousedown', this.clickOutSide, false); }
  componentWillUnmount = () => { document.removeEventListener('mousedown', this.clickOutSide, false); }
  clickOutSide = (e) => { if (!this.node.contains(e.target)) { this.props.close() } }

  changeValor = (k,o) => {
    
    
    
    if(o && o.isSubmenu){
      this.props.changeValor(k,o); 
    }else{
      //console.log(k,o);
      this.props.changeValor(k,o); 
      this.props.close(o)
    }

  }

  render() {
    return (
      <div className={`lista-seleccionable-inputMin ${this.props.submenu?'parent-submenu':''}`} onClick={e => e.stopPropagation()} ref={node => this.node = node}>
        {Object.entries(this.props.lista).map(([k, o]) => {
          return (
            <div className={`${o._class && o.isSubmenu?o._class:''}`} key={k} onClick={() => { this.changeValor(k,o) }}>
              <span>{o.texto}</span>
              {this.props.submenu && o.submenu?
                <div className='submenu'>
                  <SimpleInputDesplegable type='object' isSubmenu={o.isSubmenu} close={this.props.close} title='' _class_input='mgn_0 status-task' text={''} lista={o.submenu} changeValor={estado => { this.changeValor({ estado,o }) }} />
                </div>
              :null}
            </div>
          )
        })
        }
      </div>
    );
  }
}
export default ListaObject