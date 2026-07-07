import {
  useParams,
  useLocation as RouterLocation,
  useNavigate,
} from "react-router-dom";
import type {
  CartItem,
  Currency,
  Meal,
  Restaurant,
  SupportedCountry,
} from "../types/types";
import { Box, Button, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useLocation } from "../context/locationContext";
import { useUser } from "../context/userContext";
import {
  AccountCircleRounded,
  ArrowBack,
  Logout,
  ShoppingCartRounded,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMenu } from "../hooks/useMenu";
import { useRestaurant } from "../context/restaurantContext";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../context/cartContext";
import emptyCart from "../img/emptycart.svg";

import res1 from "../img/restaurants/jason-leung-poI7DelFiVA-unsplash.jpg";
import res2 from "../img/restaurants/jay-wennington-N_Y88TWmGwA-unsplash.jpg";
import res3 from "../img/restaurants/kayleigh-harrington-yhn4okt6ci0-unsplash.jpg";
import res4 from "../img/restaurants/nabeel-hussain-WhBcCMqFQhk-unsplash.jpg";
import res5 from "../img/restaurants/patrick-tomasso-GXXYkSwndP4-unsplash.jpg";
import { seededRandom } from "../supporters/randomizer";

const Menu = () => {
  const [menuSection, setMenuSection] = useState<
    "starter" | "mains" | "drinks"
  >("starter");
  const [restaurantBanner, setRestaurantBanner] = useState<string | null>(null);
  const handleMenuSectionChange = (page: "starter" | "mains" | "drinks") => {
    if (page === menuSection) {
      return;
    }
    setMenuSection(page);
  };
  //catch all the data we're passing from the restaurants page
  const { id } = useParams();
  const restaurantID = id as string;
  const navigate = useNavigate();
  const { location } = useLocation();
  const {
    getRestaurantById,
    isLoading: resLoading,
    restaurants,
  } = useRestaurant();
  console.log(restaurants);
  const restaurant = getRestaurantById(restaurantID);

  const cuisine = restaurant?.cuisine;
  const countryCode = location?.countryCode;
  const { menu } = useMenu(restaurantID, cuisine, countryCode);

  useEffect(() => {
    if (resLoading || restaurants.length === 0) return;

    if (!restaurant) {
      navigate("/restaurants", { replace: true });
    }
  }, [restaurant, resLoading, navigate]);

  const { cart, clearCart } = useCart();
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
  const random = seededRandom(restaurantID);

  // image array for the restaurant banner
  const imgArray = [res1, res2, res3, res4, res5];
  //user should only be able to order from one restaurant at a time, hence, if a user leaves a restaurant and enters a new one? the cart should clear upon mount
  useEffect(() => {
    if (cart.restaurantID !== restaurantID) {
      clearCart();
    }
    const randomIndex = Math.floor(random() * imgArray.length);
    setRestaurantBanner(imgArray[randomIndex]);
  }, []);

  if (!restaurant) {
    return null;
  }

  return (
    <div className="b" style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
          alignItems: "center",
          gap: "3px",
          px: 2,
        }}
      >
        <ArrowBack sx={{ width: "10px" }} />
        <Typography
          variant="caption"
          sx={{
            textWrap: "nowrap",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 600,
            fontSize: 10,
            color: "primary.dark",
          }}
          onClick={() => navigate(-1)}
        >
          Go back to <span>restaurants</span>
        </Typography>
      </Stack>
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
              background: restaurantBanner && "none",
              backgroundColor: restaurantBanner ? "none" : "gray",
              overflow: "hidden",
              filter: "blur(0.7px)",
            }}
          >
            {restaurantBanner && (
              <img
                src={restaurantBanner}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  width: "100%",
                  height: "100%",
                }}
              ></img>
            )}
          </Box>

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
        <OrderModal restaurant={restaurant} />
      </Stack>

      <Footer />
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
  const currency = (): Currency => {
    if (country === "NG") {
      return "NGN";
    } else if (country === "GH") {
      return "GHS";
    }
    return "KES";
  };
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
  const { addItem, cart, updateQty } = useCart();
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
        borderRadius: 1.5,
      }}
    >
      {/* images */}
      <Box
        sx={{
          width: "100%",
          minHeight: "60%",
          maxHeight: "70%",
          backgroundColor:
            meal.photoUrl || meal.photoUrl === undefined || null
              ? "none"
              : "gray",
        }}
      >
        {meal.photoUrl ? (
          <img
            src={meal.photoUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          ></img>
        ) : null}
      </Box>
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
          <span>{currency()} </span>
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
          {cart.items.find((item) => item.menuItemID === meal.id)?.quantity ??
            0}
        </Typography>
        <Button
          sx={{
            width: { xs: 30 },
            color: "white",
            fontSize: { xs: 14 },
            height: { xs: 30 },
            backgroundColor: "primary.dark",
          }}
          onClick={handleInc}
        >
          +
        </Button>
      </Stack>
    </Stack>
  );
};

