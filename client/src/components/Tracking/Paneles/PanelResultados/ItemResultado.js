import React, { Component, Fragment  } from 'react';
import data from '../../../Global/Data/Data'
import $ from 'jquery'

class ItemDate extends Component {

  constructor(props){
      super(props);
      this.state={
        show_more:false
      }
    }

  render() {
    var id_date=false, url=false;
    var resultados = this.props.date.results.all_positions ? this.props.date.results.all_positions : false
    var date = this.props.date.id_date.split('-');
    id_date = (+date[2])+' '+data.months[ (+date[1])-1 ]+", "+date[0]

    var posicion = this.props.date.results.first_position ? this.props.date.results.first_position : '+100';

    return(

      <Fragment>

        <tr data-id={this.props.date.id_date} >

          <td  className={`key-item-pos ${resultados && resultados.length>1 && this.state.show_more ?'td-more-result':''}`}>
            <span className='align-center pr'>

              <span className={`${posicion==='+100'?'color-wrong':''}`} >{posicion}</span>

              {resultados && resultados.length>1?
                <i onClick={()=>   resultados && resultados.length>1 ? this.setState({show_more:this.state.show_more?false:true}): null } className={`material-icons expand_more_result ${this.state.show_more?'expand_more_result-active':''}`} > chevron_right </i>
              :null}


            </span>
          </td>

          <td  className={`key-item-url ${resultados && resultados.length>1  && this.state.show_more?'td-more-result':''}`} >
            <span> {this.props.date.results.first_url ? this.props.date.results.first_url : '-' } </span>
          </td>





          <td className={`key-item-img ${resultados && resultados.length>1  && this.state.show_more?'td-more-result':''}`} rowSpan={resultados && this.state.show_more && false/*quitar este false si se quiere unir las celdas*/?resultados.length:1}>
            {this.props.date.image?
                <a href={this.props.date.image} target='_blank' className='align-center'><i className="material-icons">camera_alt</i></a>
              :
                <span className='align-center'>-</span>
            }
          </td>

          <td className={`key-item-fecha ${resultados && resultados.length>1  && this.state.show_more?'td-more-result':''}`} rowSpan={resultados && this.state.show_more && false/*quitar este false si se quiere unir las celdas*/?resultados.length:1}>
              <span> {id_date} </span>
          </td>

        </tr>

        { resultados && resultados.length>1 && this.state.show_more?

          resultados.map((r,k)=>{

            if(k===0)return false
            return(
              <tr data-id={this.props.date.id_date} key={k}>

                <td  className={`key-item-pos td-more-result not-first ${k===resultados.length-1?'td-more-result-last':''}`} >
                  <span className='align-center'> {r.posicion} </span>
                </td>

                <td className={`key-item-url td-more-result not-first ${k===resultados.length-1?'td-more-result-last':''}`} >
                  <span> {r.url} </span>
                </td>

                <td className={`key-item-img td-more-result not-first ${k===resultados.length-1?'td-more-result-last':''}`} > </td>
                <td className={`key-item-fecha td-more-result not-first ${k===resultados.length-1?'td-more-result-last':''}`} > </td>

              </tr>
            )
          })



          :null
        }

      </Fragment>

    )
  }
}


export default ItemDate;
