import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AppContext from "../context/AppContext";

const EventCard = ({ event }) => {
  const { theme, currentAccount } = useContext(AppContext);
  const router = useRouter();

  return (
    <StyledEventCard
      theme_={theme}
      onClick={() => router.push(`/events/${event?.[0]}`)}
    >
      <img src={event?.[2]} alt="img" />
      <div className="nft-desc">
        <span className="title">
          <h3>{event?.[1]}</h3>
          <h4>
            {new Date(event?.[6]).getUTCDate()}/
            {new Date(event?.[6]).getMonth()}-
            {new Date(event?.[7]).getUTCDate()}/{" "}
            {new Date(event?.[7]).getMonth()} (
            {new Date(event?.[7]).getFullYear()})
          </h4>
        </span>

        <span className="sale">
          <span className="author">
            {" "}
            <p>
              {" "}
              {event?.[3]?.slice(0, 4)}...{event?.[3]?.slice(-4)}
            </p>{" "}
          </span>{" "}
          <p>Owner</p>
        </span>
      </div>
    </StyledEventCard>
  );
};

const StyledEventCard = styled(motion.div)<{ theme_: boolean }>`
  width: 100%;
  padding: 0rem 0rem;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
  background: ${({ theme_ }) =>
    theme_ ? "rgb(23, 24, 24,0.9)" : "rgb(248, 248, 248,0.9)"};
  background: ${({ theme_ }) => (theme_ ? "#24242b" : "#f2f2f2")};
  cursor: pointer;
  &:hover {
    -moz-box-shadow: 0 0 4.5px #ccc;
    -webkit-box-shadow: 0 0 4.5px #ccc;
    box-shadow: 0 0 4.5px #ccc;
  }

  overflow: hidden;
  img {
    height: 15rem;
    width: 100%;
    object-fit: cover;
  }
  height: auto;
  display: flex;
  flex-flow: column wrap;

  .nft-desc {
    display: flex;
    flex-flow: column wrap;
    padding: 0rem 1rem;
    gap: 0.5rem;

    .title,
    .sale {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;

      img {
        width: 1.5rem;
        height: 1.5rem;
        object-fit: cover;
        border-radius: 50%;
        @media screen and (max-width: 900px) {
          width: 1rem;
          height: 1rem;
        }
      }
    }
    .title {
      h3 {
        font-weight: 500;
      }
      p {
        color: #20b2aa;
      }
    }
    .sale {
      padding-bottom: 1rem;
      .author {
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
    }
  }
`;

export default EventCard;
