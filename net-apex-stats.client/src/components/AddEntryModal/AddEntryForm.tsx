import { Grid, Button, TextField, Typography } from "@mui/material";
import { Formik, Form, ErrorMessage } from "formik";

import { Entry } from "../../types";

export type EntryFormValues = Omit<Entry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  return (
    <Formik
      initialValues={{
        season: "",
        games: 0,
        wins: 0,
        kills: 0,
        kdr: 0,
        avgDamage: 0,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.season) {
          errors.season = requiredError;
        }
        if (!values.games) {
          errors.games = requiredError;
        }
        if (!values.wins) {
          errors.wins = requiredError;
        }
        if (!values.kills) {
          errors.kills = requiredError;
        }
        if (!values.kdr) {
          errors.kdr = requiredError;
        }
        if (!values.avgDamage) {
          errors.avgDamage = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, values, handleChange }) => {
        return (
          <Form className="form ui">
            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Season"}
                placeholder={"Season"}
                name="season"
                type="text"
                value={values.season}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"season"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Games Played"}
                placeholder={"Games Played"}
                name="games"
                type="number"
                value={values.games}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"games"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Wins"}
                placeholder={"Wins"}
                name="wins"
                type="number"
                value={values.wins}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"wins"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Kills"}
                placeholder={"Kills"}
                name="kills"
                type="number"
                value={values.kills}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"kills"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Kill/Death ratio"}
                placeholder={"Kill/Death ratio"}
                name="kdr"
                type="number"
                value={values.kdr}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"kdr"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Average Damage in the season"}
                placeholder={"Average Damage in the season"}
                name="avgDamage"
                type="number"
                value={values.avgDamage}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"avgDamage"} />
              </Typography>
            </div>

            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
