import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useLocation } from "../context/locationContext";
import { useUser } from "../context/userContext";
import { AccountCircleRounded } from "@mui/icons-material";
import { useRestaurant } from "../context/restaurantContext";
import type { Cuisine, Restaurant, UserLocation } from "../types/types";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "./menu";
import { motion } from "motion/react";

// images
import notfound from "../img/undraw_no-data_ig65.svg";
import curry from "../img/food/curry.jpg";
import burger from "../img/food/burger.jpg";
import pizza from "../img/food/pizza.jpg";
import fastfood from "../img/food/fastfood.jpg";
import chinese from "../img/food/chinese.jpg";
import local from "../img/food/local.jpg";
import cont from "../img/food/continenal.jpg";

import { string } from "yup";
import { useEffect, useState } from "react";
import { LocationModal } from "./checkout";

interface CuisineData {
  name: string;
  img: string;
}
const Restaurants = () => {
  const { location, locationError, clearLocation } = useLocation();
  const { user, isAuthenticated } = useUser();
  const { restaurants, isLoading, getRestaurantsByCuisine } = useRestaurant();
  const [filteredRestaurants, setFilreredRestaurants] = useState<Restaurant[]>(
    [],
  );

  useEffect(() => {
    if (!restaurants) return;

    if (isLoading) return;
    setFilreredRestaurants(restaurants);
  }, [restaurants]);
  //theme
  const theme = useTheme();

  const filterCats: Record<Cuisine, CuisineData> = {
    "Fast Food": { name: "Fast Food", img: fastfood },
    Nigerian: {
      name: location
        ? location.countryCode === "NG"
          ? "Local"
          : "Nigerian"
        : "Nigerian",
      img: local,
    },
    Kenyan: {
      name: location
        ? location.countryCode === "KE"
          ? "Local"
          : "Kenyan"
        : "Kenyan",
      img: local,
    },
    Ghanaian: {
      name: location
        ? location.countryCode === "GH"
          ? "Local"
          : "Ghanian"
        : "Ghanian",
      img: local,
    },
    Italian: { name: "Pizza", img: pizza },
    Chinese: { name: "Chinese", img: chinese },
    Indian: { name: "Indian", img: curry },
    American: { name: "Burger", img: burger },
    Continental: { name: "Oriental", img: cont },
  };

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Navbar handleOpen={handleOpen} />
      <Stack
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeIn" }}
        direction={"row"}
        sx={{
          height: { xs: 120, md: 85 },
          width: "100%",
          alignItems: "center",
          justifyContent: "space-evenly",
          py: { md: 1.5 },
          px: { md: 1.5 },
          position: "relative",
          [theme.breakpoints.down("md")]: {
            overflowX: "auto",
            gap: 1.5,
            px: 2,
          },
        }}
      >
        {/* filters */}
        {Object.entries(filterCats).map(([cuisine, data]) => {
          return (
            <Box
              sx={{
                width: { xs: 80, md: 70 },
                height: { xs: 80, md: 70 },
                borderRadius: 15,
                backgroundColor: "secondary.dark",
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flex: "0 0 auto",
              }}
              onClick={() => {
                const food = cuisine as Cuisine;
                setFilreredRestaurants(getRestaurantsByCuisine(food));
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -10,
                  p: { xs: 0.5, md: 0.2 },
                  px: { xs: 1, md: 1.2 },
                  border: "1px solid",
                  backgroundColor: "white",
                  borderColor: "primary.dark",
                  borderRadius: "100px",
                  fontSize: { xs: 10 },
                  cursor: "pointer",
                }}
              >
                {data.name}
              </Typography>

              <Box
                component={motion.img}
                sx={{ width: "60%", height: "60%", borderRadius: "100px" }}
                src={data.img}
              ></Box>
            </Box>
          );
        })}
        <Typography
          sx={{
            position: { md: "absolute" },
            top: 5,
            right: 5,
            height: { xs: 25, md: 20 },
            width: { xs: 25, md: 20 },
            [theme.breakpoints.down("md")]: {
              flexShrink: 0,
            },
            border: "1px solid",
            backgroundColor: "white",
            borderColor: "primary.dark",
            borderRadius: "100px",
            fontSize: { xs: 10 },
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          //clear filters
          onClick={() => {
            setFilreredRestaurants(restaurants);
          }}
        >
          x
        </Typography>
      </Stack>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          py: 1.5,
          px: { md: 7 },
          justifyContent: "center",
        }}
      >
        {filteredRestaurants.length > 0 && location ? (
          <ResGrid restaurants={filteredRestaurants} location={location} />
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
            <NotFound
              fil_restaurants={filteredRestaurants}
              restaurants={restaurants}
            />
          </Box>
        )}
      </Box>
      <LocationModal handleClose={handleClose} open={open} />
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
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.1, ease: "easeIn" }}
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
          height: "100%",
          backgroundColor: restaurant.photoURL ? "none" : "gray",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderRight: "1px solid",
          borderColor: "secondary.dark",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {restaurant.photoURL && (
          <Box
            component={"img"}
            src={restaurant.photoURL}
            sx={{
              width: { xs: "70%", md: "80%" },
              height: { xs: "70%", md: "80%" },
              objectFit: "cover",
              objectPosition: "center",
            }}
          ></Box>
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

const NotFound = ({
  fil_restaurants,
  restaurants,
}: {
  fil_restaurants: Restaurant[];
  restaurants: Restaurant[];
}) => {
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
        {restaurants.length !== 0
          ? fil_restaurants.length === 0 &&
            "No restaurants found for this category."
          : "Sorry, we're not available in this area."}
      </Typography>
    </Stack>
  );
};
export default Restaurants;
