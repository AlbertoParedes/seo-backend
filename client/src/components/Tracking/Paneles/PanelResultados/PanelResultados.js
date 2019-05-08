import React, { Component } from 'react';
import CargandoData from '../../../Global/CargandoData'
import { connect } from 'react-redux';
import functions from '../../../Global/functions'
import $ from 'jquery'
import ItemResultado from './ItemResultado'
import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();
const ITEMS = 50;
class PanelResultados extends Component {

  constructor(props){
      super(props);
      this.state={

        items:ITEMS, sortBy:'id_date', des:true,

        cliente:this.props.cliente,
        keyword:this.props.keyword,
        resultados:{},
        resultados_ordenados:[],
        newKeywords:'',
      };
  }

  componentWillMount = () => { this.getData()}

  componentWillReceiveProps = newProps => {
    //if(this.state.cliente!==newProps.cliente){ this.setState({cliente:newProps.cliente}, ()=> this.ordenarResultados() ) }
    if(this.state.cliente!==newProps.cliente || this.state.keyword!==newProps.keyword){ this.setState({cliente:newProps.cliente, keyword:newProps.keyword}, ()=> this.getData() ) }
  }
  getData = () =>{
    if(this.state.keyword){
      db.child(`Servicios/Tracking/Resultados/clientes/${this.state.cliente.id_cliente}/${this.state.keyword.id_keyword}/dates`).on("value", snapshot =>{
        var resultados = {};
        snapshot.forEach( data => {
          resultados[data.key]=data.val();
        });
        this.setState({resultados}, this.ordenarResultados(resultados));
      })
    }else{
      console.log('No existe keyword seleccionada');
    }
  }
  ordenarResultados = (resultados) => {

    var resultados_ordenados = Object.entries(resultados)
    resultados_ordenados.sort((a, b) =>{ a=a[1]; b=b[1]
      if(this.state.sortBy==='posicion'){
        var aKeys = a.resultados?(+Object.keys(a.resultados)[0]):101;
        var bKeys = b.resultados?(+Object.keys(b.resultados)[0]):101;

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }
      else if(this.state.sortBy==='url'){
        var aKeys = a.resultados?a.resultados[ (+Object.keys(a.resultados)[0]) ].url  : '-';
        var bKeys = b.resultados?b.resultados[(+Object.keys(b.resultados)[0]) ].url  : '-';

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }
      else{

        if (a[this.state.sortBy] > b[this.state.sortBy]) { return 1; }
        if (a[this.state.sortBy] < b[this.state.sortBy]) { return -1; }
      }

      return 0;
    });

    if(this.state.des){  resultados_ordenados.reverse(); }

    this.setState({resultados_ordenados},()=>{
      //this.changeContadorClientes();
    })
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.setState({sortBy:id,des}, ()=>this.ordenarResultados(this.state.resultados))
  }
  render() {
    return (

      <div id='container-clientes-tracking-keywords-resultados' className='container-table min-panel-enlaces-free' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>

        <div >
        {Object.keys(this.state.resultados).length > 0 ?
          <div>

            <table id='table-clientes-tracking-keywords-resultados'>
              <thead>
                <tr>

                  <th  onClick={()=>this.changeSort('posicion')} className='key-item-pos'>
                    <span>Posición</span>
                    {this.state.sortBy==='posicion'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th onClick={()=>this.changeSort('url')} className='key-item-url'>
                    <span>Url</span>
                    {this.state.sortBy==='url'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th className='key-item-img'>
                    <span>Imagen</span>
                  </th>

                  <th onClick={()=>this.changeSort('id_date')} className='key-item-fecha' >
                    <span>Fecha</span>
                    {this.state.sortBy==='id_date'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                </tr>
              </thead>
              <tbody>

              {
                 this.state.resultados_ordenados.reduce((result, item, i)=>{
                  const k = item[0], date = item[1];
                  if (i < this.state.items ) {
                      result.push(
                        <ItemResultado key={k} date={date} />
                      );
                  }
                  return result;
                }, [])

              }
              </tbody>
            </table>
          </div>

        :
          <div className={`${!this.props.visibility?'display_none':''}`} >
            <CargandoData />
          </div>
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){return{cliente:state.cliente_seleccionado, keyword:state.tracking.keyword_tracking_selected}}
export default connect(mapStateToProps)(PanelResultados);
