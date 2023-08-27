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
        deaths: 0,
        damage: 0,
        highestDamage: 0
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
        if (!values.deaths) {
          errors.deaths = requiredError;
        }
        if (!values.damage) {
          errors.damage = requiredError;
        }
        return errors;
        if (!values.highestDamage) {
          errors.highestDamage = requiredError;
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
                label={"Total deaths in season"}
                placeholder={"Total deaths in season"}
                name="deaths"
                type="number"
                value={values.deaths}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"deaths"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Total Damage in the season"}
                placeholder={"Total Damage in the season"}
                name="damage"
                type="number"
                value={values.damage}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"damage"} />
              </Typography>
            </div>

            <div style={{ marginBottom: "1em" }}>
              <TextField
                fullWidth
                label={"Highest Damage in a game in the season"}
                placeholder={"Highest Damage in a game in the season"}
                name="highestDamage"
                type="number"
                value={values.highestDamage}
                onChange={handleChange}
              />
              <Typography variant="subtitle2" style={{ color: "red" }}>
                <ErrorMessage name={"highestDamage"} />
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
