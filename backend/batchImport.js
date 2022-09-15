const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const data = require("./data");
 
const batchImport = async () => {
  const client = await new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");
    const flights = data.flights;
    const reservations = data.reservations;
    console.log("Flights = ", flights);
    const flightNumbers = Object.keys(flights);
    console.log("FliGHTS = ", flightNumbers);
    let seats = Object.values(flights[flightNumbers[0]]);
 
    let document = [
      {
        flight: flightNumbers[0],
        seats: Object.values(flights[flightNumbers[0]]),
      },
      {
        flight: flightNumbers[1],
        seats: Object.values(flights[flightNumbers[1]]),
      },
    ];
    const insert1 = await db.collection("flights").insertMany(document);
    console.log("RESERVATIONS = ", reservations);
    const insert = await db.collection("reservations").insertMany(reservations);
 
    // console.log("FLIGHT = ", flightNumbers[0], "  SEATS = ", seats);
 
    if (insert.acknowledged) {
      console.log("batchImport: insertOne:Successful ", insert);
    } else {
      console.log("batchImport: insertOne error: ", insert);
    }
  } catch (err) {
    console.log("batchImport catch error: ", err);
  }
  client.close();
};
batchImport();
