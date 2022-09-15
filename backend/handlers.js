"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// returns an array of all flight numbers
const getFlights = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");
    console.log("before get filghts");
    const results = await db.collection("flights").find().toArray();
    console.log("results = ", results);
    const data = await results.map((document) => document.flight);
    console.log("DATA = ", data);
    if (data) {
      res.status(200).json({ status: 200, data: data });
    } else {
      res.status(404).json({ status: 404, message: "No Flight found" });
    }
  } catch (err) {
    console.log("getFlights err: ", err);
    res.status(500).json({ status: 500, message: err });
  }
  client.close();

    // try {
    //     const client = new MongoClient(MONGO_URI, options);
    //     await client.connect();
    //     const db = client.db();
    //     const data = await db.collection("flights").findOne();
    //     // console.log(data)
    //     res.status(200).json({ status: 200, data });
    //   } catch (err) {
    //     res.status(400).json({ status: 400, message: "Couldn't find items" });
    //   }
};

// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  const flight = req.params.flight;
  try {
    await client.connect();
    const db = client.db("SlingAir");
    console.log("req.params.flight = ", flight);
    const results = await db.collection("flights").find({ flight }).toArray();
    const data = results[0].seats;
    console.log("results = ", results);
    console.log("results seats= ", data);
 
    if (data) {
      res.status(200).json({ status: 200, flight: flight, data: data });
    } else {
      res
        .status(404)
        .json({ status: 404, flight: flight, message: "Not found" });
      }}catch(err) {
        console.log("getFlight err: ", err);
        res.status(500).json({ status: 500, flight: flight, message: err });
      }
      client.close();
      
  // let {flight} =req.params;
  // try {
  //   const client = new MongoClient(MONGO_URI, options);
  //   await client.connect();
  //   const db = client.db();
  //   const data = await db.collection("flights").findOne({}, { projection : {[flight]:1, _id:0} });
  //   if(Object.keys(data).length === 0) throw "Empty data";
  //   res.status(200).json({ status: 200, data });
  // } catch (err) {
  //   res.status(400).json({ status: 400, message: "Couldn't find item" });
  // }
  
};

// returns all reservations
const getReservations = async(req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAir");
    const projection = { _id: 0 };
    const results = await db
      .collection("reservations")
      .find()
      .project(projection)
      .toArray();
 
    console.log("results = ", results);
    if (results) {
      res.status(200).json({ status: 200, data: results });
    } else {
      res.status(404).json({ status: 404, message: "Not found" });
    }
  } catch (err) {
    console.log("getReservations err: ", err);
    res.status(500).json({ status: 500, message: err });
  }
  client.close();
};

  //   try {
//     const client = new MongoClient(MONGO_URI, options);
//     await client.connect();
//     const db = client.db();
//     const data = await db.collection("reservations").find().toArray();
//     res.status(200).json({ status: 200, data });
//   } catch (err) {
//     res.status(400).json({ status: 400, message: "Couldn't find items" });
//   }
// };

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  const id = req.params.reservation;
 
  try {
    await client.connect();
    const db = client.db("SlingAir");
    // To skip the _id
    const _option = { projection: { _id: 0 } };
 
    const results = await db
      .collection("reservations")
      .findOne({ id }, _option);
 
    if (results) {
      res.status(200).json({ status: 200, data: results });
    } else {
      res.status(404).json({ status: 404, message: "Not found" });
    }
  } catch (err) {
    console.log("getSingleReservation err: ", err);
    res.status(500).json({ status: 500, message: err });
  }
  client.close();
  // let {reservation} =req.params;
  // try {
  //   const client = new MongoClient(MONGO_URI, options);
  //   await client.connect();
  //   const db = client.db();
  //   //88a33c23-3332-4ef2-bd71-be7a6430485f
  //   const data = await db.collection("reservations").findOne({ id : reservation });
  //   if(Object.keys(data).length === 0) throw "Empty data";
  //   res.status(200).json({ status: 200, data });
  // } catch (err) {
  //   res.status(400).json({ status: 400, message: "Couldn't find item" });
  // }
};

