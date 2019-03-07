var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var xml2js = require('xml2js');
var router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');


router.use(bodyParser.json({limit: '500mb', extended: true}))
router.use(bodyParser.urlencoded({limit: '500mb', extended: true}))

router.get('/', (req, res) => {  
  res.send('kknn');
});

router.get('/save', (req, res) => {
  console.log('hola');
  res.send('Hola')
})

//descargamos el excel de keywords tracking
router.post('/tracking', (req, res) => {

  var json = JSON.parse(req.body.data)

/*

  //creamos el objeto con todas las keywords
  var keywords = []

  json.forEach((o,i)=>{
    keywords.push({
      keyword: o[1].keyword
    })

  })
  console.log(keywords);
*/


  var data = {
    template:{'shortid':'Hyx2LAY8E'},
    data: json,
    options:{
      preview:true,
      //"Content-Disposition": "attachment; filename=ejemplo.xlsx"
    }
  }

  var options = {
    //uri:'https://reports.yoseomk.vps-100.netricahosting.com/api/report',
    uri:'https://albertoparedes.jsreportonline.net/api/report',

    'auth': {
      'user': 'albert.paredes.robles@gmail.com',
      'pass': 'Alber10.',
      'sendImmediately': true
    },
    method:'POST',
    json:data
  }
  console.log(options);
  request(options).pipe(res);

});


module.exports = router;




























/**/
