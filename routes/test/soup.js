let JSSoup = require('jssoup').default;
let unirest = require('unirest');

let soup = new JSSoup('./form.html');
let answers = {};

for (let i=1; i<64; i++)
{
    if(document.getElementById('ans'+i+'op1').checked) {
        answers['ans'+i] = '3';
    }else if(soup.getElementById('ans'+i+'op2').checked) {
        answers['ans'+i] = '2';
    }else if(soup.getElementById('ans'+i+'op3').checked) {
        answers['ans'+i] = '1';
    }else if(soup.getElementById('ans'+i+'op4').checked) {
        answers['ans'+i] = '0';
    }
}

var Request = unirest.put('https://api.myjson.com/bins/u3gyo')
    .data(answers)
    .end(function (response) {
        console.log(response.body);
    })
