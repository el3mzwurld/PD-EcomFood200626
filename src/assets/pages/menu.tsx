import {
  useParams,
  useLocation as RouterLocation,
  useNavigate,
} from "react-router-dom";
import type {
  CartItem,
  Cuisine,
  Currency,
  Meal,
  Restaurant,
  SupportedCountry,
} from "../types/types";
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation } from "../context/locationContext";
import { useUser } from "../context/userContext";
import { AccountCircleRounded, Opacity } from "@mui/icons-material";

import { useMenu } from "../hooks/useMenu";
import { useRestaurant } from "../hooks/useRestaurants";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../context/cartContext";

const Menu = () => {
  const [menuSection, setMenuSection] = useState<
    "starter" | "mains" | "drinks"
  >("starter");

  const handleMenuSectionChange = (page: "starter" | "mains" | "drinks") => {
    if (page === menuSection) {
      return;
    }
    setMenuSection(page);
  };
  //catch all the data we're passing from the restaurants page
  const { id } = useParams();
  const restaurantID = id as string;
  const loc = RouterLocation();
  const navigate = useNavigate();

  const data = loc.state;
  const cuisine = data.cuisine as Cuisine;
  const countryCode = data.countryCode as SupportedCountry;
  const restaurant = data.restaurant as Restaurant;
  const { menu, isLoading, error } = useMenu(
    restaurantID,
    cuisine,
    countryCode,
  );

  const { location } = useLocation();
  const { user, isAuthenticated } = useUser();

  // filter the menu to starters, mains and drinks
  const starters = menu.filter((item) => {
    const category = item.category?.toLowerCase?.();
    return category === "starter" || category === "starters";
  });

  const mains = menu.filter(
    (item) => item.category?.toLowerCase?.() === "mains",
  );
  const drinks = menu.filter((item) => {
    const category = item.category?.toLowerCase?.();
    return category === "drink" || category === "drinks";
  });

  return (
    <div className="b" style={{ width: "100%", minHeight: "100vh" }}>
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
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          alignItems: { xs: "center", lg: "start" },
          justifyContent: "space-between",
          width: "100%",
          minHeight: "100vh",
          py: 1.5,
          px: { xs: 1.5, lg: 2 },
        }}
      >
        {/* menu */}
        <Stack
          spacing={{ xs: 1.2, md: 2 }}
          sx={{
            width: { xs: "100%", md: "68%", xl: "70%" },
            height: { xs: "auto" },
            flexShrink: 0,
            padding: { xs: 1 },
            alignItems: { xs: "start" },
            // overflowY: { xs: "hidden", md: "auto" },
          }}
        >
          {/* name */}
          <Typography
            variant="body1"
            sx={{
              marginY: { xs: 1 },
              fontFamily: "montserrat",
              fontWeight: 600,
            }}
          >
            {restaurant.name}
          </Typography>
          {/* banner */}
          <Box
            sx={{
              width: { xs: "100%" },
              height: { xs: 120, lg: 170 },
              backgroundColor: "grey",
            }}
          ></Box>

          {/* Menu */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="body1"
              sx={{
                marginY: { xs: 1 },
                fontFamily: "montserrat",
                fontWeight: 600,
              }}
            >
              Menu
            </Typography>

            <Stack
              direction={"row"}
              sx={{
                width: "100%",
                marginY: 2.5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                className={`${menuSection === "starter" ? "active" : ""}`}
                sx={{
                  borderRight: "1.5px solid black",
                  px: 1,
                  width: { xs: 70, md: 120 },
                  fontSize: { md: 14 },
                  textAlign: "center",
                  cursor: "pointer",
                  fontFamily: "montserrat",
                }}
                onClick={() => handleMenuSectionChange("starter")}
              >
                Starters
              </Typography>
              <Typography
                variant="caption"
                className={`${menuSection === "mains" ? "active" : ""}`}
                sx={{
                  borderRight: "1.5px solid black",
                  cursor: "pointer",
                  width: { xs: 70, md: 120 },
                  fontSize: { md: 14 },
                  textAlign: "center",
                  fontFamily: "montserrat",
                }}
                onClick={() => handleMenuSectionChange("mains")}
              >
                Mains
              </Typography>
              <Typography
                variant="caption"
                className={`${menuSection === "drinks" ? "active" : ""}`}
                sx={{
                  width: { xs: 70, md: 120 },
                  fontSize: { md: 14 },
                  textAlign: "center",
                  cursor: "pointer",
                  fontFamily: "montserrat",
                }}
                onClick={() => handleMenuSectionChange("drinks")}
              >
                Drinks
              </Typography>
            </Stack>

            <Stack>
              {menuSection === "starter" && (
                <MenuGrid restaurant={restaurant} menu={starters} />
              )}
              {menuSection === "mains" && (
                <MenuGrid restaurant={restaurant} menu={mains} />
              )}
              {menuSection === "drinks" && (
                <MenuGrid restaurant={restaurant} menu={drinks} />
              )}
            </Stack>
          </Box>
        </Stack>

        {/* checkout */}
        <OrderModal />
      </Stack>
    </div>
  );
};

interface MealGridProps {
  menu: Meal[];
  restaurant: Restaurant;
}

const MenuGrid = ({ menu, restaurant }: MealGridProps) => {
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={2}
      rowSpacing={{ md: 5 }}
      sx={{
        px: { xs: 2, md: 1.25 },
        width: "100%",
        py: { md: 1.5 },
      }}
    >
      {menu.map((m, index) => (
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
          }}
          sx={{
            [theme.breakpoints.down("md")]: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
          key={index}
        >
          <MealCard restaurant={restaurant} meal={m} />
        </Grid>
      ))}
    </Grid>
  );
};

