
const tokens = require("../src/tokens/create");

const eventGenerator = require("./eventGenerator");


test("Add Credit Card", async () => {

  const event = eventGenerator({
    body: {
      _id: "U7Hi9jwEjrQTjES2",
      email: "gerald@gmail.com",
      card_number: "4485275742308327",
      cvv: "100",
      expirante_year: "2026", 
      expirante_month: "12",
      token: "U7Hi9jwEjrQTjES2"
    },
    method: "post"
  });

  const res = await tokens.createToken(event);  

  const body = JSON.parse(res.body);

  expect(res.statusCode).toBe(200);

});


test("Add credit card with invalid request", async () => {

  const event = eventGenerator({    
    method: "post"
  });

  const res = await tokens.createToken(event);  
  
  expect(res.statusCode).toBe(400);  
  
  const body = JSON.parse(res.body);
  
  expect(body.message).toMatch(/Invalid/);

});



test("Add tokens with missing parameters", async () => {

  const event = eventGenerator({  
    body: {
      card_number: "4485275742308327"
    },
    method: "post"
  });

  const res = await tokens.createToken(event);  
  
  expect(res.statusCode).toBe(400);  
  
  const body = JSON.parse(res.body);
  
  expect(body.message).toMatch(/Missing/);

});