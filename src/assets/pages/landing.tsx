import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import bg from "../img/cover actual.png";
import React, { useEffect, useState, type SetStateAction } from "react";

//icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import type { LocationResult } from "../types/types";
import { useSearch } from "../hooks/useSearch";
import { useLocation } from "../context/locationContext";
import { useNavigate } from "react-router-dom";

// images
import picnic from "../img/landingCards/pexels-youngafrikanna-20554505.jpg";
import restaurant from "../img/landingCards/pexels-prosper-buka-1289782307-28736731.jpg";
import akara from "../img/landingCards/pexels-gabrielbodhi-28371787.jpg";
import { motion } from "motion/react";
import { Footer } from "./menu";
const Cards = [
  {
    image: picnic,
    mainText: "Food for the special memories.",
    subText: "Order food for the occasion.",
  },
  {
    image: restaurant,
    mainText: "Get food from those favorite restaurants close to you.",
    subText: "Let us plug you into the nyamza life.",
  },
  {
    image: akara,
    mainText: "Local dishes, right on your doorstep.",
    subText: "Whatever your tastebuds are feeling, we can find for you.",
  },
];
const LandingPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState("");

  const { isLoading, searchError, results } = useSearch(query);

  const { setLocation } = useLocation();

  const theme = useTheme();
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        fontFamily: "Open Sans",
        padding: 0,
        overflowX: "hidden",
      }}
    >
      <Box
        component={"section"}
        sx={{
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          position: "relative",
          zIndex: 0,
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        <Stack
          className="header"
          direction={"row"}
          component={"header"}
          sx={{
            zIndex: 1,
            maxHeight: { xs: 40, lg: 50 },
            p: 1,
            alignItems: "center",
            justifyContent: "space-between",
            background: "transparent",
          }}
        >
          {/*navigation :  nav should have logo and signup/login button */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: "montserrat",
              fontWeight: 600,
              fontSize: { xs: 13, lg: 16 },
            }}
          >
            Nyamza.
          </Typography>

          {/* button group */}
          <Stack
            direction={"row"}
            sx={{
              maxWidth: { xs: "50%", lg: "30%" },
              height: { xs: "34.5px", lg: "40px" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 2.5, lg: 1.5 },
            }}
          >
            {windowWidth < 900 ? (
              <AccountCircleIcon sx={{ color: "black" }} />
            ) : (
              <Button
                variant="contained"
                sx={{
                  height: "30px",
                  width: {
                    xs: 100,
                    lg: 120,
                    fontSize: { xs: 10, lg: 14 },
                    backgroundColor: "black",
                    fontFamily: "montserrat",
                  },
                }}
              >
                <Typography variant="caption">Login</Typography>
              </Button>
            )}
            <Button
              variant="contained"
              sx={{
                height: "30px",
                width: {
                  xs: 130,
                  lg: 150,
                  fontSize: { xs: 10, lg: 14 },
                  backgroundColor: "black",
                  fontFamily: "montserrat",
                },
              }}
            >
              <Typography variant="caption">Join Us</Typography>
            </Button>
          </Stack>
        </Stack>
        <Box
          sx={{
            height: "100%",
            width: "100%",
            filter: "grayscale(70%) blur(0.5px)",
            zIndex: -1,
            position: "absolute",
          }}
        >
          {/* background image */}
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={bg}
          ></img>
        </Box>
        <Box
          sx={{
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", sm: "start" },
            justifyContent: "center",
            gap: 2,
            px: 0.5,
            pr: 0.75,
          }}
        >
          <Typography
            variant={windowWidth < 650 ? "h4" : "h2"}
            sx={{
              color: "white",
              fontFamily: "montserrat",
              fontWeight: 500,
              [theme.breakpoints.down("sm")]: {
                textAlign: "center",
              },
            }}
          >
            <span
              style={{
                fontStyle: "italic",
                fontFamily: "montserrat",
                fontWeight: 300,
              }}
            >
              Nyamza
            </span>{" "}
            delivery near you
          </Typography>

          <SearchBar
            searchResults={results}
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            setLocation={setLocation}
          />
        </Box>
      </Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2, md: 2 }}
        sx={{
          width: "100%",
          height: { xs: "auto", md: "auto" },
          px: { xs: 1.5, md: 1.5 },
          alignItems: "center",
          justifyContent: "center",
          gap: { lg: 3 },
          py: 5,
        }}
      >
        {Cards.map((card, index) => (
          <AdCard
            image={card.image}
            main_text={card.mainText}
            sub_text={card.subText}
            key={index}
          />
        ))}
      </Stack>
      <Footer />
    </Box>
  );
};