interface MealCardProps {
  meal: Meal;
  restaurant: Restaurant;
}

const MealCard = ({ meal, restaurant }: MealCardProps) => {
  const { location } = useLocation();
  const country = location && (location.countryCode as SupportedCountry);
  const [currency, setCurrency] = useState<Currency>(() => {
    if (country === "NG") {
      return "NGN";
    } else if (country === "GH") {
      return "GHS";
    }
    return "KES";
  });
  const [quantity, setQuantity] = useState(0);
  // helper to normalize meal objects into cart items
  const normalizeMealtoCartItem = (meal: Meal, q?: number): CartItem => {
    return {
      menuItemID: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: q ? q : quantity,
    };
  };
  // cart context
  const { addItem, cart, clearCart, updateQty } = useCart();
  // increment
  const handleInc = () => {
    setQuantity((prev) => prev + 1);
    addItem(restaurant.id, restaurant.name, normalizeMealtoCartItem(meal, 1));
  };
  //decrement
  const handleDec = () => {
    if (quantity === 0) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    updateQty(meal.id, newQty);
  };
  return (
    <Stack
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeIn" }}
      sx={{
        width: { xs: "75%", md: "100%" },
        height: { xs: 255, md: 260 },
        // backgroundColor: "gray",
        borderRadius: 1.5,
      }}
    >
      {/* images */}
      <Box
        sx={{
          width: "100%",
          minHeight: "60%",
          maxHeight: "70%",
          backgroundColor: "gray",
        }}
      ></Box>
      {/* details */}
      <Stack
        sx={{
          width: "100%",
          alignItems: "start",
          pl: { xs: 1.25 },
          pt: { xs: 0.5 },
        }}
      >
        {/* name */}
        <Typography
          variant="caption"
          sx={{ fontWeight: 550, fontFamily: "open sans" }}
        >
          {meal.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 550,
            fontStyle: "italic",
            color: "text.disabled",
            fontFamily: "open sans",
          }}
        >
          {currency}
          {meal.price}
        </Typography>
      </Stack>
      {/* button group */}
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          height: "auto",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginY: 1,
        }}
      >
        <Button
          sx={{
            width: { xs: 20 },
            color: "white",
            fontSize: { xs: 14 },
            height: { xs: 30 },
            backgroundColor: quantity > 0 ? "black" : "text.disabled",
            cursor: quantity > 0 ? "pointer" : "not-allowed",
          }}
          onClick={handleDec}
        >
          -
        </Button>
        <Typography variant="body2" sx={{ color: "text.disabled" }}>
          {quantity}
        </Typography>
        <Button
          sx={{
            width: { xs: 30 },
            color: "white",
            fontSize: { xs: 14 },
            height: { xs: 30 },
            backgroundColor: "black",
          }}
          onClick={handleInc}
        >
          +
        </Button>
      </Stack>
    </Stack>
  );
};

const OrderModal = () => {
  const { cart } = useCart();
  return (
    <Stack
      sx={{
        width: { xs: "92.5%", md: "28%", xl: "24.5%" },
        minHeight: { xs: 350, lg: 400 },
        boxShadow: "0 6px 14px rgba(0, 0, 0, 0.08)",
        p: { xs: 1.25, md: 1.5 },
      }}
    >
      {/* title */}
      <Box sx={{ width: "100%", height: "auto", py: 1.2, pl: 0.8 }}>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "montserrat",
            fontSize: { md: 20 },
            fontWeight: 600,
          }}
        >
          Order
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 600,
            color: "text.disabled",
          }}
        >
          {cart.items.length} products
        </Typography>
      </Box>
      {/* cart */}
      <Stack
        //cart container
        spacing={{ xs: 1.5, md: 2 }}
        sx={{
          flex: 1,
          width: "100%",
          height: "auto",
          maxHeight: "450",
          // backgroundColor: "gray",
        }}
      >
        {cart.items.map((m) => (
          <Stack
            //cart item
            direction={"row"}
            sx={{
              width: "100%",
              height: { xs: 60 },
              backgroundColor: "wheat",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                height: "auto",
                width: "auto",
              }}
            ></Box>
            <Typography
              variant="caption"
              sx={{ fontFamily: "open sans", fontWeight: 500 }}
            >
              {m.name}
            </Typography>

            {/* button group */}
            <Stack
              direction={"row"}
              sx={{
                width: "30%",
                height: "auto",
                justifyContent: "space-evenly",
                alignItems: "center",
                marginY: 1,
              }}
            >
              <Box
                sx={{
                  width: { xs: 20 },
                  color: "white",
                  fontSize: { xs: 14 },
                  height: { xs: 20 },
                  backgroundColor: "black",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12.25,
                }}
              >
                -
              </Box>
              <Typography variant="body2" sx={{ color: "text.disabled" }}>
                {m.quantity}
              </Typography>
              <Box
                sx={{
                  width: { xs: 20 },
                  color: "white",
                  fontSize: { xs: 14 },
                  height: { xs: 20 },
                  backgroundColor: "black",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12.25,
                }}
              >
                +
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Menu;