const OrderModal = ({ restaurant }: { restaurant: Restaurant }) => {
  const { cart, clearCart, removeItem, addItem, updateQty, total } = useCart();
  const restaurantID = cart && (cart.restaurantID as string);
  const restaurantName = cart && (cart.restaurantName as string);
  const { location } = useLocation();
  const handleInc = (menuID: string) => {
    const item = cart.items.find((item) => item.menuItemID === menuID);

    if (item) {
      addItem(restaurantID, restaurantName, {
        menuItemID: item.menuItemID,
        name: item.name,
        price: item.price,
        quantity: item.quantity + 1,
      });
      return;
    }
  };
  const { user, isAuthenticated } = useUser();
  // handle decrement
  const handleDec = (menuID: string) => {
    const item = cart.items.find((item) => item.menuItemID === menuID);
    if (item) {
      updateQty(menuID, item.quantity - 1);
      return;
    }
  };
  const currency = (location: SupportedCountry): Currency => {
    if (location === "NG") {
      return "NGN";
    } else if (location === "GH") {
      return "GHS";
    }
    return "KES";
  };
  const navigate = useNavigate();

  const handleNav = (id: string) => {
    navigate(`/restaurant/checkout/${id}`);
  };

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
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            height: "auto",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
          }}
        >
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
          <DeleteIcon
            onClick={clearCart}
            sx={{ cursor: "pointer", color: "primary.dark" }}
          />
        </Stack>
        <Typography
          variant="caption"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 600,
            color: "text.disabled",
          }}
        >
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
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
          transition: "0.3s easeIn",
        }}
      >
        {cart.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeIn" }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={emptyCart}
              style={{
                width: "60%",
                height: "60%",
                objectPosition: "center",
                opacity: 0.7,
              }}
            ></img>
          </motion.div>
        ) : (
          <>
            {" "}
            {cart.items.map((m) => (
              <Stack
                //cart item
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeIn" }}
                direction={"row"}
                sx={{
                  width: "100%",
                  height: { xs: 60 },
                  backgroundColor: "secondary.dark",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  position: "relative",
                  borderRadius: 0.4,
                }}
              >
                <Box
                  component={"div"}
                  onClick={() => removeItem(m.menuItemID)}
                  sx={{
                    position: "absolute",
                    top: 2.5,
                    right: 10,
                    height: "auto",
                    width: "auto",
                    cursor: "pointer",
                  }}
                >
                  <DeleteIcon sx={{ width: 10, height: 10 }} />
                </Box>
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
                    onClick={() => handleDec(m.menuItemID)}
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
                    onClick={() => handleInc(m.menuItemID)}
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
            ))}{" "}
          </>
        )}
      </Stack>
      {/* button */}
      <Button
        sx={{
          width: "100%",
          backgroundColor: cart.items.length !== 0 ? "black" : "text.disabled",
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => handleNav(restaurant.id)}
        disabled={Boolean(cart.items.length === 0)}
      >
        Proceed to checkout (
        {currency(location?.countryCode as SupportedCountry)} {total})
      </Button>
    </Stack>
  );
};