interface SearchBarProps {
  searchResults: LocationResult[];
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setLocation: (result: LocationResult) => void;
}
const SearchBar = ({
  searchResults,
  query,
  setQuery,
  setLocation,
}: SearchBarProps) => {
  const theme = useTheme();
  return (
    // container
    <Stack
      direction={"column"}
      sx={{
        width: { xs: "100%", lg: "60%" },
        height: "auto",
        py: 2,
        px: { md: 2 },
        alignItems: { xs: "center", sm: "start" },
        [theme.breakpoints.down("sm")]: {
          justifyContent: "space-evenly",
        },
      }}
    >
      {/* search bar */}
      <Stack
        direction={"row"}
        sx={{
          width: { xs: "100%", lg: "100%" },
          height: "auto",
          py: 1.5,
          gap: { xs: 0, lg: 0.5 },
          [theme.breakpoints.down("sm")]: {
            justifyContent: "space-evenly",
          },
        }}
      >
        <Box
          component={"input"}
          sx={{
            width: { xs: "67.5%", lg: "60%" },
            height: { xs: 35, lg: 42.5 },
            p: 1.2,
            ":focus": {
              border: "none",
              outline: "none",
            },
            borderRadius: { xs: 1, md: 0 },
            border: "none",
            fontFamily: "open sans",
            position: "relative",
          }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Let us know where to deliver..."
        ></Box>
        {/* button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#222127",
            color: "white",
            fontFamily: "open sans",
            borderRadius: { xs: 1, md: 0 },
          }}
        >
          Search
        </Button>
      </Stack>

      {/* suggestions */}
      <Box
        sx={{
          height: "auto",
          width: { xs: "90%", md: "60%" },
          backgroundColor: "white",
          py: 1.25,
          px: 0.5,
          display: searchResults.length > 0 ? "block" : "none",
        }}
      >
        {searchResults.length > 0 &&
          searchResults.map((result, index) => (
            <SearchCard
              location={result}
              key={index}
              setLocation={setLocation}
            />
          ))}
      </Box>
    </Stack>
  );
};

interface SearchCardProps {
  location: LocationResult;
  setLocation: (res: LocationResult) => void;
}

const SearchCard = ({ location, setLocation }: SearchCardProps) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate("/restaurants");
  };
  return (
    <Box
      component={"div"}
      onClick={() => {
        setLocation(location);
        handleNav();
      }}
      sx={{
        width: "100%",
        height: { xs: 40 },
        borderBottom: "1.25px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        gap: 0.5,
        cursor: "pointer",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: { xs: 12, lg: 14, xl: 18 }, fontFamily: "montserrat" }}
      >
        {location.label}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.disabled",
          fontSize: { xs: 12, lg: 14 },
          fontFamily: "montserrat",
        }}
      >
        {location.countryCode}
      </Typography>
    </Box>
  );
};

interface CardProps {
  image: string;
  main_text: string;
  sub_text: string;
}
const AdCard = ({ image, main_text, sub_text }: CardProps) => {
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0, y: 20, visibility: 0 }}
      whileInView={{ opacity: 1, y: 0, visibility: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.6 }}
      sx={{
        width: { xs: 260, lg: 300 },
        height: { xs: 300, lg: 320 },
        alignItems: "start",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          backgroundColor: "gray",
          height: { xs: "65%" },
          width: { xs: "100%" },
        }}
      >
        <img
          src={image}
          style={{
            width: "100%",
            height: "100%",
            objectPosition: "center",
            objectFit: "cover",
          }}
          alt=""
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          py: 0.8,
          alignItems: "start",
          justifyContent: "space-between",
        }}
      >
        {/* main text */}
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, fontSize: { xs: 12, md: 14 } }}
        >
          {main_text}
        </Typography>
        {/* sub text */}
        <Typography variant="caption">{sub_text}</Typography>
      </Box>
    </Stack>
  );
};
export default LandingPage;
