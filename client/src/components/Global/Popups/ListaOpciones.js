import React, {Component} from 'react';
import functions from '../functions'
import search from '../Imagenes/search.svg';

class ListaOpciones extends Component {

    constructor(props){
      super(props);
      this.state = {
        opciones:this.props.opciones,
        opcion_selected:this.props.opcion_selected,
        visible:false,
        search:'',
        search_new:this.props.search_new?this.props.search_new:'',
        correct_new_item: false,
        show_micronichos:false
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

    componentWillReceiveProps = (newProps) => {
      if(this.state.opcion_selected!==newProps.opcion_selected)this.setState({opcion_selected:newProps.opcion_selected})
      if(this.state.opciones!==newProps.opciones)this.setState({opciones:newProps.opciones})
      if(this.state.search_new!==newProps.search_new)this.setState({search_new:newProps.search_new})
    }

    clickLink = (e,id,obj) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.selectOpcion(id,obj)
      if(this.props.cerrarClick){
        this.cancelarPopUp()
      }
    }

    changeNew = (text) => {
      if(this.props.obligacion==='link'){
        var correct_new_item = true
        if(text.trim()!=='' && !text.trim().startsWith('http://') && !text.trim().startsWith('https://')) { correct_new_item=false }
        if(text.trim()!=='' && !text.includes('.') ) { correct_new_item=false }
        this.setState({search_new:text,correct_new_item})
      }else{
        this.setState({search_new:text,correct_new_item:text.trim()!==''?true:false})
      }
    }
    enterKeyNew = (event) => {
      if(event.key === 'Enter' && this.state.correct_new_item && this.props.search_new!==this.state.search_new && this.state.search_new.trim()!==''){
        this.props.guardarNew(this.state.search_new);
        this.cancelarPopUp()
      }
    }

    openMicronichos = (e) => {

      e.preventDefault();
      e.stopPropagation();

      this.setState({show_micronichos:this.state.show_micronichos?false:true})

    }

    clickMicronicho = (e,id_micronicho) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState({show_micronichos:false})
      this.props.setMicronicho(id_micronicho)
    }

    render() {

      return (
        <div className={`container-opt-search ${this.props._class}`}  ref={node=>this.node=node}>

          <div className={`opciones-search-popup ${this.props._class_div?this.props._class_div:''} ${this.state.visible && !this.props.hover?'opciones-search-show-popup':''}`}>
            <div className={`${this.props._class_container?this.props._class_container:''}`}>
              {this.props.title?
                <div className='title-pop-up'>{this.props.title}</div>
              :null}

              {this.props.micronichos?
              <div className={`selected_micronicho_usados`} onClick={(e)=>this.openMicronichos(e)}>
                <div className='item-micronicho-seleccionado'>
                  <a href={this.props.micronichos[this.props.micronicho_selecionado].web} onClick={(e)=>{this.openMicronichos(e)}}>{functions.cleanProtocolo(this.props.micronichos[this.props.micronicho_selecionado].web)}</a>
                </div>

                {this.state.show_micronichos?

                  <div className='pop-up-micronichos-lista'>
                    <li  onClick={(e)=>{this.clickMicronicho(e,'home')}} >
                      <a href={this.props.micronichos.home.web} className={`${this.props.micronicho_selecionado==='home'?'color-azul':''}`} onClick={(e)=>{this.clickMicronicho(e,'home')}}>{functions.cleanProtocolo(this.props.micronichos.home.web)}</a>
                    </li>
                    {Object.entries(this.props.micronichos).map(([k,m])=>{
                      if(k==='home')return null
                      return(
                        <li  key={k} onClick={(e)=>{this.clickMicronicho(e,k)}} >
                          <a href={m.web} className={`${this.props.micronicho_selecionado===k?'color-azul':''}`} onClick={(e)=>{this.clickMicronicho(e,k)}}>{functions.cleanProtocolo(m.web)}</a>
                        </li>
                      )

                    })}
                  </div>

                  :null
                }

              </div>
              :null}

              {this.props.buscar?
              <li className={``}>
                <img className='icon-search-panel' src={search} alt=''/>
                <input placeholder={this.props.placeholder_buscar?this.props.placeholder_buscar:''} value={this.state.search} onChange={(e)=>this.setState({search:e.target.value})}/>
              </li>
              :null}

              {this.props.new?
              <li className={`${this.props._class_new?this.props._class_new:''}`}>
                <i className="material-icons align-center new-destino">forward</i>
                <input onKeyPress={ event => this.enterKeyNew(event)} className='break_sentence' placeholder={this.props.placeholder_new?this.props.placeholder_new:''} value={this.state.search_new} onChange={(e)=>this.changeNew(e.target.value)}/>
                {this.state.correct_new_item && this.props.search_new!==this.state.search_new && this.state.search_new.trim()!=='' ?
                  <i onClick={()=>{this.props.guardarNew(this.state.search_new);this.cancelarPopUp()}} className="material-icons align-center save-destino">save</i> : null
                }
              </li>
              :null}

              {Object.entries(this.state.opciones).map(([k,o])=>{
                if(this.state.search.trim()!=='' && !o.valor.includes(this.state.search))return null
                return(
                  this.props.tag && this.props.tag==='a'?
                    <li  key={k} onClick={(e)=>{this.clickLink(e,k,o)}} ><a href={o.valor} className={`${this.state.opcion_selected===k || o.selected?'color-azul':''}`} onClick={(e)=>{this.clickLink(e,k,o)}}>{this.props.cleanLink?functions.cleanProtocolo(o.valor):o.valor}</a></li>
                  :
                    this.props.cerrarClick ?
                      <li onClick={()=>{this.props.selectOpcion(k,o);this.cancelarPopUp() } } className={`${this.state.opcion_selected===k || o.selected?'color-azul':''}`} key={k}>{o.valor}</li>
                    :
                      <li onClick={()=>this.props.selectOpcion(k,o)} className={`${this.state.opcion_selected===k?'color-azul':''}`} key={k}>{o.valor}</li>


                )
              })}

              {this.props.opcionEliminar?
                <span className='eliminar_pop_up' onClick={()=>this.props.eliminar()}>{this.props.title_eliminar}</span>
                :null}

            </div>
          </div>
        </div>
      );
    }
}

export default ListaOpciones;
