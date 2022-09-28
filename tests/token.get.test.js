
const tokens = require("../src/tokens/get");

const eventGenerator = require("./eventGenerator");

test("Get planet", async () => {
  
  const token_add = require("../src/tokens/create");
  
  const event_add = eventGenerator({
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
  
  const res_add = await token_add.createPlanet(event_add);  
  const body_add = JSON.parse(res_add.body);  
  expect(res_add.statusCode).toBe(200);
  
  const event = eventGenerator({
    pathParametersObject: {
        token: body_add.data.token,
    },
    method: "get"
  });

  const res = await tokens.getPlanet(event);
  expect(res.statusCode).toBe(200);

});


test("Get token without id", async () => {

  const event = eventGenerator({});

  const res = await tokens.getCreditCard(event);  
  
  expect(res.statusCode).toBe(400);

});


test("Get token with id doesn't exists", async () => {

  const event = eventGenerator({
    pathParametersObject: {
        token: 112233,
    },
    method: "get"
  });

  const res = await tokens.getCreditCard(event);  
  
  expect(res.statusCode).toBe(404);

});

