const Responses = require("../common/API_Responses");

const validToken = num => {
  const regexp = /^[a-zA-Z0-9]{16}$/;
  if(regexp.test(num)) {
    return true;
  } else {
    return false;
  }
}

module.exports.getCreditCard = async (event, context) => {
  
  
  if (!event.pathParameters || !event.pathParameters.id) {        
    return Responses._400({message: "Missing parameters" }); 
  }
  
  if(!validToken(event.pathParameters.id)){
    return Responses._400({message: "Token Invalid" });
  }
  
  const id = event.pathParameters.id;
  
  const AWS = require("aws-sdk");  
  const db = new AWS.DynamoDB.DocumentClient({ region: "us-east-1"});
  
  const tableName = "tokens";
  
  const params = {
    TableName: tableName,
    Key: {
      '_id': id,
    },
    "ProjectionExpression": "card_number, expirante_year, expirante_month, email"
  };
  
  try {

    var data = await db.get(params).promise(); 
    
    if (data.Item) {
      return Responses._200({message: "success", data: data });
    } else {
      return Responses._404({message: "not found" });  
    }
    
  } catch(error) {
    
    console.log("error: " + error);    
    console.log("id: " + id);    
    console.log(typeof id);    
    return Responses._400({message: error });

  }
  
};