// creates a new reservation
//Step 1 :get request body :
/**
   * {
  "id": "88a33c23-3332-4ef2-bd71-be7a6430485f", //generated inside server using uuid package
  "flight": "SA231",
  "seat": "4D",
  "givenName": "Marty",
  "surname": "McFly",
  "email": "marty@backfuture.com"
  }
 * 
 */
//Step 2 : update seat availability
const addReservation = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  const body = req.body;
  const query = { flight: body.flight, "seats.id": body.seat };
  const updateSeat = { $set: { "seats.$.isAvailable": false } };
  const id = uuidv4();
  try {
    await client.connect();
    const db = client.db("SlingAir");
    const updateFlights = await db
      .collection("flights")
      .updateOne(query, updateSeat);
 
    if (updateFlights) {
      body.id = id;
      const insertReservations = await db
        .collection("reservations")
        .insertOne(body);
      if (insertReservations) {
        res.status(200).json({
          status: 200,
          sucess: insertReservations.acknowledged,
          data: body,
        });
      }
    } else {
      res.status(404).json({ status: 404, data: body, message: "Not found" });
    }
  } catch (err) {
    console.log("addReservation err: ", err);
    res.status(500).json({ status: 500, message: err });
  }
  client.close();
  // try{
  //     const client = new MongoClient(MONGO_URI, options);
  //     await client.connect();
  //     const db = client.db()
  //     const result = await db.collection("reservations").insertOne(req.body);
  //     res.status(201).json({ status: 201, data: result});
  // }catch(err){
  //     res.status(500).json({ status: 500, message: err.message });
  // }
 
};
// updates a specified reservation
const updateReservation =async (req, res) => {

  try{
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db()
    const result = await db.collection("reservations").updateOne(
      { id: "123" },
      { $set:
         {
           seat: "123"
         }
      }
   );
    console.log(result)
    res.status(201).json({ status: 201, data: result});
}catch(err){
    res.status(500).json({ status: 500, message: err.message });
}
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  const client = await new MongoClient(MONGO_URI, options);
  const id = req.params.reservation;
  console.log("PARAMS = ", id);
  try {
    await client.connect();
    const db = client.db("SlingAir");
    // Get the reservation infos in order to make the flight seat available
    // by modifying the flights collections
    const reservation = await db.collection("reservations").findOne({ id });
 
    if (reservation) {
      // Updates the flight
      const queryFlights = {
        flight: reservation.flight,"seats.id": reservation.seat,
      };
      const updateSeat = { $set: { "seats.$.isAvailable": true } };
      const updateFlights = await db.collection("flights").updateOne(queryFlights, updateSeat);
 
      if (updateFlights) {
        const deleteReservation = await db.collection("reservations").deleteOne({ id });
        if (deleteReservation) {
          res.status(200).json({ status: 200, reservation: id });
        } else {
          res.status(404).json({status: 404, reservation: id, message: "delete reservations has failed", });
        }
      } else {
        res.status(404).json({
          status: 404, reservation: id, message: "update flights has failed", });
      }
    }
  } catch (err) {
    console.log("deleteReservation err: ", err);
    res.status(500).json({ status: 500, reservation: id, message: err });
  }
  client.close();
};

  // console.log(req.params)
  // let {reservation} = req.params

  // try{
  //     const client = new MongoClient(MONGO_URI, options);
  //     await client.connect();
  //     const db = client.db()
  //     const result = await db.collection("reservations").deleteOne({id : reservation});
  //     console.log(result)
  //     res.status(201).json({ status: 201, data: result});
  // }catch(err){
  //     res.status(500).json({ status: 500, message: err.message });
  // }



module.exports = {
    getFlights,
    getFlight,
    getReservations,
    addReservation,
    getSingleReservation,
    deleteReservation,
    updateReservation,
};
