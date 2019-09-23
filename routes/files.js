var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
const mkdirp = require('mkdirp')
const multer = require('multer');

router.use(bodyParser.json({ limit: "500mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

router.post(
  '/upload-image-tracking', 
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const dir = `public/images/tracking/${req.body.path}`
        mkdirp(dir, err => cb(null, dir))
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      }
    })
  }).single('image') ,
  
  (req, res) => {

    if (req.file){
      console.log(req.file);
      
      res.json({
        imageUrl: `${req.file.path}`
      });
    }else{
      res.status("409").json("No Files to Upload.");
    }
});



module.exports = router;