interface NavbarProps {
  handleOpen?: () => void;
}
export const Navbar = ({ handleOpen }: NavbarProps) => {
  const { location } = useLocation();
  const { cart } = useCart();
  const { user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };
  return (
    <Box
      component={"header"}
      sx={{
        height: { xs: 42.5, md: 46 },
        px: { xs: 1.5, md: 8 },
        py: { xs: 0.8 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "transparent",
        backgroundColor: "white",
      }}
    >
      {/* nyamza */}
      <Stack
        direction={"row"}
        spacing={{ xs: 1.5, md: 3 }}
        sx={{ width: "auto", height: "100%", alignItems: "center" }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "montserrat",
            fontWeight: 600,
            fontSize: { xs: 13, lg: 16 },
            color: "primary.dark",
          }}
        >
          Nyamza.
        </Typography>

        <Box
          sx={{
            width: { xs: 110, md: 300 },
            height: "100%",
            backgroundColor: "background.paper",
            fontFamily: "open sans",
            color: "primary.dark",
            p: 0.8,
            fontSize: { xs: 8 },
            overflow: "hidden",
            textWrap: "nowrap",
            textOverflow: "ellipsis",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => {
            if (!handleOpen) {
              return;
            }
            handleOpen();
          }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: { xs: 8 } }}>
            Delivery to:
          </Typography>
          {location ? location.label : "Set a delivery address..."}
        </Box>
      </Stack>
      {/* search */}

      {/* cart and user info */}
      <Box
        sx={{
          width: "auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          justifyContent: "center",
        }}
        onClick={() => {
          if (cart.items.length === 0) return;

          const restaurantID = cart.restaurantID;
          navigate(`/restaurant/${restaurantID}`);
        }}
      >
        <Stack
          className="cart--container"
          direction={"row"}
          sx={{
            width: 60,
            height: "100%",
            backgroundColor: "primary.main",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 1.8,

            ":hover": {
              backgroundColor: "primary.light",
            },
          }}
        >
          <ShoppingCartRounded sx={{ width: 20 }}></ShoppingCartRounded>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: "montserrat",
              color: "black",
              fontSize: { xs: 10 },
            }}
          >
            {cart.items.length}
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "montserrat",
            color: "text.disabled",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            fontSize: { xs: 10 },
          }}
        >
          {user && isAuthenticated ? (
            <>
              {user.name}{" "}
              <Logout
                onClick={handleLogout}
                sx={{
                  width: { xs: 13, md: 20 },
                  color: "primary.dark",
                  cursor: "pointer",
                }}
              />
            </>
          ) : (
            <AccountCircleRounded
              sx={{
                width: "30px",
                height: "30px",
                color: "secondary.main",
                cursor: "pointer",
              }}
              onClick={() => {
                {
                  const sendtoAuth = setTimeout(() => {
                    navigate("/auth");
                  }, 300);
                }
              }}
            />
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 3 },
        borderTop: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1.5, md: 0 }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "montserrat",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Nyamza
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "montserrat",
              color: "text.secondary",
              mt: 0.5,
            }}
          >
            Discover local favorites, order fast, and enjoy great meals.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            flexWrap: "wrap",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          {[
            { label: "About", href: "#" },
            { label: "Support", href: "#" },
            { label: "Privacy", href: "#" },
          ].map((item) => (
            <Typography
              key={item.label}
              component="a"
              href={item.href}
              variant="body2"
              sx={{
                fontFamily: "montserrat",
                color: "text.secondary",
                textDecoration: "none",
                transition: "color 0.2s ease",
                "&:hover": { color: "primary.main" },
              }}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
      </Stack>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          fontFamily: "montserrat",
          color: "text.disabled",
        }}
      >
        © 2026 Nyamza. All rights reserved.
      </Typography>
    </Box>
  );
};
export default Menu;
