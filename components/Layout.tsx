import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

const UAuthWeb3Modal = require("@uauth/web3modal");

import UAuthSPA from "@uauth/js";

import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import styled from "styled-components";
import { motion } from "framer-motion";
import Header from "./Header";

import AppContext from "../context/AppContext";
import { GlobalStyle } from "../components";

import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";
import notify from "../hooks/notification";

interface Props {
  children: any;
}

const uauthOptions: UAuthWeb3Modal.IUAuthOptions = {
  clientID: "e60fd2ef-c514-4c0e-a61a-c0075872a4b7",
  redirectUri: "https://imio-zora.vercel.app",
  scope: "openid wallet",
};

let providerOptions = {
  "custom-uauth": {
    display: UAuthWeb3Modal.display,

    connector: UAuthWeb3Modal?.connector,

    package: UAuthSPA,

    options: uauthOptions,
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: "fdd5eb8e3a004c9c9caa5a91a48b92b6",
      chainId: 80001,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: "Kasuwa",
      infuraId: "fdd5eb8e3a004c9c9caa5a91a48b92b6",
      chainId: 80001,
    },
  },
};
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    providerOptions,
    cacheProvider: true,
    theme: `dark`,
  });
  UAuthWeb3Modal?.registerWeb3Modal(web3Modal);
}

const collectionsTable = "collections_80001_801";
const privateKey = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const tblWallet = new Wallet(privateKey);
const tblProvider = new providers.AlchemyProvider("maticmum", alchemyKey);
const Layout = ({ children }: Props) => {
  const [theme, setTheme] = useState(true);

  const [currentAccount, setCurrentAccount] = useState();
  const [provider, setProvider] = useState();
  const [chainId, setChainId] = useState();
  const [createLoading, setCreateLoading] = useState();

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme") || "true"));
  }, []);
  const changeTheme = () => {
    setTheme(!theme);
    localStorage.setItem("theme", JSON.stringify(!theme));
  };

  const poll = async () => {
    if (web3Modal.cachedProvider) {
      let wallet = await web3Modal.connect();
      const tProvider = new ethers.providers.Web3Provider(wallet);
      setProvider(tProvider);
      const accounts = await tProvider?.listAccounts();
      console.log("CHECKING ACCOUNT ADDRESS", accounts[0]);
      //   console.log('Accounts', accounts);
      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("Found an authorized account:", account);
        const signer = tProvider.getSigner();
        let chainID = await signer.getChainId();
        setChainId(chainID);
        if (chainID == 80001) {
        } else {
          console.log("Wrong chain ID");
        }
      } else {
        console.log("No authorized account found");
      }
    } else {
      setCurrentAccount();
    }
  };
  const createEventTBl = async (event) => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      console.log(tbl, "THIS IS THE TBL");
      const writeTx = await tbl.write(
        `INSERT INTO ${collectionsTable} VALUES ('${event.id}', '${event.name}', '${event.image}','${event.owner}','${event.description}','${event.price}''${event.startDate}','${event.endDate}')`
      );
      console.log(writeTx);
    } catch (err) {
      console.log(err);
    }
  };

  const getEvents = async () => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const { rows } = await tbl.read(`SELECT * FROM ${collectionsTable}`);
      console.log("GETTING ALL EVENTS ", rows);
      return rows;
    } catch (err) {
      console.log(err);
    }
  };
  const getEvent = async (id) => {
    try {
      const signer = tblWallet.connect(tblProvider);
      const tbl = await connect({ signer });
      const { rows } = await tbl.read(
        `SELECT * FROM ${collectionsTable} WHERE id = '${id}'`
      );
      console.log(rows);
      return rows;
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    try {
      const wallet = await web3Modal.connect();

      const tProvider = new ethers.providers.Web3Provider(wallet);

      setProvider(tProvider);
      const accounts = await tProvider.listAccounts();
      const signer = tProvider.getSigner();
      setCurrentAccount(accounts[0]);
      poll();
    } catch (error) {
      console.log("CONNECT ERROR HERE", error);
    }
  };

  const disconnectWallet = async () => {
    const wallet = await web3Modal.connect();
    web3Modal.clearCachedProvider();
    setCurrentAccount(null);
  };
  useEffect(() => {
    poll();
  }, []);

  const createEvent = async ({
    args,
    abi,
    address,
    type,
    imageURL,
    startDate,
    endDate,
    description,
    price,
  }) => {
    console.log("HERE IS EVERTYTHING", args, abi, address, type, imageURL);
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      const signer = tProvider.getSigner();
      setCreateLoading(true);
      const connectedContract = new ethers.Contract(address, abi, signer);
      const tx = await connectedContract.createDrop(
        args[0], // Collection Name
        args[1], // Collection Symbol
        args[2], // Contract Admin
        args[3], // Token Supply
        args[4], // Royalty Bps
        args[5], // Funds Recipient
        args[6], // Sales Config
        args[7], // metadataBaseURI
        args[8] // metadataContractURI);)
      );
      const receipt = await tx.wait();
      const contractAddress = receipt?.events?.[4]?.args?.[1] || "ddd";
      console.log(
        "This is the contract address of collection",
        contractAddress
      );

      console.log("HERE IS THE RECEIPT", receipt);
      console.log("TABLELAND DATA", {
        id: contractAddress,
        name: args[0],
        image: imageURL,
        owner: currentAccount,
        startDate,
        endDate,
        description,
        price,
      });
      createEventTBl({
        id: contractAddress,
        name: args[0],
        image: imageURL,
        owner: currentAccount,
        startDate,
        endDate,
        description,
        price,
      });

      // console.log("Event Created Successfully", tx);
      setCreateLoading(false);
      notify({ title: "Event created successfully", type: "success" });
    } catch (e) {
      setCreateLoading(false);
      console.log(e);
      notify({ title: "Error creating event", type: "error" });
    }
  };

  const mintTicket = async ({ abi, address, price }) => {
    const wallet = await web3Modal.connect();
    const tProvider = new ethers.providers.Web3Provider(wallet);
    try {
      setCreateLoading(true);
      const signer = tProvider.getSigner();

      const connectedContract = new ethers.Contract(address, abi, signer);
      const tx = await connectedContract.purchase(price, { value: price });

      setCreateLoading(false);
      notify({ title: "Event registered successfully", type: "success" });
      console.log("Event Created Successfully", tx);
    } catch (e) {
      console.log(e);
      notify({ title: "Error registering for event", type: "error" });
      setCreateLoading(false);
    }
  };

  return (
    <StyledLayout>
      <AppContext.Provider
        value={{
          theme,
          changeTheme,
          connectWallet,
          currentAccount,
          disconnectWallet,
          chainId,
          getEvents,
          createEvent,
          createEventTBl,
          mintTicket,
          createLoading,
          getEvent,
        }}
      >
        <GlobalStyle theme={theme} />
        <Header />
        {children}
      </AppContext.Provider>
    </StyledLayout>
  );
};
const StyledLayout = styled(motion.div)``;
export default Layout;
