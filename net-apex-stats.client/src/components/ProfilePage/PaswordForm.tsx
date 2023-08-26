import { Grid, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import { Formik, Form } from "formik";

import axios from "axios";

import { User } from "../../types";

import { apiBaseUrl } from "../../constants";
import { useState } from "react";

interface Props {
  user: User;
  token: string | null;
}

interface INewPasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordForm = ({ user, token }: Props) => {
  const [displayFormSuccess, setDisplayFormSuccess] = useState(false);
  const [displayFormFailure, setDisplayFormFailure] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  
  const updatePassword = async (values: INewPasswordForm, resetForm: Function) => {
    try {
      const { data } = await axios.put(`${apiBaseUrl}/User/${user.id}`, values, {
        headers: { Authorization: `bearer ${token}` },
      });
      if (data) {
        setFormStatus("Password changed successfully");
        setDisplayFormSuccess(true);
        resetForm({});
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setFormStatus(String(e?.response?.data) || "Unrecognized axios error");
        setDisplayFormFailure(true);
      } else {
        console.error("Unknown error", e);
        setFormStatus("Unknown error");
        setDisplayFormFailure(true);
      }
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setDisplayFormSuccess(false);
    setDisplayFormFailure(false);
  };

  return (
    <div>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        onSubmit={(values: INewPasswordForm, actions) => {
          updatePassword(values, actions.resetForm);
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 500);
        }}
      >
        {({ values, handleChange, handleBlur, touched, errors, isSubmitting }) => {
          return (
            <Form className="form ui">
              <div style={{ marginBottom: "1em", marginTop: "1rem" }}>
                <TextField
                  fullWidth
                  label={"Current Password"}
                  placeholder={"Current Password"}
                  name="currentPassword"
                  type="password"
                  value={values.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ marginBottom: "1em" }}>
                <TextField
                  fullWidth
                  label={"New Password"}
                  placeholder={"New Password"}
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div style={{ marginBottom: "1em" }}>
                <TextField
                  fullWidth
                  label={"Confirm Password"}
                  placeholder={"Confirm Password"}
                  name="confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <Grid>
                <Grid item>
                  <Button
                    style={{
                      float: "right",
                    }}
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    Update Password
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={displayFormSuccess} autoHideDuration={5000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Password changed successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={displayFormFailure} autoHideDuration={5000} onClose={handleClose}>
        <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {formStatus}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PasswordForm;
