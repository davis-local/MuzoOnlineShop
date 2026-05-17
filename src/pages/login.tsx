import { useState } from "react";
import type { SyntheticEvent } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import { Eye, EyeSlash } from "iconsax-reactjs";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e: SyntheticEvent) => e.preventDefault();

  return (
    <main className="login-page-shell">
      <div className="login-card">
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              className="brand-logo"
              component="h1"
              sx={{ fontSize: { xs: "2.5rem", sm: "3.5rem" }, fontWeight: 900 }}
            >
              <span className="brand-muzi">Muzi</span>
              <span className="brand-online">Online</span>
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Stack sx={{ alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#2A9561",
                  opacity: 0.6,
                  textAlign: "center",
                  fontWeight: 400,
                }}
              >
                Welcome to MuziOnline dashboard.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Formik
              initialValues={{
                email: "davis@test.com",
                password: "davis@test",
                submit: null,
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Must be a valid email")
                  .max(255)
                  .required("Email is required"),
                password: Yup.string()
                  .required("Password is required")
                  .test(
                    "no-whitespace",
                    "Password can not start or end with spaces",
                    (value) => value === value?.trim(),
                  )
                  .max(10, "Password must be less than 10 characters"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting },
              ) => {
                try {
                  console.log("Login attempt:", values.email);
                  setStatus({ success: true });
                  setSubmitting(false);
                } catch (err: any) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 1,
                          textAlign: "left",
                          mb: 1,
                        }}
                      >
                        Login to manage your product backlog and more.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack sx={{ gap: 1, textAlign: "left" }}>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <OutlinedInput
                          id="email"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error>{errors.email}</FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack sx={{ gap: 1, textAlign: "left" }}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          fullWidth
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={values.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                color="secondary"
                              >
                                {showPassword ? <Eye /> : <EyeSlash />}
                              </IconButton>
                            </InputAdornment>
                          }
                          placeholder="Enter password"
                          error={Boolean(touched.password && errors.password)}
                        />
                        {touched.password && errors.password && (
                          <FormHelperText error>
                            {errors.password}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        sx={{
                          gap: 2,
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={(e) => setChecked(e.target.checked)}
                              name="checked"
                              color="primary"
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2">
                              Keep me signed in
                            </Typography>
                          }
                        />
                      </Stack>
                    </Grid>

                    {errors.submit && (
                      <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{
                          backgroundColor: "#ff7500",
                          "&:hover": { backgroundColor: "#e66b00" },
                        }}
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}
