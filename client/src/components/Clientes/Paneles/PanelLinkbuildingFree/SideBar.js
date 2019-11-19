import React, {Component, PureComponent} from 'react'
import {cleanProtocolo, isLink} from '../../../Global/functions'
import moment from 'moment'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setVistaLinkBuilding, setClienteSeleccionado, setPanelClientesFreeLinkbuilding } from '../../../../redux/actions';
import data from '../../../Global/Data/Data'
import _ from 'underscore';

import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();

class SideBar extends Component{

  constructor(props){
    super(props)
    this.state={
      
      estrategia:this.props.estrategia,
      search:'',
      visible: false,
      showNewUrlInput: false,
      newUrl: "",
      newUrlIsLink:false
    }
  }

  componentWillReceiveProps = (newProps) => {
    if(this.state.estrategia!==newProps.estrategia){
      this.setState({estrategia: newProps.estrategia})
    }
  }

  componentDidMount = () => {
    setTimeout(() => { 
      this.setState({visible:true})
    }, 0)
  }

  close = () => {

    this.setState({visible:false})

    setTimeout(() => { 
      this.props.callBack()
    }, 500)

  }

  openCliente = id_cliente => {
    
  }

  isRepeat = (dominio, idUrl) => {
    var repetidos = Object.entries(this.state.estrategia.urls).some(([i,url])=> idUrl !== i && cleanProtocolo(url.url.toLowerCase())===cleanProtocolo(dominio.toLowerCase()))
    if(repetidos)return true
    return false
  }


  enterKey = (event) => {
    if(!this.props.privilegio)return false
    if(event.key === 'Enter' && this.state.newUrlIsLink){
      this.addNewDestino()
    }
  }

  addNewDestino = () => {
    if(!this.props.privilegio)return false
    var estrategia = JSON.parse(JSON.stringify(this.state.estrategia))
    const key = db.child(`${this.props.path}`).push().key;

    if(!estrategia.urls)estrategia.urls={}
    if(!estrategia.urls[key])estrategia.urls[key]={}
    estrategia.urls[key]={
      url:"",
    }
    this.props.setNewEstrategia(estrategia)
  }

  setKeywords = (keywords, id) => {
    if(!this.props.privilegio)return false
    var estrategia = JSON.parse(JSON.stringify(this.state.estrategia))
    estrategia.urls[id].keywords = keywords
    this.props.setNewEstrategia(estrategia)
  }

  setUrl = (url, id) => {
    if(!this.props.privilegio)return false
    var estrategia = JSON.parse(JSON.stringify(this.state.estrategia))
    estrategia.urls[id].url=url
    this.props.setNewEstrategia(estrategia)
  }

  deleteUrl = (id) => {
    if(!this.props.privilegio)return false
    var estrategia = JSON.parse(JSON.stringify(this.state.estrategia))
    delete estrategia.urls[id]
    this.props.setNewEstrategia(estrategia)
  }




  render(){

    return(
      <div className='container-block-side' onClick={()=>{this.close()}}>
        <div className={`container-side ${this.state.visible?'container-side-activo':''}`} onClick={(e)=>e.stopPropagation(e)}>
          <div className='title-side-bar-medios pr'>

            <div className='close-side-bar-medios'><i className="material-icons " onClick={()=>this.close()}> cancel </i></div>

            <div className='text-title-medios'>Estrategia</div>
            
            <div className='subtext-title-medios'>{this.props.subtext}</div>
            <div className='container-opciones-medios'>
              <div className={`opciones-bar-medios width_100 opc-activa txt-title-url-estrategia`}>
                <span className="pr add-new-destino-estrategia" onClick={()=>this.addNewDestino()}>
                  Nuevo destino
                  {/*
                  <i className="material-icons add-new-input add-new-item-estrategia item-add-new-url-estrategia" onClick={()=>this.addNewDestino()}> cancel </i>
                   */}
                </span>
              </div>
            </div>

          </div>
          <div className='scroll-side scroll-bar-medios pr' >

            {/* 
            <div className='medios-cliente-disponible pr search-side-bar'>
              <i class="material-icons"> search </i>
              <input value={this.state.search} onChange={e=>this.setState({search:e.target.value})} placeholder={'Busca una url o una keyword'} />
            </div>
            */}
            
            {
              this.state.estrategia.urls ? Object.entries(this.state.estrategia.urls).map(([k,url])=>{
                var correctUrl = this.isRepeat(url.url, k)?false:true
                if(correctUrl) correctUrl = isLink(url.url)

                return(
                  <Url key={k} privilegio={this.props.privilegio} correctUrl={correctUrl} deleteUrl={()=>this.deleteUrl(k)}  id={k} path={this.props.path} url={url.url} keywords={url.keywords?url.keywords:{}} changeUrl={(url)=>this.setUrl(url,k)} setKeywords={keywords=>this.setKeywords(keywords, k)} />
                )
              }):null
            }
          </div>
        </div>
      </div>

    )
  }

}

