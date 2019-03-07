import React, { Component } from 'react';
import $ from 'jquery'
import firebase from '../../../firebase/Firebase';
import 'firebase/database';
import json from './clientes.json'
const db = firebase.database().ref();



class StatusTask extends Component {

  constructor(props){
    super(props);
    this.state = {
      urls:[],
      user_agent:'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
      filtros:{},
      clientes:json.clientes,
      clientes_ordenados:Object.entries(json.clientes),
      repeticiones_totales:false,
      repeticiones_each:1,
      btn_run:false
    }
  }

  componentDidMount = () => {
    console.log(this.props);
    if(this.props.cron){
      this.scraping()
    }
  }

  componentWillMount = () => {

    /*db.child('clientes').once("value", snapshot =>{
      var clientes = {};
      snapshot.forEach( data => {
        if(!data.val().eliminado){
          var web = data.val().web.endsWith('/') ? data.val().web.substring(0, data.val().web.length-1) :data.val().web
          clientes[data.key]={ web, status:0, done:false }
        }
      });
      var clientes_ordenados = Object.entries(clientes)
      this.setState({clientes, clientes_ordenados})
    });*/

  }


  scraping = () => {
    this.setState({btn_run:true},()=>{
      var clientes = this.state.clientes
      Object.entries(clientes).forEach( ( [key, item] )=>{

        const fetchConfig = {
          method: 'POST',
          timeout: 20 * 60 * 1000,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body:JSON.stringify({cliente:item,user_agent:this.state.user_agent})
        };

        fetch(`/scraping/home-status`, fetchConfig)
        .then(res => res.json())
        .then( (data) => {
          clientes[key]=data
          clientes[key].done=true;
          this.updateClientes(clientes)
        })
        .catch(err=>{
          console.log(err);
        })
      })
    })
  }

  reenviar = () => {
    console.log('reenviar');
    var clientes = this.state.clientes
    Object.entries(clientes).forEach( ( [key, item] )=>{

      if(item.status===3){
        const fetchConfig = {
          method: 'POST',
          timeout: 20 * 60 * 1000,
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body:JSON.stringify({cliente:item,user_agent:this.state.user_agent})
        };

        fetch(`/scraping/home-status`, fetchConfig)
        .then(res => res.json())
        .then( (data) => {
          clientes[key]=data
          clientes[key].done=true;
          this.updateClientes(clientes)
        })
        .catch(err=>{
          console.log(err);
        })
      }
    })
  }

