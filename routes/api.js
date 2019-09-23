var express = require("express");
var request = require("request");
var router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fileUpload = require('express-fileupload');
require('dotenv').config()

//const axios = require('axios');

const {user, pass} = JSON.parse(process.env.YOSEO_EMAIL)
var transporter = nodemailer.createTransport({
  port: 587,
  host: "smtp.gmail.com",
  auth: {
    user,
    pass
  }
});

router.use(bodyParser.json({ limit: "500mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));


//descargamos el excel de keywords tracking
router.post("/tracking", (req, res) => {
  var json = JSON.parse(req.body.data);

  var data = {
    template: { shortid: "Hyx2LAY8E" },
    data: json,
    options: {
      preview: true
    }
  };

  const {uri, user, pass} = JSON.parse(process.env.REPORTJS)

  var options = {
    uri,
    auth: {
      user,
      pass,
      sendImmediately: true
    },
    method: "POST",
    json: data
  };
  request(options).pipe(res);
});

//emails de seo
router.post("/edit-client", (req, res) => {

  var html = `
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
        <style type="text/css">

        * {
          font-family: sans-serif;
          box-sizing: border-box; }

        ::after, ::before {
          box-sizing: content-box; }

          .word-good{
            color: #16bb16;
          }
          .word-warning{
            color: orange;
          }
          .word-wrong{
            color: red;
          }
          .container-empleado{
            color: gray;
          }
          .container-info{
            font-size: 20px;
            padding: 11px 0px;
          }
          .link-cliente{
            color: #3281dc;
            text-decoration: none;
          }

          </style>
      </head>

      <body>

      <div class='container-info'>
        ${req.body.frase}
      </div>
      <div class='container-empleado'>Empleado responsable: ${req.body.empleado}</div>
      </body>

    </html>
  `;
  var mailOptions = {
    from: '"Yoseomk 🤖" <info@yoseomarketing.com>',
    to: '"Alberto Paredes" <albertoparedes@yoseomarketing.com>',
    subject: req.body.subject,
    html: html
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.json({ status: error });
    } else {
      res.json({ status: "ok" });
    }
  });

});

router.post("/empleados-lg-client", (req, res) => {

  var html = `
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
        <style type="text/css">

        * {
          font-family: sans-serif;
          box-sizing: border-box; }

        ::after, ::before {
          box-sizing: content-box; }

          .container-info{
            font-size: 20px;
            padding: 11px 0px;
          }
          .link-cliente{
            color: #3281dc;
            text-decoration: none;
          }
          .container-sentences{
            color: gray;
          }
          .container-empleado{
            margin: 15px 0px;
          }
          .bold-title{
            font-weight: bold;
            color: gray;
          }
          .bold-emple{
            font-weight: bold;
            color: black;
          }

          </style>
      </head>

      <body>

      <h1>${req.body.h1}</h1>
      <div>${req.body.container}</div>
      <div class='container-sentences'>Cliente: ${req.body.cliente}</div>
      <div class='container-sentences'>Servicio: ${req.body.servicio}</div>
      <div class='container-sentences'>Empleado responsable: ${req.body.empleado}</div>
      </body>

    </html>
  `;

  var mailOptions = {
    from: '"Yoseomk 🤖" <info@yoseomarketing.com>',
    //to: req.body.destinatarios, 
    to: '"Alberto Paredes" <albertoparedes@yoseomarketing.com>',
    subject: req.body.subject,
    html: html
  };

  transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      res.json({ status: error });
    } else {
      res.json({ status: "ok" });
    }
  });

});

module.exports = router;

