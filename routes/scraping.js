var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var xml2js = require("xml2js");
var router = express.Router();
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require('dotenv').config()

const data = require("./clientes.json").clientes;

const TIMEOUT = 50 * 1000;

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

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.post("/home-status", (req, res) => {
  req.connection.setTimeout(20 * 60 * 1000);
  var item = req.body.cliente;

  item.sitemaps = {
    sitemap: {},
    sitemap_index: {},
    "1_index_sitemap": {}
  };
  var promesasItem = [];

  const statusHome = getStatusHome(item);
  const statusRobots = getStatusRobots(item);
  const statusSitemap = getStatusSitemap(item);
  const statusSitemapIndex = getStatusSitemapIndex(item);
  const status1IndexSitemap = getStatus1IndexSitemap(item);

  promesasItem.push(statusHome);
  promesasItem.push(statusRobots);
  promesasItem.push(statusSitemap);
  promesasItem.push(statusSitemapIndex);
  promesasItem.push(status1IndexSitemap);

  Promise.all(promesasItem).then(() => {
    res.json(item);
  });
});

function getStatusHome(item) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: item.web,
        agent: false,
        pool: { maxSockets: 100 },
        timeout: TIMEOUT, //10 segundos
        rejectUnauthorized: false,
        insecure: true,
        method: "get",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
          Connection: "keep-alive"
        }
      },
      (error, response, body) => {
        //console.log('response:',response);
        item.home = {};
        item.home.redirects = [];
        var canonical = null,
          robots = null;
        if (error) {
          console.log(item.web, error);

          console.log("   ");
          console.log("   ");

          if (error.response) {
            item.status = error.response.status;
            item.home.canonical = canonical ? canonical : "Error";
            item.home.robots = robots ? robots : "Error";
          } else {
            item.home.status = "Error";
            item.home.canonical = canonical ? canonical : "Error";
            item.home.robots = robots ? robots : "Error";
          }
          resolve();
        } else {
          console.log(item.web, "OK");

          console.log("   ");
          console.log("   ");

          item.home.status = response.statusCode;
          item.home.redirects = response.request._redirect.redirects;
          try {
            const $ = cheerio.load(response.body);
            canonical = $('link[rel="canonical"]').attr("href");
            robots = $('meta[name="robots"]').attr("content");
          } catch (e) {}
          item.home.canonical = canonical ? canonical : "No existe";
          item.home.robots = robots ? robots : "No existe";
          resolve();
        }
      }
    );
  });
}
function getStatusRobots(item) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: item.web + "/robots.txt",
        agent: false,
        pool: { maxSockets: 100 },
        timeout: TIMEOUT, //10 segundos
        rejectUnauthorized: false,
        insecure: true,
        method: "get",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
          Connection: "keep-alive"
        }
      },
      (error, response, body) => {
        item.robots = {};
        if (error) {
          if (error.response) {
            item.robots.status = error.response.status;
          } else {
            item.robots.status = "Error";
          }
          resolve();
        } else {
          item.robots.status = response.statusCode;
          var lineas = response.body.split("\n"),
            user_agent = null,
            reglas = {};
          //Ordenaremos los allows y disallow de su robot.txt
          lineas.forEach(o => {
            var item = o.trim();
            if (item !== "") {
              if (item.includes("User-agent:")) {
                var id = item.replace("User-agent:", "");
                user_agent = id.trim();
                reglas[user_agent] = { allow: [], disallow: [] };
              } else if (item.includes("Allow:") && user_agent) {
                var allow = item.replace("Allow:", "").trim();
                reglas[user_agent].allow.push(allow);
              } else if (item.includes("Disallow:") && user_agent) {
                var disallow = item.replace("Disallow:", "").trim();
                reglas[user_agent].disallow.push(disallow);

              }else if (item.includes("Noindex:") && user_agent) {
                reglas[user_agent].disallow.push('Noindex:');
              }
            }
          });
          //item.robots.text=lineas;
          item.robots.reglas = reglas;

          resolve();
        }
      }
    );
  });
}
function getStatusSitemap(item) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: item.web + "/sitemap.xml",
        agent: false,
        pool: { maxSockets: 100 },
        timeout: TIMEOUT, //10 segundos
        rejectUnauthorized: false,
        insecure: true,
        method: "get",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
          Connection: "keep-alive"
        }
      },
      (error, response, body) => {
        item.sitemaps.sitemap.redirects = [];
        if (error) {
          if (error.response) {
            item.sitemaps.sitemap.status = error.response.status;
          } else {
            item.sitemaps.sitemap.status = "Error";
          }
          resolve();
        } else {
          item.sitemaps.sitemap.redirects =
            response.request._redirect.redirects;
          item.sitemaps.sitemap.status = response.statusCode;
          var text_xml = response.body;
          var parser = new xml2js.Parser();
          parser.parseString(text_xml, function(err, result) {
            item.sitemaps.sitemap.urls = result;
          });
          resolve();
        }
      }
    );
  });
}
function getStatusSitemapIndex(item) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: item.web + "/sitemap_index.xml",
        agent: false,
        pool: { maxSockets: 100 },
        timeout: TIMEOUT, //10 segundos
        rejectUnauthorized: false,
        insecure: true,
        method: "get",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
          Connection: "keep-alive"
        }
      },
      (error, response, body) => {
        item.sitemaps.sitemap_index.redirects = [];
        if (error) {
          if (error.response) {
            item.sitemaps.sitemap_index.status = error.response.status;
          } else {
            item.sitemaps.sitemap_index.status = "Error";
          }
          resolve();
        } else {
          item.sitemaps.sitemap_index.redirects =
            response.request._redirect.redirects;
          item.sitemaps.sitemap_index.status = response.statusCode;
          var text_xml = response.body;
          var parser = new xml2js.Parser();
          parser.parseString(text_xml, function(err, result) {
            item.sitemaps.sitemap_index.urls = result;
          });
          resolve();
        }
      }
    );
  });
}
function getStatus1IndexSitemap(item) {
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: item.web + "/1_index_sitemap.xml",
        agent: false,
        pool: { maxSockets: 100 },
        timeout: TIMEOUT, //10 segundos
        rejectUnauthorized: false,
        insecure: true,
        method: "get",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
          Connection: "keep-alive"
        }
      },
      (error, response, body) => {
        item.sitemaps["1_index_sitemap"].redirects = [];
        if (error) {
          if (error.response) {
            item.sitemaps["1_index_sitemap"].status = error.response.status;
          } else {
            item.sitemaps["1_index_sitemap"].status = "Error";
          }
          resolve();
        } else {
          item.sitemaps["1_index_sitemap"].redirects =
            response.request._redirect.redirects;
          item.sitemaps["1_index_sitemap"].status = response.statusCode;
          var text_xml = response.body;
          var parser = new xml2js.Parser();
          parser.parseString(text_xml, function(err, result) {
            item.sitemaps["1_index_sitemap"].urls = result;
          });
          resolve();
        }
      }
    );
  });
}

