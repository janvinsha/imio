import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

import { EventCard, Filter } from "../components";
import AppContext from "../context/AppContext";

export default function Events() {
  const [sortBy, setSortBy] = useState("");
  const [events, setEvents] = useState();
  const { theme, getEvents } = useContext(AppContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const tempEvents = await getEvents();
    setEvents(tempEvents);
    console.log("HERE ARE THE EVENTS OOOooooooooooo", tempEvents);
  };
  return (
    <StyledEvents theme_={theme}>
      <div className="main">
        <div className="header">
          <div className="left">
            <h2>Events</h2>
          </div>
          <div className="right">
            <Filter
              name="Category"
              asterik={false}
              defaultValue="art"
              className="filt"
              options={[
                { label: "Popular", value: "popular" },
                { label: "Latest", value: "latest" },
              ]}
              onChange={(e) => setSortBy(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="cards">
          {dummyData?.map((event: any, i) => (
            <EventCard event={event} key={i} />
          ))}
        </div>
      </div>
    </StyledEvents>
  );
}
const StyledEvents = styled(motion.div)<{ theme_: boolean }>`
  display: flex;
  flex-flow: column wrap;
  width: 100%;

  padding: 2rem 4rem;
  gap: 2rem;
  @media screen and (max-width: 900px) {
    padding: 1rem 1rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .left {
      @media screen and (max-width: 900px) {
        display: none;
      }
    }
    .right {
      display: flex;
      gap: 2rem;
      .filt {
        width: 8rem;
      }
    }
  }
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
