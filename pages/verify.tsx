import React, { FC, useEffect, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styled from "styled-components";

import Input from "../components/Input";

import Textarea from "../components/Textarea";

import { Loader, DatePicker } from "../components";
import AppContext from "../context/AppContext";
import notify from "../hooks/notification";

const Verify = () => {
  const { theme, getEvents, createEventTBl } = useContext(AppContext);
  const router = useRouter();
  const { event, user } = router.query;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState();

  const [userAddress, setUserAddress] = useState(user);
  const [eventAddress, setEventAddress] = useState(event);

  console.log(
    "kydfgusgfiasfgfdgasdgfiawgfiuewgafwiegfiaefgwaegufigwegiurlaguei",
    userAddress,
    eventAddress
  );
  const submitHandler = async (e) => {
    e.preventDefault();

    // createEventTBl({
    //   id: "0xD7664122Ed7483a9337A11f5d7b9666D5CD28103",
    //   name: "Dancing Man Event",
    //   image:
    //     "https://ipfs.infura.io/ipfs/QmQJ9jLKcL6CdzUtkGVBL9UJQzV3y3C1GjiQZj7joF3fq9",
    //   owner: "0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39",
    //   description: "Just a test event",
    //   price: "0.0111",
    //   startDate: "1659830400000",
    //   endDate: "1660176000000",
    // });
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/80001/address/${userAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_a2341ac051bd419d815522ed217`
    );
    checkNfts(data?.data?.items);
    console.log("THIS IS THE NFTS OF THE USER", data?.data?.items);
  };

  const checkNfts = (y) => {
    let isRegistered = false;
    for (let x of y) {
      if (x.contract_address == eventAddress) {
        isRegistered = true;
      }
    }
    if (isRegistered) {
      notify({ title: "User is registered for event", type: "success" });
    } else {
      notify({ title: "User is NOT registered for event", type: "success" });
    }
  };
  return (
    <StyledVerify theme_={theme}>
      <Loader visible={loading} />
      <motion.div className="page_header">
        <h2 className="page_title text-gradient">Verify User</h2>
      </motion.div>
      <motion.div className="page_container">
        <div className="preview_div">
          <form onSubmit={submitHandler}>
            <Input
              name="Event Address"
              label="Event Address"
              asterik={true}
              placeholder="Event Address"
              value={eventAddress}
              onChange={(e) => setEventAddress(e.target.value)}
              required
              theme={theme}
            />

            <Input
              name="User address"
              label="User address"
              asterik={true}
              value={userAddress}
              placeholder="User address"
              onChange={(e) => setUserAddress(e.target.value)}
              required
              theme={theme}
            />

            <button type="submit">Verify User</button>
          </form>
        </div>
      </motion.div>
    </StyledVerify>
  );
};

const StyledVerify = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  padding: 2rem 6rem;
  gap: 2.5rem;
  @media screen and (max-width: 900px) {
    gap: 2rem;
  }
  width: 100%;
  .page_header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
    h2 {
    }
  }
  .page_container {
    padding: 1rem 6rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    width: 100%;
    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 1rem 0rem;
      gap: 0rem;
    }
    h2 {
      font-size: 1.6rem;
      @media screen and (max-width: 900px) {
        font-size: 1.3rem;
      }
    }

    .preview_div {
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      padding-left: 2rem;
      width: 50%;
      s @media screen and (max-width: 900px) {
        width: 100%;
        padding-left: 0rem;
        padding: 1rem;
      }
      .listing-price {
        padding: 2rem 0.5rem;
        color: #d04bff;
      }
    }
  }
`;
export default Verify;
