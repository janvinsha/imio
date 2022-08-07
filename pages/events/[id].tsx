import { useState, useEffect, useContext } from "react";
import * as React from "react";
import { useRouter } from "next/router";

import { motion } from "framer-motion";
import styled from "styled-components";

import { NftCard, Loader } from "../../components";
import AppContext from "../../context/AppContext";
import { formatEther } from "ethers/lib/utils";

import { utils, BigNumber } from "ethers";
import editionsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json";

import QRCode from "react-qr-code";
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const networkInfo = {
  network: ZDKNetwork.Ethereum,
  chain: ZDKChain.Rinkeby,
};

const API_ENDPOINT = "https://api.zora.co/graphql";
const args = {
  endPoint: API_ENDPOINT,
  networks: [networkInfo],
  //   apiKey: process.env.API_KEY,
};

const zdk = new ZDK(args);
export default function ListingDetails() {
  const router = useRouter();
  const { pathname } = router;
  const { id: eventId } = router.query;

  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState();
  const [generated, setGenerated] = useState(false);

  const { theme, currentAccount, mintTicket, createLoading, getEvent } =
    useContext(AppContext);

  useEffect(() => {
    getData();
  }, []);

  const registerForEvent = () => {
    mintTicket({
      abi: editionsABI.abi,
      address: "0x230864bab819a49a3e3cd634eb266f9042d22e82",
      price: BigNumber.from(utils.parseEther(event?.[5])),
    });
  };
  let passValue = `https://imio-zora.vercel.app?user=${currentAccount}&event=${eventId}`;

  const getData = async () => {
    try {
      let tempEvent = await getEvent(eventId);
      tempEvent = tempEvent?.[0];
      let tempData = findCollection();
      setEvent(tempData);
      console.log("THIS IS THE OFUND EVENT OOO", event);
    } catch (err) {
      console.log(err);
    }
  };
  const findCollection = () => {
    for (let x of dummyData) {
      if (x?.[0] == eventId) {
        return x;
      }
    }
  };

  return (
    <StyledListingDetails theme_={theme}>
      <Loader visible={createLoading} />
      <div className="desc">
        <div className="left">
          <img src={event?.[2]} alt="img" />
        </div>

        <div className="right">
          <h2>{event?.[1]}</h2>

          <span>
            <h3>
              {new Date(event?.[6]).getUTCDate()}/
              {new Date(event?.[6]).getMonth()} -{" "}
              {new Date(event?.[7]).getUTCDate()}/{" "}
              {new Date(event?.[7]).getMonth()} (
              {new Date(event?.[7]).getFullYear()})
            </h3>
          </span>
          <h2>Register for event </h2>
          <h3>Cost: {event?.[5]} Eth</h3>
          <button onClick={registerForEvent}>Register</button>
          <button onClick={() => setGenerated(!generated)}>
            Generate Pass
          </button>
          {generated && (
            <div
              style={{
                height: "auto",
                margin: "0 auto",
                maxWidth: 150,
                width: "100%",
              }}
            >
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={passValue}
                viewBox={`0 0 256 256`}
              />
            </div>
          )}
          <h3>{event?.[4]}</h3>
        </div>
      </div>
    </StyledListingDetails>
  );
}
const StyledListingDetails = styled(motion.div)<{ theme_: boolean }>`
  min-height: 81vh;
  display: flex;
  flex-flow: column wrap;
  padding: 2rem 4rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 0rem;
  }

  .desc {
    display: flex;
    flex-flow: row wrap;

    @media screen and (max-width: 900px) {
      flex-flow: column wrap;
      padding: 0rem 1rem;
      gap: 1rem;
    }
    .left {
      width: 50%;
      @media screen and (max-width: 900px) {
        width: 100%;
        height: 100%;
        padding-right: 0rem;
      }
      padding-right: 2rem;

      img {
        width: 100%;
        height: 100%;

        object-fit: cover;
        border-radius: 0.5rem;
      }
    }
    .right {
      @media screen and (max-width: 900px) {
        width: 100%;
      }
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      align-items: center;
      padding: 2rem 4rem;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        padding: 0rem 0rem;
      }
    }
  }

  .collection_nfts {
    display: flex;
    flex-direction: column;

    .cards {
      width: 100%;
      padding: 2rem 0rem;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-column-gap: 1rem;
      grid-row-gap: 1rem;
      @media screen and (max-width: 900px) {
        grid-template-columns: repeat(1, 1fr);
        grid-column-gap: 0.5rem;
        grid-row-gap: 0.5rem;
        width: 100%;
        padding: 0rem 0rem;
      }
    }
  }
`;

const dummyData = [
  [
    "0x9D1d06e46836bb65a55DE25aEF21006E5f0E7CbD",
    "Zora Party",
    "https://ipfs.infura.io/ipfs/QmWgVrQkAGwWgCXZkNcUpENe2T595cWDqHhEXjpyVL9CmH",
    "0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39",
    "Just a test event",
    "0.0111",
    1659830400000,
    1659916800000,
  ],
  [
    "0x5cbd3BaCB5231CEF94110B4358847DE6066d526B",
    "Imio Party",
    "https://ipfs.infura.io/ipfs/QmQm65erzbevwrDWZvgp6xgzRBvU2W1TygHaV2EkGc9ENw",
    "0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39",
    "Just a test event",
    "0.0111",
    1659830400000,
    1660089600000,
  ],
  [
    "0xD7664122Ed7483a9337A11f5d7b9666D5CD28103",
    "Dancing Man Event",
    "https://ipfs.infura.io/ipfs/QmQJ9jLKcL6CdzUtkGVBL9UJQzV3y3C1GjiQZj7joF3fq9",
    "0x659CE0FC2499E1Fa14d30F5CD88aD058ba490e39",
    "Just a test event",
    "0.0111",
    1659830400000,
    1660176000000,
  ],
];
