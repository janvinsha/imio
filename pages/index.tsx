import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import styled from "styled-components";

import AppContext from "../context/AppContext";
import Lottie from "react-lottie";
import homeData from "../public/animations/home.json";

export default function Home() {
  const router = useRouter();

  const { theme } = useContext(AppContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: homeData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <StyledHome theme_={theme}>
      <div className="desc">
        <h1>A ticketing marketplace built on Zora Protocol</h1>
        <h2>Create your events and allow users mint tickets as NFTs</h2>
        <h3>Tickets can be resold by owners</h3>
        <button className="plain-btn" onClick={() => router.push("/events")}>
          Events
        </button>
      </div>
      <div className="nft-desc">
        <Lottie options={defaultOptions} height={"100%"} width={"100%"} />
      </div>
    </StyledHome>
  );
}
const StyledHome = styled(motion.div)<{ theme_: boolean }>`
  display: flex;
  flex-flow: row wrap;

  width: 100%;

  padding: 4rem 6rem;

  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
    flex-flow: column wrap;
  }
  .desc {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0rem;
    width: 50%;
    h2 {
      font-weight: medium;
    }
    button {
      margin-top: 1rem;
    }
  }
  .nft-desc {
    display: flex;
    gap: 6rem;
    padding: 1rem 10rem;
    justify-content: center;
    padding-bottom: 6rem;
    width: 50%;
    @media screen and (max-width: 900px) {
      width: 100%;
      padding: 1rem 0rem;
      align-items: center;
      flex-direction: column;
    }
  }
`;
