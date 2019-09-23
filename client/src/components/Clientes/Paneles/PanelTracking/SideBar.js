import React, {Component} from 'react'
import equal from 'deep-equal'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();
class SideBar extends Component{

  constructor(props){
    super(props)
    this.state={
      list:this.props.list,
      listOld: this.props.list,
      newItem: '',
      claseStatusNew:'',
      path:this.props.path,
      visible: false
    }
  }


  changeValue = (text) => {

    var repetido = Object.entries(this.state.list).some(([k,o])=>{return o.valor.toLowerCase()===text.trim()})

    var claseStatusNew = ''
    if(repetido){
      claseStatusNew = 'obligatorio_color'
    }else if(!repetido && text.trim()!==''){
      claseStatusNew = 'color_green'
    }else{
      claseStatusNew=''
    }

    this.setState({newItem:text, claseStatusNew})
    
  }

  enterKey = (event) => {if(event.key === 'Enter'){this.addNewInput(event.currentTarget.value)}}

  addNewInput = (text) => {

    if(this.state.claseStatusNew!=='obligatorio_color'){

      //agregar el nuevo input a la lista

      var key = db.child(`${this.props.path}`).push().key;
      var list = JSON.parse(JSON.stringify(this.state.list))
      list[key]={
        id:key,
        valor:text.trim(),
        status:'activo',
        new:true
      }
      this.setState({
        newItem:'',
        claseStatusNew:'',
        list
      })

    }

  }

  deleteItem = (id,element) => {
    var list = JSON.parse(JSON.stringify(this.state.list))
    if(element.new){
      delete list[id];
    }else{
      list[id].status='eliminado';
    }
    this.setState({list})
  }

  pauseItem = (id,element) => {
    var list = JSON.parse(JSON.stringify(this.state.list))
    list[id].status='pausado';
    
    this.setState({list})
  }
  restoreItem = (id,element) => {
    var list = JSON.parse(JSON.stringify(this.state.list))
    list[id].status='activo';
    
    this.setState({list})
  }

  componentDidMount = () => {
    setTimeout(() => { 
      this.setState({visible:true})
    }, 0)
  }

  close = () => {

    this.setState({visible:false})

    setTimeout(() => { 
      this.props.callBack(this.state.list)
    }, 500)

  }

  render(){

    return(
      <div className='container-block-side'>

        <div className={`container-side ${this.state.visible?'container-side-activo':''}`}>

          <h3 className='title-side'>{this.props.title}</h3>

          <div className='scroll-side' >

          {
            Object.entries(this.state.list).map(([k,o])=>{
              return(
                <div className='item-side' key={k}>
                  <input value={o.valor} className={`${o.status==='pausado'?'color_parado':''} ${o.status==='eliminado'?'color_eliminado':''}`} />
                  <div className='icons-side'>

                    {o.new || o.status==='eliminado' || o.status==='pausado' ?null:<div onClick={()=>{this.pauseItem(k,o)}}><i class="material-icons hover-orange">pause</i></div>}

                    { o.status==='eliminado' || o.status==='pausado' ?
                      <div onClick={()=>{this.restoreItem(k,o)}}><i class="material-icons hover-green">restore</i></div>
                    :
                      <div onClick={()=>{this.deleteItem(k,o)}}><i class="material-icons hover-red">delete_outline</i></div>
                    }

                  </div>
                </div>
              )
            })

          }

          

          <div className='item-side'>
            <input className={this.state.claseStatusNew} value={this.state.newItem} onKeyPress={ event => this.enterKey(event)} onChange={(e)=>this.changeValue(e.target.value)} placeholder={this.props.placeHolderNew} />
            <div className='icons-side'>
              <div onClick={(e)=>{ this.addNewInput(e.target.closest('.item-side').querySelector('input').value) }} ><i class="material-icons hover-green">add</i></div>
            </div>
          </div>

        </div>

          <div className='barra-option-side'>
            <div onClick={()=>{this.close()}} className='ok-btn'>Ok</div>
          </div>

      </div>

      


      </div>

    )
  }

}

export default SideBar;