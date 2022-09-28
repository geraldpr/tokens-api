const Responses = require("../common/API_Responses");

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const validEmail = testMail => {
  var check_email = '[a-zA-Z0-9]{0,}([.]?[a-zA-Z0-9]{1,})[@](gmail.com|hotmail.com|yahoo.es)';
  var patt = new RegExp(check_email);
  var result = patt.test(testMail);
  if (!result) {
    //errors.push({msg: "You can't use that email to register"});
    return false;
  }
  return true
}

const validExpDate = (creditCardYear, creditCardMonth) => {
  var date = new Date ();
  var month = date.getMonth();
  var year = date.getFullYear();
  var yearPlusFiveYears = new Date(year + 5,month);
  var yearPlusFiveYearsOnlyYear = yearPlusFiveYears.getFullYear();
  //console.log(yearPlusFiveYearsOnlyYear);

  if(creditCardYear == ''){
    //console.log('Esta vacío');
    return false;
  }
  if(creditCardMonth == ''){
    //console.log('Mes esta vacío');
    return false;
  }
  if(creditCardYear > yearPlusFiveYearsOnlyYear){
    //console.log(`Es mayor ${creditCardYear} a ${yearPlusFiveYearsOnlyYear}`);
    return false;
  }
  if (creditCardYear < year){
    //console.log(`El año ${creditCardYear} es menor a ${year}`);
    return false;
    //return false;
  }
  if (creditCardYear === year && creditCardMonth <= month){
    //console.log(`El año ${creditCardYear} es igual a ${year} pero el mes ${creditCardMonth} es menor o igual a ${month}`);
    return false;
  }
  return true;
  //console.log("no hay nada que validar")
  
}

const validMonth= num => {
  const regexp = /^(0?[1-9]|1[012])$/;
  if(regexp.test(num)) {
    return true;
  } else {
    return false;
  }
}

const validCvv = num => {
  const regexp = /^[0-9]{3,4}$/;
  if(regexp.test(num)) {
    return true;
  } else {
    return false;
  }
}

const luhnCheck = num => {
  let arr = (num + '')
    .split('')
    .reverse()
    .map(x => parseInt(x));
  let lastDigit = arr.splice(0, 1)[0];
  let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
  sum += lastDigit;
  return sum % 10 === 0;
};

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


module.exports.createToken = async (event, context) => {
  
  const body = JSON.parse(event.body);    
  
  if (!body) { 
    return Responses._400({message: "Invalid request" }); 
  }
  
  if(!luhnCheck(body.card_number)){
    return Responses._400({message: "Credit Card Invalid" }); 
  }

  if(!validCvv(body.cvv)){
    return Responses._400({message: "CVV Invalid" });
  }

  if(!validMonth(body.expirante_month)){
    return Responses._400({message: "Month Invalid" });
  }

  if(!validExpDate(body.expirante_year,body.expirante_month)){
    return Responses._400({message: "Year Invalid" });
  }
  
  if (!body.email || !body.card_number) {
    return Responses._400({message: "Missing parameters" }); 
  }

  if(!validEmail(body.email)){
    return Responses._400({message: "Email Invalid" });
  }
  
  const AWS = require("aws-sdk"); 

  const db = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  
  const tableName = "tokens";
  
  const token = generateString(16);
  
  const params = {
    TableName: tableName,
    Item: {
      "_id": token,
      "email": body.email,
      "card_number": body.card_number,
      "cvv": body.cvv,
      "expirante_year": body.expirante_year,
      "expirante_month": body.expirante_month,   
      "token": token,   
    }
  }

  try {

    var data = await db.put(params).promise();    
    return Responses._200({message: "success", data: { token: token } });

  } catch(error) {

    console.log("error: " + error);    
    return Responses._400({
      message: error
    });

  }
  
};