  updateClientes = (clientes) => {
    Object.entries(clientes).forEach(( [k,c] )=>{

      if(c.home && c.home.status>=200 && c.home.status<300 ){ clientes[k].status=1; }
      //Ugencia media
      if(
          (c.home && c.home.status>=300 && c.home.status<400) ||
          (c.robots && c.robots.status!==200 ) ||
          (c.robots && c.robots.reglas && c.robots.reglas['*'] && c.robots.reglas['*'] && c.robots.reglas['*'].disallow && c.robots.reglas['*'].disallow.some(r=>{return r==='/'}) ) ||
          (c.robots && c.robots.reglas && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'].disallow && c.robots.reglas['googlebot'].disallow.some(r=>{return r==='/'}) )
        ){
        clientes[k].status=2
      }

      if(

          ( c.home && (c.home.status>=400 || c.home.status==='Error') ) ||
          ( c.home && (c.home.robots.toLowerCase().includes('nofollow') || c.home.robots.toLowerCase().includes('noindex')) )

        ){
        clientes[k].status=3
      }

    })

    var clientes_ordenados = Object.entries(clientes)
    clientes_ordenados.sort((a, b) =>{ a = a[1]; b= b[1];
        if (a.status > b.status) { return 1; }
        if (a.status < b.status) { return -1; }

      return 0;
    });

    clientes_ordenados.reverse();

    this.setState({clientes, clientes_ordenados}, ()=>{
      this.checkAll()
    })
  }

  checkAll = () => {
    var all = this.state.clientes_ordenados.some((item)=>{ return item[1].done===false }) ? false:true
    console.log(all);
    if(all){
      var clientes = this.state.clientes;
      var repeticiones_totales = 0;
      Object.entries(clientes).forEach(([k,c])=>{
        if(c.status===3){ clientes[k].done=false; repeticiones_totales++}
      })

      if(!this.state.repeticiones_totales){
        console.log(repeticiones_totales);
        repeticiones_totales = 3 //eliminar esta linea si se quiere comprobar tantas veces como errores haya
        this.setState({clientes,repeticiones_totales},()=>{
          this.reenviar();
        })
      }else if(this.state.repeticiones_each<this.state.repeticiones_totales){
        console.log(this.state.repeticiones_each+1);
        this.setState({clientes,repeticiones_each:this.state.repeticiones_each+1},()=>{
          this.reenviar();
        })
      }else{
        console.log('Fin');
        this.setState({btn_run:false},()=>{
          this.send();
        })

      }

    }
  }

  downloadClientes = () => {
    db.child('clientes').once("value", snapshot =>{
      var clientes = {};
      snapshot.forEach( data => {
        if(!data.val().eliminado){
          var web = data.val().web.endsWith('/') ? data.val().web.substring(0, data.val().web.length-1) :data.val().web
          clientes[data.key]={ web, status:0, done:false }
        }
      });
      //var clientes_ordenados = Object.entries(clientes)
      //this.setState({clientes, clientes_ordenados})

      var element = document.createElement("a");
      var file = new Blob([JSON.stringify({clientes:clientes})], {type: 'text/json'});
      element.href = URL.createObjectURL(file);
      element.download = `clientes.json`;
      element.click();


    });
  }

  send = () => {

    var html = $('#st_html-to-send').html()
    const fetchConfig = {
      method: 'POST',
      timeout: 20 * 60 * 1000,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body:JSON.stringify({html})
    };

    fetch(`/scraping/send-email`, fetchConfig)
    .then(res => res.json())
    .then( (response) => {
      //alert('Enviado correctamente')
      console.log(response);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  render() {
    return (
      <div >

        <div className={`st_btn-run-status-task st_btn-download-clientes`} onClick={()=>this.downloadClientes() }>Download</div>

        <div className={`st_btn-run-status-task ${this.state.btn_run?'st_opacity_4':''}`} onClick={()=>  !this.state.btn_run?this.scraping():null   }>Run</div>

        <div id='st_html-to-send'>
          <div className='st_title-status-task'>status task</div>

          <table id='st_table-status-home'>
            <thead>
              <tr>
                <th className='st_col-status-status'>Status</th>
                <th className='st_col-status-web'>Dominio</th>
                <th className='st_col-status-code'>Response code</th>
                <th className='st_col-status-meta pr' >
                  <span>Robots <span className='st_subtitle-header-table'>meta name</span> </span>
                </th>
                <th className='st_col-status-txt pr' >
                  <span>Robots <span className='st_subtitle-header-table'>.txt</span> </span>
                </th>

                <th className='st_col-status-num'>N° sitemap_index</th>
                <th className='st_col-status-site'>Sitemaps</th>
              </tr>
            </thead>
            <tbody >
              {
                this.state.clientes_ordenados.map((c,k)=>{
                  c = c[1];

                  var txt = '';
                  if(
                      (c.robots && c.robots.reglas && c.robots.reglas['*'] && c.robots.reglas['*'] && c.robots.reglas['*'].disallow && c.robots.reglas['*'].disallow.some(r=>{return r==='/'}) ) ||
                      (c.robots && c.robots.reglas && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'].disallow && c.robots.reglas['googlebot'].disallow.some(r=>{return r==='/'}) )
                    ){
                    txt = 'Disallow'
                  }else if(c.robots && c.robots.status!==200 ){
                    txt = c.robots.status
                  }else if
                    (
                      (c.robots && c.robots.reglas && c.robots.reglas['*'] && c.robots.reglas['*'] && c.robots.reglas['*'].allow && c.robots.reglas['*'].allow.some(r=>{return r==='/'}) ) ||
                      (c.robots && c.robots.reglas && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'] && c.robots.reglas['googlebot'].allow && c.robots.reglas['googlebot'].allow.some(r=>{return r==='/'}) )
                    ){
                    txt = 'Allow'
                  }else{
                    txt = 'No existe: Allow: /'
                  }

                  var num_sitemap_index = 0;
                  if( c.sitemaps && c.sitemaps.sitemap_index && c.sitemaps.sitemap_index.status===200 && c.sitemaps.sitemap_index.urls && c.sitemaps.sitemap_index.urls.sitemapindex){
                    num_sitemap_index = c.sitemaps.sitemap_index.urls.sitemapindex.sitemap.length
                  }else if( c.sitemaps && c.sitemaps.sitemap_index && c.sitemaps.sitemap_index.status===200 && c.sitemaps.sitemap_index.urls && c.sitemaps.sitemap_index.urls.urlset){
                    num_sitemap_index = c.sitemaps.sitemap_index.urls.urlset.url.length
                  }else if( c.sitemaps && c.sitemaps.sitemap_index && c.sitemaps.sitemap_index.status!==200){
                    num_sitemap_index = c.sitemaps.sitemap_index.status
                  }

                  var sites = '-', n=0;
                  if(c.sitemaps){
                    if(c.sitemaps['1_index_sitemap'].status===200)n++
                    if(c.sitemaps.sitemap.status===200)n++
                    if(c.sitemaps.sitemap_index.status===200)n++
                    if(n==0){ sites='No SiteMaps'
                		}else if(n==1){ sites='OK'
                		}else if(n>1){ sites='Warning' }
                  }


                  return(
                    <tr key={k}>
                      <td className='st_col-status-status'><div className={`st_status-point ${c.status===1?'st_good-status':''} ${c.status===2?'st_warning-status':''} ${c.status===3?'st_wrong-status':''}     `} ></div></td>

                      <td className='st_col-status-web'>
                        <a href={c.web} target='_blank'>{c.web}</a>
                      </td>

                      <td className={`st_col-status-code ${c.home && (c.home.status>=400 || c.home.status==='Error') ?'st_wrong-status-color':''}`} >{c.home? c.home.status : '-' }</td>

                      <td className={`st_col-status-meta ${c.home && c.home.robots && (c.home.robots.toLowerCase().includes('noindex') || c.home.robots.toLowerCase().includes('nofollow') )?'st_wrong-status-color':'' }`}>
                        <a href={c.web} target='_blank'>{c.home? c.home.robots : '-' }</a>
                      </td>

                      <td className={`st_col-status-txt ${txt==='Disallow' || txt==='Error' || txt===404?'st_warning-status-color':''}`}>
                        <a href={c.web+'/robots.txt'} target='_blank'>{c.robots? txt : '-' }</a>
                      </td>

                      <td className={`st_col-status-num ${num_sitemap_index===404?'st_warning-status-color':''}`} >
                        <a href={c.web+'/sitemap_index.xml'} target='_blank'>{c.sitemaps? num_sitemap_index : '-' }</a>
                      </td>


                      <td className={`st_col-status-site ${sites==='Warning'?'st_warning-status-color':''}`} >{sites}</td>
                    </tr>
                  )
                })
              }

            </tbody>
          </table>

        </div>

      </div>
    );
  }
}

export default StatusTask;
