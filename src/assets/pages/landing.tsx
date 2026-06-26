import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import bg from "../img/cover actual.png";
import React, { useEffect, useState, type SetStateAction } from "react";

//icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import type { LocationResult } from "../types/types";
import { useSearch } from "../hooks/useSearch";
const LandingPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState("");

  const { isLoading, searchError, results } = useSearch(query);

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
          }}
        >
          {/*navigation :  nav should have logo and signup/login button */}
          <Typography
            variant="body2"
            sx={{
              fontFamily: "open sans",
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
          />
        </Box>
      </Box>
    </Box>
  );
};

interface SearchBarProps {
  searchResults: LocationResult[];
  query: string;
  setQuery: React.Dispatch<SetStateAction<string>>;
  isLoading: boolean;
}
const SearchBar = ({
  searchResults,
  query,
  setQuery,
  isLoading,
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
          py: 2,
          gap: { xs: 0, lg: 1.5 },
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
            borderRadius: 1,
            border: "none",
            fontFamily: "montserrat",
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
          sx={{ backgroundColor: "#222127", color: "white" }}
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
            <SearchCard location={result} key={index} />
          ))}
      </Box>
    </Stack>
  );
};

interface CardProps {
  location: LocationResult;
}

const SearchCard = ({ location }: CardProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: 40 },
        borderBottom: "1.25px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.5,
        gap: 0.5,
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
export default LandingPage;
