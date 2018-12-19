var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var Browser = require("zombie");
var assert = require("assert");
var cheerio = require('cheerio');
var rp = require('request-promise');
var S = require('string')
//Variables
let answer_url;
let ans;
let result_url;
let result;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/form', function (req, res, next) {
  res.render('form', {
    title: 'Form'
  });
});

router.post('/ans', function (req, res, next) {
  //console.log(req.body);
  ans = req.body;
  var Request = unirest.post('https://api.myjson.com/bins').type('json')
    .send(req.body)
    .end(function (Response) {
      answer_url = Response.raw_body.uri;
      console.log(answer_url);
      //next();
    });

  res.redirect('/career');
});

router.get('/career', function (req, res, next) {
  function dedo() {
    browser = new Browser();
    browser.open("https://www.yourfreecareertest.com");
    browser.visit("https://www.yourfreecareertest.com").then(function () {
      for (var key in ans) {
        let element = 'input[name=' + key + ']';
        let val = ans[key];
        browser.fill(element, val);
      }
      browser.document.forms[1].submit();
    });
    browser.wait(29000).then(function () {
      if (browser.url.length < 40) {
        dedo();
      } else {
        console.log(browser.url);
        result_url = browser.url;
        res.redirect('/result');
      }
      //next();
    });
  }
  dedo();
});

router.get('/result', function (req, res, next) {
  var options = {
    uri: String(result_url),
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
    .then(($) => {
      //console.log($);
      let i;
      //$('.display_part_result').find('h5').replaceWith('\n')
      let interest = $('.display_part_result').find('h5').text();
      let field = $('.display_part_result').find('h5').next().text();
      for (i = 0; i < field.length; i++) {
        if (field.charAt(i) == "-")
          field = field.substring(0, i) + " " + field.substring(i + 1);
      }
      for (i = 0; i < field.length; i++) {
        if (field.charAt(i) == " ") {
          field.charAt(i + 1).toLowerCase();
        }
      }
      console.log(field);


      let tem = S(field).replaceAll(" ", "lolol");

      console.log(tem);
      let tem2 = S(tem).humanize();
      console.log(tem2);
      let human2 = S(interest).replaceAll('%', '%@');
      let son = [];
      let temp;
      let human1 = S(tem2).replaceAll("lolol ", "_");
      console.log(human1);
      let arr = human1.split(" ");
      let arr2 = human2.split("@");

      /*
      for(i=0;i<arr.length;i++){
        if(arr[i]=="public")
        {
          temp = arr.splice(i+1,1);
          arr[i]="public service";
        }
        if(arr[i]=="social")
        {
          temp = arr.splice(i+1,1);
          arr[i]="social science";
        }
        if(arr[i]=="the")
        {
          temp = arr.splice(i+1,1);
          arr[i]="the arts";
        }
        if(arr[i]=="client")
        {
          temp = arr.splice(i+1,1);
          arr[i]="client facing";
        }
      }*/

      for (i = 0; i < arr.length; i++) {
        son.push({
          "f": String(arr[i]),
          "i": String(arr2[i])
        });
      }

      let jsonURL;
      var Request = unirest.post('https://api.myjson.com/bins').type('json')
        .send(son)
        .end(function (Response) {
          jsonURL = Response.raw_body.uri;
          console.log(jsonURL);
          //next();
        });
      //console.log(human);
      console.log(arr);
      console.log(son);
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write('<table class="table table-bordered table-striped" id="perfc_table">');
      res.write('<th>Field</th>');
      res.write('<th>Likelyhood </th>');
      son.forEach(element => {
        res.write('<tr>');
        res.write('<td>' + element.f + '</td>');
        res.write('<td>' + element.i + '</td>');
        res.write('</tr>');
      });
      res.write('</table>');
      res.end();

    })
    .catch((err) => {
      console.log(err);
    });
})

module.exports = router;