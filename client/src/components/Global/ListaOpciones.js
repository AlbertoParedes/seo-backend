import React, {Component} from 'react';
class ListaOpciones extends Component {

    constructor(props){
      super(props);
      this.state = {
        opciones:this.props.opciones,
        opcion_selected:this.props.opcion_selected,
        visible:false
      }
    }

    componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
    componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
    clickOutSide = (e) => {if(!this.node.contains(e.target)){this.cancelarPopUp()}}
    cancelarPopUp = () =>{this.setState({visible:false})}

    componentWillReceiveProps = (newProps) => {
      if(this.state.opcion_selected!==newProps.opcion_selected)this.setState({opcion_selected:newProps.opcion_selected})
    }

    render() {
      return (
        <div className='container-opt-search'  ref={node=>this.node=node}>
          <span  onClick={()=>this.setState({visible:true})}>{this.state.opciones[this.state.opcion_selected].valor}
            <i className={`material-icons arrow-opc-search ${this.state.visible?'arrow-opc-search-active':''}`}> expand_more </i>
          </span>
          <div className={`opciones-search ${this.state.visible?'opciones-search-show':''}`}>
            {Object.entries(this.state.opciones).map(([k,o])=>{
              return(
                <li className={`${this.state.opcion_selected===k?'color-azul':''}`} key={k} onClick={()=>{this.props.changeOpcion(k);this.cancelarPopUp()}}>{o.valor}</li>
              )
            })}
          </div>
        </div>
      );
    }
}

export default ListaOpciones;