router.post("/send-email", (req, res) => {
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

      body {
        margin: 0;
        padding: 0; }

        .st_subtitle-header-table {
          float: left;
          font-size: 8px;
          left: 0px;
          bottom: 0px;
          width: 100%;
          line-height: 12px;
          font-weight: 500;
          letter-spacing: 0.6px; }

        .st_wrong-status {
          background: #f71010; }

        .st_warning-status {
          background: #f7be10; }

        .st_good-status {
          background: #54da06; }

        .st_status-point {
          width: 15px;
          height: 15px;
          border-radius: 100px;
          margin: auto; }

        #st_table-status-home {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-family: sans-serif; }

        #st_table-status-home thead {
          background: #e2eef6;
          border: 1px solid #e5e6e7;
          color: #000;
          font-size: 11px; }

        #st_table-status-home tr td {
          border-bottom: 1px solid #e5e6e7;
          padding: 12px;
          color: #869BA6;
          font-size: 14px;
          font-family: sans-serif;
          font-weight: 400; }

        #st_table-status-home tr th {
          padding: 12px; }

        #st_table-status-home tbody tr:hover {
          -webkit-box-shadow: 0px 0px 22px 8px rgba(0, 0, 0, 0.05);
          box-shadow: 0px 0px 22px 8px rgba(0, 0, 0, 0.05); }

        #st_table-status-home tbody tr:hover i.idit-icon {
          display: flex; }

        #st_table-status-home tbody {
          border: 1px solid #e5e6e7; }

        #st_table-status-home tr th {
          text-transform: uppercase;
          letter-spacing: 1px; }

        #st_table-status-home tr th.st_col-status-status {
          width: 20px; }

        #st_table-status-home tr th.st_col-status-web {
          text-align: left;
          cursor: pointer;
          width: 125px; }

        #st_table-status-home tr th.st_col-status-code {
          cursor: pointer;
          width: 40px;
          text-align: center; }

        #st_table-status-home tr th.st_col-status-txt {
          cursor: pointer;
          width: 40px;
          text-align: center;
          padding: 15px 12px 12px 12px; }

        #st_table-status-home tr th.st_col-status-meta {
          width: 40px;
          text-align: center;
          padding: 15px 12px 12px 12px; }

        #st_table-status-home tr th.st_col-status-num {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr th.st_col-status-site {
          width: 30px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-status {
          width: 20px; }

        #st_table-status-home tr td.st_col-status-web {
          text-align: left;
          font-size: 14.5px;
          color: #253238;
          font-weight: 500;
          width: 125px; }

        #st_table-status-home tr td.st_col-status-code {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-txt {
          cursor: pointer;
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-meta {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-num {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-site {
          width: 30px;
          text-align: center; }

        a {
          color: inherit;
          text-decoration: inherit; }

        .st_wrong-status-color {
          color: #f71010 !important; }

        .st_warning-status-color {
          color: #f7be10 !important; }

        .st_good-status-color {
          color: #54da06 !important; }

        #st_html-to-send {
          padding: 50px; }

        .st_title-status-task {
          color: #ED0D92;
          font-size: 85px;
          line-height: 85px;
          font-weight: 900;
          font-family: sans-serif;
          text-transform: lowercase;
          padding-bottom: 40px;
          text-align: center; }

        .st_btn-run-status-task {
          position: absolute;
          background: #1090f7;
          border-radius: 5px;
          padding: 4px 14px;
          color: white;
          font-weight: 300;
          letter-spacing: 2px;
          right: 40px;
          top: 40px;
          text-transform: lowercase;
          font-size: 13px;
          font-family: sans-serif;
          cursor: pointer; }

        .st_btn-download-clientes {
          right: 100px; }

        .st_opacity_4 {
          opacity: 0.4; }




      </style>
    </head>

    <body>
      ${req.body.html}
    </body>

  </html>
  `;

  var mailOptions = {
    from: '"Yoseomk 🤖" <info@yoseomarketing.com>',
    to:
      '"Alberto Paredes" <albertoparedes@yoseomarketing.com>, "Eduardo Laserna" <eduardolaserna@yoseomarketing.com>',
    subject: "Status task",
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

router.get("/run-status-task", (req, res) => {
  req.connection.setTimeout(20 * 60 * 1000);
  console.log("Start");
  var clientes = data,
    promesas = [],
    clientes_ordenados = [],
    n = 0;
  Object.entries(clientes).forEach(([key, item]) => {
    n++;

    var promesa = new Promise((resolve, reject) => {
      setTimeout(() => {
        item.sitemaps = {
          sitemap: {},
          sitemap_index: {},
          "1_index_sitemap": {}
        };
        var promesasItem = [];

        const statusHome = getStatusHome(item);
        const statusRobots = getStatusRobots(item);
        const statusSitemap = getStatusSitemap(item);
        const statusSitemapIndex = getStatusSitemapIndex(item);
        const status1IndexSitemap = getStatus1IndexSitemap(item);

        promesasItem.push(statusHome);
        promesasItem.push(statusRobots);
        promesasItem.push(statusSitemap);
        promesasItem.push(statusSitemapIndex);
        promesasItem.push(status1IndexSitemap);

        Promise.all(promesasItem).then(() => {
          resolve();
        });
      }, n * 1000);
    });
    promesas.push(promesa);
  });

  Promise.all(promesas).then(() => {
    var data = updateClientes(clientes);
    var filas = getHtml(data.clientes_ordenados);
    var html = setHtml(filas);
    console.log("End");

    var mailOptions = {
      from: '"Yoseomk 🤖" <info@yoseomarketing.com>',
      to:'"Alberto Paredes" <albertoparedes@yoseomarketing.com>, "Eduardo Laserna" <eduardolaserna@yoseomarketing.com>',
      //to:'"Alberto Paredes" <albertoparedes@yoseomarketing.com>',
      subject: "Status task",
      html: html
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.log(error);
        res.json({ status: error });
      } else {
        res.send(html);
        console.log('Correo enviado');
        
      }
    });
  });

  //res.json({clientes:'ok'});
});

function setHtml(filas) {
  return `
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

      body {
        margin: 0;
        padding: 0; }

        .st_subtitle-header-table {
          float: left;
          font-size: 8px;
          left: 0px;
          bottom: 0px;
          width: 100%;
          line-height: 12px;
          font-weight: 500;
          letter-spacing: 0.6px; }

        .st_wrong-status {
          background: #f71010; }

        .st_warning-status {
          background: #f7be10; }

        .st_good-status {
          background: #54da06; }

        .st_status-point {
          width: 15px;
          height: 15px;
          border-radius: 100px;
          margin: auto; }

        #st_table-status-home {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          font-family: sans-serif; }

        #st_table-status-home thead {
          background: #e2eef6;
          border: 1px solid #e5e6e7;
          color: #000;
          font-size: 11px; }

        #st_table-status-home tr td {
          border-bottom: 1px solid #e5e6e7;
          padding: 12px;
          color: #869BA6;
          font-size: 14px;
          font-family: sans-serif;
          font-weight: 400; }

        #st_table-status-home tr th {
          padding: 12px; }

        #st_table-status-home tbody tr:hover {
          -webkit-box-shadow: 0px 0px 22px 8px rgba(0, 0, 0, 0.05);
          box-shadow: 0px 0px 22px 8px rgba(0, 0, 0, 0.05); }

        #st_table-status-home tbody tr:hover i.idit-icon {
          display: flex; }

        #st_table-status-home tbody {
          border: 1px solid #e5e6e7; }

        #st_table-status-home tr th {
          text-transform: uppercase;
          letter-spacing: 1px; }

        #st_table-status-home tr th.st_col-status-status {
          width: 20px; }

        #st_table-status-home tr th.st_col-status-web {
          text-align: left;
          cursor: pointer;
          width: 125px; }

        #st_table-status-home tr th.st_col-status-code {
          cursor: pointer;
          width: 40px;
          text-align: center; }

        #st_table-status-home tr th.st_col-status-txt {
          cursor: pointer;
          width: 40px;
          text-align: center;
          padding: 15px 12px 12px 12px; }

        #st_table-status-home tr th.st_col-status-meta {
          width: 40px;
          text-align: center;
          padding: 15px 12px 12px 12px; }

        #st_table-status-home tr th.st_col-status-num {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr th.st_col-status-site {
          width: 30px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-status {
          width: 20px; }

        #st_table-status-home tr td.st_col-status-web {
          text-align: left;
          font-size: 14.5px;
          color: #253238;
          font-weight: 500;
          width: 125px; }

        #st_table-status-home tr td.st_col-status-code {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-txt {
          cursor: pointer;
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-meta {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-num {
          width: 40px;
          text-align: center; }

        #st_table-status-home tr td.st_col-status-site {
          width: 30px;
          text-align: center; }

        a {
          color: inherit;
          text-decoration: inherit; }

        .st_wrong-status-color {
          color: #f71010 !important; }

        .st_warning-status-color {
          color: #f7be10 !important; }

        .st_good-status-color {
          color: #54da06 !important; }

        #st_html-to-send {
          padding: 50px; }

        .st_title-status-task {
          color: #ED0D92;
          font-size: 85px;
          line-height: 85px;
          font-weight: 900;
          font-family: sans-serif;
          text-transform: lowercase;
          padding-bottom: 40px;
          text-align: center; }

        .st_btn-run-status-task {
          position: absolute;
          background: #1090f7;
          border-radius: 5px;
          padding: 4px 14px;
          color: white;
          font-weight: 300;
          letter-spacing: 2px;
          right: 40px;
          top: 40px;
          text-transform: lowercase;
          font-size: 13px;
          font-family: sans-serif;
          cursor: pointer; }

        .st_btn-download-clientes {
          right: 100px; }

        .st_opacity_4 {
          opacity: 0.4; }




      </style>
    </head>

    <body>
      <div class='st_title-status-task'>status task</div>

      <table id='st_table-status-home'>
        <thead>
          <tr>
            <th class='st_col-status-status'>Status</th>
            <th class='st_col-status-web'>Dominio</th>
            <th class='st_col-status-code'>Response code</th>
            <th class='st_col-status-meta pr' >
              <span>Robots <span class='st_subtitle-header-table'>meta name</span> </span>
            </th>
            <th class='st_col-status-txt pr' >
              <span>Robots <span class='st_subtitle-header-table'>.txt</span> </span>
            </th>

            <th class='st_col-status-num'>N° sitemap_index</th>
            <th class='st_col-status-site'>Sitemaps</th>
          </tr>
        </thead>
        <tbody >
          ${filas}
        </tbody>
      </table>

    </body>

  </html>
  `;
}

function updateClientes(clientes) {
  Object.entries(clientes).forEach(([k, c]) => {
    if (c.home && c.home.status >= 200 && c.home.status < 300) {
      clientes[k].status = 1;
    }
    //Ugencia media
    if (
      (c.home && c.home.status >= 300 && c.home.status < 400) ||
      (c.robots && c.robots.status !== 200) ||
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["*"] &&
        c.robots.reglas["*"].disallow &&
        c.robots.reglas["*"].disallow.some(r => {
          return r === "/";
        })) ||
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["googlebot"] &&
        c.robots.reglas["googlebot"].disallow &&
        c.robots.reglas["googlebot"].disallow.some(r => {
          return r === "/";
        }))
    ) {
      clientes[k].status = 2;
    }

    if (
      (c.home && (c.home.status >= 400 || c.home.status === "Error")) ||
      (c.robots && JSON.stringify(c.robots).toLowerCase().includes('noindex:')  ) ||
      (c.home &&
        (c.home.robots.toLowerCase().includes("nofollow") ||
          c.home.robots.toLowerCase().includes("noindex")))
    ) {
      clientes[k].status = 3;
    }
  });

  var clientes_ordenados = Object.entries(clientes);
  clientes_ordenados.sort((a, b) => {
    a = a[1];
    b = b[1];
    if (a.status > b.status) {
      return 1;
    }
    if (a.status < b.status) {
      return -1;
    }

    return 0;
  });

  clientes_ordenados.reverse();

  return { clientes, clientes_ordenados };
}
function getHtml(clientes_ordenados) {
  var filas = "";
  clientes_ordenados.map((c, k) => {
    c = c[1];

    var txt = "";
    if(c.robots && JSON.stringify(c.robots).toLowerCase().includes('noindex:')){
      txt = "Noindex:";
    }else if (
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["*"] &&
        c.robots.reglas["*"].disallow &&
        c.robots.reglas["*"].disallow.some(r => {
          return r === "/";
        })) ||
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["googlebot"] &&
        c.robots.reglas["googlebot"].disallow &&
        c.robots.reglas["googlebot"].disallow.some(r => {
          return r === "/";
        }))
    ) {
      txt = "Disallow";
    } else if (c.robots && c.robots.status !== 200) {
      txt = c.robots.status;
    } else if (
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["*"] &&
        c.robots.reglas["*"].allow &&
        c.robots.reglas["*"].allow.some(r => {
          return r === "/";
        })) ||
      (c.robots &&
        c.robots.reglas &&
        c.robots.reglas["googlebot"] &&
        c.robots.reglas["googlebot"].allow &&
        c.robots.reglas["googlebot"].allow.some(r => {
          return r === "/";
        }))
    ) {
      txt = "Allow";
    } else {
      txt = "No existe: Allow: /";
    }

    var num_sitemap_index = 0;
    if (
      c.sitemaps &&
      c.sitemaps.sitemap_index &&
      c.sitemaps.sitemap_index.status === 200 &&
      c.sitemaps.sitemap_index.urls &&
      c.sitemaps.sitemap_index.urls.sitemapindex
    ) {
      num_sitemap_index =
        c.sitemaps.sitemap_index.urls.sitemapindex.sitemap.length;
    } else if (
      c.sitemaps &&
      c.sitemaps.sitemap_index &&
      c.sitemaps.sitemap_index.status === 200 &&
      c.sitemaps.sitemap_index.urls &&
      c.sitemaps.sitemap_index.urls.urlset
    ) {
      num_sitemap_index = c.sitemaps.sitemap_index.urls.urlset.url.length;
    } else if (
      c.sitemaps &&
      c.sitemaps.sitemap_index &&
      c.sitemaps.sitemap_index.status !== 200
    ) {
      num_sitemap_index = c.sitemaps.sitemap_index.status;
    }

    var sites = "-",
      n = 0;
    if (c.sitemaps) {
      if (c.sitemaps["1_index_sitemap"].status === 200) n++;
      if (c.sitemaps.sitemap.status === 200) n++;
      if (c.sitemaps.sitemap_index.status === 200) n++;
      if (n == 0) {
        sites = "No SiteMaps";
      } else if (n == 1) {
        sites = "OK";
      } else if (n > 1) {
        sites = "Warning";
      }
    }

    filas =
      filas +
      `

      <tr>
        <td class='st_col-status-status'><div class='st_status-point ${
          c.status === 1 ? "st_good-status" : ""
        } ${c.status === 2 ? "st_warning-status" : ""} ${
        c.status === 3 ? "st_wrong-status" : ""
      }     ' ></div></td>

        <td class='st_col-status-web'>
          <a href='${c.web}' target='_blank'>${c.web}</a>
        </td>

        <td class='st_col-status-code ${
          c.home && (c.home.status >= 400 || c.home.status === "Error")
            ? "st_wrong-status-color"
            : ""
        }' >${c.home ? c.home.status : "-"}</td>

        <td class='st_col-status-meta ${
          c.home &&
          c.home.robots &&
          (c.home.robots.toLowerCase().includes("noindex") ||
            c.home.robots.toLowerCase().includes("nofollow"))
            ? "st_wrong-status-color"
            : ""
        }'>
          <a href='${c.web}' target='_blank'>${c.home ? c.home.robots : "-"}</a>
        </td>

        <td class='st_col-status-txt ${
          txt!=='Noindex:' && (txt === "Disallow" || txt === "Error" || txt === 404)
          
            ? "st_warning-status-color"
            : ""
        } ${
          txt==='Noindex:'?'st_wrong-status-color':''
        }'>
          <a href='${c.web + "/robots.txt"}' target='_blank'>${
        c.robots ? txt : "-"
      }</a>
        </td>

        <td class='st_col-status-num ${
          num_sitemap_index === 404 ? "st_warning-status-color" : ""
        }' >
          <a href='${c.web + "/sitemap_index.xml"}' target='_blank'>${
        c.sitemaps ? num_sitemap_index : "-"
      }</a>
        </td>


        <td class='st_col-status-site ${
          sites === "Warning" ? "st_warning-status-color" : ""
        }' >${sites}</td>

      </tr>

    `;
  });

  return filas;
}

module.exports = router;

/**/
