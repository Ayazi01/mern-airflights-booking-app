import styled from "styled-components";
import React, { useState, useEffect } from "react";
import tombstone from "../assets/tombstone.png";

const Reservation = () => {
    const [
        currentReservation,
        setCurrentReservation
     ] = useState({});

      useEffect(() => {
        
        setCurrentReservation(
          JSON.parse(window.localStorage.getItem("currentReservation"))
        );
        console.log("lolo",currentReservation)
      }, []);
    
      
    return (
        <Wrapper>
        <div>
        <Title>Your Reservation:</Title>
        <p>
          Reservation #: <span>{currentReservation?.id}</span>
        </p>
        <p>
          Flight #: <span>{currentReservation.flight}</span>
        </p>
        <p>
          seat #: <span>{currentReservation.seat}</span>
        </p>
        <p>
          Name #:
          <span>
            {currentReservation.givenName}
          </span>
        </p>
        <p>
          Email: <span>{currentReservation.email}</span>
        </p>
      </div>
      <img src={tombstone} style={tombstone.png} alt="R.I.P. Tombstone" />
      </Wrapper>
        // TODO: Display the POSTed reservation information
    )
};



export default Reservation

const Wrapper = styled.div`
  height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
 
  div {
    border: 1px solid black;
    border-radius: 5px;
    padding: 20px;
  }
 
  p {
    margin: 8px;
    font-size: 16px;
    font-weight: 900;
    font-family: "Courier New", Courier, monospace;
  }
 
  span {
    font-weight: 300;
    font-family: var(--font-body);
    font-size: 14px;
  }
 
  img {
    width: 15%;
  }
`;
 
const Title = styled.p`
  color: #ad0f1d;
  padding: 5px 0 5px 0;
  border-bottom: solid 1px #ad0f1d;
`;
 



