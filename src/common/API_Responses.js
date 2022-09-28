const Responses = {
  
  _200(data) {    
    return {
      headers: {
        "Content-Type": "application/json",
        "Acces-Control-Allow-Methods": "*",
        "Acces-Control-Allow-Origin": "*"
      },
      statusCode: 200,
      body: JSON.stringify(data)
    } 
  },
  
  _400(data) {    
    return {
      headers: {
        "Content-Type": "application/json",
        "Acces-Control-Allow-Methods": "*",
        "Acces-Control-Allow-Origin": "*"
      },
      statusCode: 400,
      body: JSON.stringify(data)
    } 
  },
  
  _404(data) {    
    return {
      headers: {
        "Content-Type": "application/json",
        "Acces-Control-Allow-Methods": "*",
        "Acces-Control-Allow-Origin": "*"
      },
      statusCode: 404,
      body: JSON.stringify(data)
    } 
  }
  
}

module.exports = Responses;