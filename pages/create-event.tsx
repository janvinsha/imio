import React, { FC, useEffect, useContext, useState } from "react";
import axios from "axios";

import { motion } from "framer-motion";
import styled from "styled-components";

import Input from "../components/Input";

import Textarea from "../components/Textarea";

import { Loader, DatePicker } from "../components";
import AppContext from "../context/AppContext";

import PhotoIcon from "@mui/icons-material/Photo";

import notify from "../hooks/notification";

import { create } from "ipfs-http-client";
import { utils } from "ethers";
import editionsABI from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json";
import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js";
const ZoraNFTCreatorProxy_ABI = require("../node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ZoraNFTCreatorV1.sol/ZoraNFTCreatorV1.json");
const ZoraNFTCreatorProxy_ADDRESS_RINKEBY =
  "0x2d2acD205bd6d9D0B3E79990e093768375AD3a30";

// Construct with token and endpoint

const nftClient = new NFTStorage({
  token:
    process.env.NEXT_NFT_STORAGE_PRIVATE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM0MTBFMThhZUMzOGY4M2UyNTMxMzA4QmQyN0QyM0I3MjllNTJDNDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0OTQzNjM4OTkyNiwibmFtZSI6IkRBTyJ9.eWlB3VEJKUk3R1S6e5RFRhdONcgBkyCMjrWA9O5kdsA",
});
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
const CreateEvent = () => {
  const [name, setName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [noTickets, setNoTickets] = useState();
  const [royaltyPercentage, setRoyaltyPercentage] = useState();
  const [payoutAddress, setPayoutAddress] = useState();
  const [hashtags, setHashtags] = useState([]);
  const hiddenDpInput = React.useRef(null);
  const [dp, setDp] = useState();

  const {
    theme,
    currentAccount,
    connectWallet,
    createEvent,
    mintTicket,
    createLoading,
  } = useContext(AppContext);

  const handleDpClick = (event) => {
    hiddenDpInput.current.click();
  };

  const uploadDpHandler = async (e) => {
    const file = e.target.files[0];

    console.log("This is the file", file);
    if (file.type.startsWith("image")) {
      setDp(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    }
  };
  console.log("HERE Ö", price?.toString());
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!currentAccount) {
      connectWallet();
      return;
    }
    if (!dp) {
      alert("Upload Photo");
      return;
    }

    try {
      console.log("CHECKING DP", dp);

      let photo = await client.add(dp);
      let photoUrl = `https://ipfs.infura.io/ipfs/${photo.path}`;

      console.log("Web3storage", photo, photoUrl);
      console.log("CHECKING DATES", startDate, endDate);
      const data = await nftClient.store({
        name,
        description,
        noTickets,
        owner: currentAccount,
        startDate,
        endDate,
        price,
        app: "imio",
        image: new File([dp], "photo of collection", {
          type: dp?.type,
        }),
      });
      console.log(
        "NFT METADATA",
        data?.url,
        data?.ipnft,
        `ipfs://${data?.ipnft}/`
      );
      setLoading(true);
      createEditionRinkeby({
        imageURL: photoUrl,
        metadataContractURI: data?.url,
        metadataURIBase: `ipfs://${data?.ipnft}/`,
      });
      setLoading(false);

      //   notify({ title: "Nft created successfully", type: "success" });
    } catch (error) {
      console.log(error);
      setLoading(false);
      notify({
        title: "There was an error trying to create an event",
        type: "error",
      });
    }
  };

  let salesConfig = [
    utils.parseEther(price?.toString() || "0.00001"),
    1,
    new Date(startDate).getTime(),
    new Date(endDate).getTime(),
    0,
    0,
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  ];

  const createEditionRinkeby = async ({
    imageURL,
    metadataURIBase,
    metadataContractURI,
  }) => {
    let arg = [
      name,
      name?.slice(0, 3),
      currentAccount,
      noTickets,
      royaltyPercentage,
      payoutAddress,
      salesConfig,
      metadataURIBase,
      metadataContractURI,
    ];
    setLoading(true);
    await createEvent({
      args: arg,
      abi: ZoraNFTCreatorProxy_ABI.abi,
      address: ZoraNFTCreatorProxy_ADDRESS_RINKEBY,
      type: "drop",
      imageURL,
      startDate: new Date(startDate).getTime()?.toString(),
      endDate: new Date(endDate).getTime()?.toString(),
      description,
      price: price?.toString(),
    });
    setLoading(false);
  };

  return (
    <StyledCreateEvent theme_={theme}>
      <Loader visible={createLoading} />
      <motion.div className="page_header">
        <h2 className="page_title text-gradient">Create Event</h2>
      </motion.div>
      <motion.div className="page_container">
        <div className="upload_div">
          <div className="img_input ">
            <div className="box">
              {dp?.preview ? (
                <>
                  <img src={dp.preview} />
                </>
              ) : (
                <>
                  <h3>PNG, JPEG, GIF, WEBP, MP4</h3>
                  <h3>Max 100mb</h3>
                  <PhotoIcon className="icon" />

                  <h3> Click button select</h3>
                  <button className="plain-btn" onClick={handleDpClick}>
                    Select file
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="preview_div">
          <form onSubmit={submitHandler}>
            <Input
              name="name"
              label="Name"
              asterik={true}
              placeholder="Item Name"
              onChange={(e) => setName(e.target.value)}
              required
              theme={theme}
            />

            <Input
              name="Price"
              label="Price"
              asterik={true}
              placeholder="Mint price"
              onChange={(e) => setPrice(e.target.value)}
              required
              theme={theme}
              type="number"
              step="any"
            />
            <Input
              name="Number of Tickets"
              label="Number of Tickets"
              asterik={true}
              placeholder="Number of Tickets"
              onChange={(e) => setNoTickets(e.target.value)}
              required
              theme={theme}
              type="number"
            />
            <Textarea
              name="description"
              label="Description"
              placeholder="Description..."
              className="text-area"
              role="textbox"
              asterik={true}
              rows={6}
              onChange={(e) => setDescription(e.target.value)}
              required
              theme={theme}
            />
            <DatePicker
              name="Minting Starts"
              label="Minting Starts"
              asterik={true}
              onChange={(e) => setStartDate(e.target.value)}
              required
              theme={theme}
            />
            <DatePicker
              name="Minting Ends"
              label="Minting Ends"
              asterik={true}
              onChange={(e) => setEndDate(e.target.value)}
              required
              theme={theme}
            />
            <Input
              name="Royalty Percentage"
              label="Royalty Percentage"
              asterik={true}
              placeholder="Royalty Percentage"
              onChange={(e) => setRoyaltyPercentage(e.target.value)}
              required
              theme={theme}
              type="number"
              min="1"
              max="20"
            />
            <Input
              name="Payout address"
              label="Payout address"
              asterik={true}
              placeholder="Payout address"
              onChange={(e) => setPayoutAddress(e.target.value)}
              required
              theme={theme}
            />

            <button type="submit">Create Event</button>
          </form>
        </div>
      </motion.div>
      <input
        type="file"
        ref={hiddenDpInput}
        onChange={uploadDpHandler}
        style={{ display: "none" }}
      />
    </StyledCreateEvent>
  );
};

const StyledCreateEvent = styled(motion.div)`
  display: flex;
  flex-flow: column wrap;
  padding: 2rem 6rem;
  gap: 2.5rem;
  @media screen and (max-width: 900px) {
    gap: 0rem;
    padding: 2rem 1rem;
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
    .upload_div {
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      @media screen and (max-width: 900px) {
        width: 100%;
        padding: 1rem;
      }

      .img_input {
        /* border: 2px solid #7aedc7; */
        border-radius: 0.5rem;
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 28rem;
        border: 2.5px dashed #ccc;
        width: 100%;
        box-sizing: border-box;
        border-radius: 5px;
        margin-bottom: 2rem;

        background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
        /* box-shadow: 0 0 3px #ccc; */
        h3 {
          font-size: 1.2rem;
        }
        img {
          width: 100%;
          display: block;
          object-fit: cover;
        }
      }
      .box {
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        border-radius: 0.5rem;
        .icon {
          font-size: 10rem;
        }
        .plain-btn {
          margin-top: 1rem;
          padding: 0.5rem 3rem;
        }
      }
    }

    .preview_div {
      width: 50%;
      display: flex;
      flex-flow: column wrap;
      gap: 1rem;
      padding-left: 2rem;
      @media screen and (max-width: 900px) {
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
export default CreateEvent;
