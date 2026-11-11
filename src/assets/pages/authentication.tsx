import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../data/validator";
import { useUser } from "../context/userContext";

const MotionDiv = motion("div");

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    backgroundColor: "#FFFFFF",
    "& fieldset": { borderColor: "#E8DCD2" },
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": { borderWidth: 1.5 },
  },
  "& .MuiFormHelperText-root": { mx: 0 },
};

const expectations = [
  {
    icon: RestaurantMenuOutlinedIcon,
    title: "Explore local menus",
    description: "Find restaurants and dishes to match your mood.",
  },
  {
    icon: ShoppingBagOutlinedIcon,
    title: "Checkout with ease",
    description: "Put your picks together and place your order in a few steps.",
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: "Follow your order",
    description: "Keep up with your order after it’s placed.",
  },
];

const Authenticator = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isAuthenticated, authError } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/restaurants", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  const signupFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
      signup(values.name, values.email, values.password);
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2.5, sm: 3, md: 4 },
        backgroundColor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="header"
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          component="a"
          href="/"
          variant="h5"
          sx={{
            color: "text.primary",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            textDecoration: "none",
          }}
        >
          Nyamza<span style={{ color: "#FF6B35" }}>.</span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Good food, made closer.
        </Typography>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 440px" },
          alignItems: "center",
          gap: { xs: 4, md: 8 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: 560 }}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "primary.dark", letterSpacing: "0.12em" }}
            >
              A better way to find your next meal
            </Typography>
            <Typography
              component="h1"
              sx={{
                mt: 1,
                fontSize: { xs: "2.5rem", sm: "3.25rem", md: "3.75rem" },
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.055em",
                maxWidth: 520,
              }}
            >
              Good food is just around the corner.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 430, fontSize: "1rem" }}
            >
              Sign in to discover nearby restaurants and make your next meal
              happen.
            </Typography>
          </Box>

          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2.5, fontWeight: 700 }}>
              Here’s what you can look forward to
            </Typography>
            <Stack spacing={2.5}>
              {expectations.map(({ icon: Icon, title, description }) => (
                <Stack
                  key={title}
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 1.5,
                      backgroundColor: "#FFE9DB",
                      color: "primary.dark",
                    }}
                  >
                    <Icon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            justifySelf: { xs: "stretch", md: "end" },
            p: { xs: 2.5, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography component="h2" variant="h4" sx={{ fontWeight: 700 }}>
                {isLogin ? "Welcome back" : "Create your account"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75 }}
              >
                {isLogin
                  ? "Sign in to pick up where you left off."
                  : "A few details and you’re ready to explore."}
              </Typography>
            </Box>

            <Box
              role="tablist"
              aria-label="Choose sign-in or sign-up"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                p: 0.5,
                borderRadius: 1.5,
                backgroundColor: "background.default",
              }}
            >
              <Button
                role="tab"
                aria-selected={isLogin}
                onClick={() => setIsLogin(true)}
                sx={{
                  color: isLogin ? "text.primary" : "text.secondary",
                  backgroundColor: isLogin ? "#FFFFFF" : "transparent",
                  boxShadow: isLogin
                    ? "0 1px 3px rgba(31, 41, 55, 0.12)"
                    : "none",
                  "&:hover": {
                    backgroundColor: isLogin ? "#FFFFFF" : "action.hover",
                  },
                }}
              >
                Log in
              </Button>
              <Button
                role="tab"
                aria-selected={!isLogin}
                onClick={() => setIsLogin(false)}
                sx={{
                  color: !isLogin ? "text.primary" : "text.secondary",
                  backgroundColor: !isLogin ? "#FFFFFF" : "transparent",
                  boxShadow: !isLogin
                    ? "0 1px 3px rgba(31, 41, 55, 0.12)"
                    : "none",
                  "&:hover": {
                    backgroundColor: !isLogin ? "#FFFFFF" : "action.hover",
                  },
                }}
              >
                Sign up
              </Button>
            </Box>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <MotionDiv
                  key="login"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ width: "100%" }}
                >
                  <Box
                    component="form"
                    onSubmit={loginFormik.handleSubmit}
                    noValidate
                    sx={{ display: "grid", gap: 1.5 }}
                  >
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      autoComplete="email"
                      {...loginFormik.getFieldProps("email")}
                      error={Boolean(
                        loginFormik.touched.email && loginFormik.errors.email,
                      )}
                      helperText={
                        loginFormik.touched.email && loginFormik.errors.email
                          ? loginFormik.errors.email
                          : " "
                      }
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                      {...loginFormik.getFieldProps("password")}
                      error={Boolean(
                        loginFormik.touched.password &&
                        loginFormik.errors.password,
                      )}
                      helperText={
                        loginFormik.touched.password &&
                        loginFormik.errors.password
                          ? loginFormik.errors.password
                          : " "
                      }
                      sx={fieldSx}
                    />
                    {authError && <Alert severity="error">{authError}</Alert>}
                    <Button type="submit" variant="contained" size="large">
                      Log in
                    </Button>
                  </Box>
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="signup"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  style={{ width: "100%" }}
                >
                  <Box
                    component="form"
                    onSubmit={signupFormik.handleSubmit}
                    noValidate
                    sx={{ display: "grid", gap: 1.5 }}
                  >
                    <TextField
                      fullWidth
                      label="Name"
                      placeholder="What should we call you?"
                      type="text"
                      autoComplete="name"
                      {...signupFormik.getFieldProps("name")}
                      error={Boolean(
                        signupFormik.touched.name && signupFormik.errors.name,
                      )}
                      helperText={
                        signupFormik.touched.name && signupFormik.errors.name
                          ? signupFormik.errors.name
                          : " "
                      }
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      autoComplete="email"
                      {...signupFormik.getFieldProps("email")}
                      error={Boolean(
                        signupFormik.touched.email && signupFormik.errors.email,
                      )}
                      helperText={
                        signupFormik.touched.email && signupFormik.errors.email
                          ? signupFormik.errors.email
                          : " "
                      }
                      sx={fieldSx}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      {...signupFormik.getFieldProps("password")}
                      error={Boolean(
                        signupFormik.touched.password &&
                        signupFormik.errors.password,
                      )}
                      helperText={
                        signupFormik.touched.password &&
                        signupFormik.errors.password
                          ? signupFormik.errors.password
                          : " "
                      }
                      sx={fieldSx}
                    />
                    {authError && <Alert severity="error">{authError}</Alert>}
                    <Button type="submit" variant="contained" size="large">
                      Create account
                    </Button>
                  </Box>
                </MotionDiv>
              )}
            </AnimatePresence>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default Authenticator;