function mapStateToProps(state){return{ empleado : state.empleado, cliente_seleccionado: state.cliente_seleccionado }}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setVistaLinkBuilding, setClienteSeleccionado, setPanelClientesFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(SideBar);

class Url extends Component{
  constructor(props){
    super(props)
    this.state={
      showKeywords:true,
      showDelete:false
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    var update = false
    if(this.props.id!==nextProps.id || 
      this.props.url!==nextProps.url || 
      this.props.privilegio!==nextProps.privilegio || 
      !_.isEqual(this.props.keywords, nextProps.keywords) ||
      this.props.correctUrl!==nextProps.correctUrl
    ){
      update = true
    }
    if(this.state!==nextState){
      update=true
    }
    return update
  }

  addNewKeyword = () =>{
    if(!this.props.privilegio)return false
    const key = db.child(`${this.props.path}/${this.props.id}`).push().key;
    var keywords = {
      ...this.props.keywords,
      [key] : {
        keyword: "",
      }
    }

    this.props.setKeywords(keywords)
    this.setState({showKeywords:true})

  }
  changeKeyword = (keyword, key) => {
    if(!this.props.privilegio)return false
    var keywords = {
      ...this.props.keywords,
      [key]:{
        keyword
      }
    }
    this.props.setKeywords(keywords)
  }

  onKeyDown = (event) => {
    if(!this.props.privilegio)return false 
    if(event.key=='Shift'){
      this.setState({showDelete:true})
    }
    
  }
  onKeyUp = (event) => {
    if(!this.props.privilegio)return false
    if(event.key=='Shift'){
      this.setState({showDelete:false})
    }
  }


  render(){
    
    return(
      <div  className='medios-cliente-disponible pr'>
        <div className='info-cli-dispo'>
          <div className='arrow-container-sidebar' onClick={()=>this.setState({showKeywords:!this.state.showKeywords})}>
            <i className={`material-icons ${this.state.showKeywords?'open-arrow-sidebar':''}`} > arrow_right </i>
          </div>
          <div className="pr edit-url-container-estrategia">
            <input onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} className={`item-keyword-estrategia-input ${!this.props.correctUrl?'obligatorio_color':''}`} placeholder={'Agrega un destino nuevo'} value={this.props.url} onChange={(e)=>{this.props.changeUrl(e.target.value)}}/>

          </div>
          {this.state.showDelete?
            <i className={`material-icons add-new-item-estrategia obligatorio_color`} onClick={()=>{this.props.deleteUrl()}}> cancel </i>

            :
            <i className={`material-icons add-new-input add-new-item-estrategia`} onClick={()=>{this.addNewKeyword()}}> cancel </i>

          }

        </div>
        {this.state.showKeywords && Object.keys(this.props.keywords).length>0?
          <div className='vista-fechas'>
            <ul>
              {Object.entries(this.props.keywords).map(([i,k])=>{

                return(
                  <ItemKeyword key={i} keyword={k.keyword} changeKeyword={(keyword)=>this.changeKeyword(keyword,i)}/>
                  
                )
              })}
            </ul>
          </div>
        :null}
        
        {/*<div className='linea-separacion'></div>*/}
      </div>
    )
  }
}

class ItemKeyword extends Component {

  shouldComponentUpdate = (nextProps) => {
    if(this.props.keyword!==nextProps.keyword){
      return true
    }
    return false
  }

  render(){
    console.log('render keyword');
    
    return(
      <li>
        <input className={"item-keyword-estrategia-input"} placeholder={'Agrega un anchor nuevo'} value={this.props.keyword} onChange={(e)=>{this.props.changeKeyword(e.target.value)}}/>
      </li>
    )
  }

}

