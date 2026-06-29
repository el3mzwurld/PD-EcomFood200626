import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useLocation } from "../context/locationContext";
import { useUser } from "../context/userContext";
import { AccountCircleRounded } from "@mui/icons-material";
import { useRestaurant } from "../hooks/useRestaurants";
import type { Restaurant } from "../types/types";

const Restaurants = () => {
  const { location, locationError, clearLocation } = useLocation();
  const { user, isAuthenticated } = useUser();

  const theme = useTheme();

  const { restaurants } = useRestaurant();
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Box
        component={"header"}
        sx={{
          height: { xs: 42.5, md: 46 },
          px: 1.25,
          py: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
        }}
      >
        {/* nyamza */}
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

        <Box
          sx={{
            minWidth: { xs: "50%", md: "30%" },
            maxWidth: { xs: "55%", md: "45%" },
            height: "100%",
            borderRadius: 2,
            backgroundColor: "black",
            color: "white",
            fontFamily: "open sans",
            p: 0.8,
            fontSize: { xs: 12, lg: 13 },
            overflow: "hidden",
            textWrap: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {location ? location.label : "Set a delivery address..."}
        </Box>

        <Box
          sx={{
            width: "auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "montserrat",
              color: "text.disabled",
              fontWeight: 600,
            }}
          >
            {user && isAuthenticated ? (
              user.name
            ) : (
              <AccountCircleRounded sx={{ width: "30px", height: "30px" }} />
            )}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: "100vh", display: "flex", py: 1.5 }}>
        <Grid
          container
          spacing={{ xs: 1.5, md: 3 }}
          sx={{ px: { xs: 2, md: 1.25 }, width: "100%" }}
        >
          {restaurants.map((restaurant, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <RestaurantCard restaurant={restaurant} key={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
interface CardProps {
  restaurant: Restaurant;
}

const RestaurantCard = ({ restaurant }: CardProps) => {
  return (
    <Stack
      sx={{
        width: { xs: "100%" },
        height: { xs: 230, md: 280 },
        alignItems: "start",
        cursor: "pointer",
        fontFamily: "open sans",
      }}
    >
      {/* image -placeholder */}
      <Box sx={{ width: "100%", height: "70%", backgroundColor: "gray" }}></Box>
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

export default Restaurants;
