import { Grid, Button } from "@mui/material";
import { Field, Formik, Form } from "formik";

import { TextField } from "./FormField";
import { Entry } from "../../types";

/*
 * use type Entry, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
export type EntryFormValues = Omit<Entry, "id" | "entries">;

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
        avgDamage: 0
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
      {({ isValid, dirty }) => {
        return (
          <Form className="form ui">
            <Field
              label="Season"
              placeholder="Season"
              name="season"
              component={TextField}
            />
            <Field
              label="Games Played"
              placeholder="games"
              name="games"
              component={TextField}
            />
            <Field
              label="Total wins in the season"
              placeholder="wins"
              name="wins"
              component={TextField}
            />
            <Field
              label="Total Kills in the season"
              placeholder="kills"
              name="kills"
              component={TextField}
            />
            <Field
              label="Kill/Death ratio in the season"
              placeholder="kdr"
              name="kdr"
              component={TextField}
            />
            <Field
              label="Average damage in the season"
              placeholder="damage"
              name="avgDamage"
              component={TextField}
            />
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
