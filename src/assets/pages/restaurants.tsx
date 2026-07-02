import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useLocation } from "../context/locationContext";
import { useUser } from "../context/userContext";
import { AccountCircleRounded } from "@mui/icons-material";
import { useRestaurant } from "../context/restaurantContext";
import type { Restaurant, UserLocation } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "./menu";
// images
import notfound from "../img/undraw_no-data_ig65.svg";
import loader from "../img/loader.svg";

const Restaurants = () => {
  const { location, locationError, clearLocation } = useLocation();
  const { user, isAuthenticated } = useUser();

  const theme = useTheme();

  const { restaurants, isLoading } = useRestaurant();
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          py: 1.5,
          // alignItems: "center",
          // justifyContent: "center",
        }}
      >
        {restaurants.length > 0 && location ? (
          <ResGrid restaurants={restaurants} location={location} />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "montserrat",
              opacity: 0.8,
            }}
          >
            <NotFound />
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

interface GridProps {
  restaurants: Restaurant[];
  location: UserLocation;
}

const ResGrid = ({ restaurants, location }: GridProps) => {
  return (
    <Grid
      container
      spacing={{ xs: 1.5, md: 3 }}
      sx={{ px: { xs: 2, md: 4 }, width: "100%" }}
    >
      {restaurants.map((restaurant, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <RestaurantCard restaurant={restaurant} location={location} />
        </Grid>
      ))}
    </Grid>
  );
};

interface CardProps {
  restaurant: Restaurant;
  location: UserLocation;
}

const RestaurantCard = ({ restaurant, location }: CardProps) => {
  const navigate = useNavigate();
  const handleNav = () => {
    navigate(`/restaurant/${restaurant.id}`, {
      state: {
        cuisine: restaurant.cuisine,
        countryCode: location.countryCode,
        restaurant: restaurant,
      },
    });
  };

  return (
    <Stack
      sx={{
        width: { xs: "100%" },
        height: { xs: 230, md: 280 },
        alignItems: "start",
        cursor: "pointer",
        fontFamily: "open sans",
        ":hover": {
          textDecoration: "underline",
        },
      }}
      onClick={handleNav}
    >
      {/* image -placeholder */}
      <Box
        sx={{
          width: "100%",
          height: "70%",
          backgroundColor: restaurant.photoURL ? "none" : "gray",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: "secondary.dark",
          overflow: "hidden",
        }}
      >
        {restaurant.photoURL && (
          <img
            src={restaurant.photoURL}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          ></img>
        )}
      </Box>
      {/* restaurant info */}
      <Stack
        sx={{
          width: "100%",
          alignItems: "start",
          pl: { xs: 1.25 },
          pt: { xs: 0.5 },
        }}
      >
        {/* address */}
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {restaurant.address}
        </Typography>
        {/* delivery time */}
        <Typography variant="caption" sx={{ fontWeight: 550 }}>
          {restaurant.deliveryTimeMins.toFixed(0)} -{" "}
          {(restaurant.deliveryTimeMins + 5).toFixed(0)} mins
        </Typography>
      </Stack>
    </Stack>
  );
};

const NotFound = () => {
  const theme = useTheme();
  return (
    <Stack spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
      <Box
        sx={{
          width: { xs: 125, md: 150 },
          height: { xs: 140, md: 150 },
        }}
      >
        <img
          src={notfound}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
          }}
          alt=""
        />
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "montserrat",
          [theme.breakpoints.down("sm")]: {
            fontSize: 12,
          },
          fontWeight: 500,
        }}
      >
        Sorry, we're not available in your area.
      </Typography>
    </Stack>
  );
};
export default Restaurants;
