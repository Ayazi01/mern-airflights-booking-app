import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ResContext } from "../UseContext";
import Plane from "./Plane";
import Form from "./Form";

const SeatSelect = ({selectedFlight}) => {

    const [selectedSeat, setSelectedSeat] = useState("");
    const {
        currentReservation,
        setCurrentReservation
      } = useContext(ResContext);
     
      let navigate = useNavigate();
    

    const handleSubmit = (e, formData) => {
        e.preventDefault();
        // TODO: POST info to server
        const bodyToPost = {
            flight: selectedFlight,
            seat: selectedSeat,
            givenName: formData.firstName,
            surname: formData.lastName,
            email: formData.email,
          };
          fetch("/api/add-reservation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify(formData),
            body: JSON.stringify(bodyToPost),
          })
            .then((res) => res.json())
            .then((data) => {
              window.localStorage.setItem(
                "currentReservation",
                JSON.stringify(data.data)
              );
              console.log("seatSelect currentReservation = ", data.data);
              navigate("/confirmation");
            });
          // TODO: POST info to server
        };
      
    

    return (
        <Wrapper>
        <h2>Select your seat and Provide your information!</h2>
        {!currentReservation ? null : (
          <>
            <FormWrapper>
              <Plane
                setSelectedSeat={setSelectedSeat}
                selectedFlight={selectedFlight}
              />
              <Form handleSubmit={handleSubmit} selectedSeat={selectedSeat} />
            </FormWrapper>
          </>
        )}
      </Wrapper>
  
    );
};

 
const FormWrapper = styled.div`
  display: flex;
  margin: 50px 0px;
`;
 
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export default SeatSelect;
