import React from "react";
import axios from "axios";
import {
  Box,
  Table,
  Button,
  TableHead,
  Typography,
  TableCell,
  TableRow,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import { Entry } from "../../types";
import { apiBaseUrl } from "../../constants";
import { TableBody } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setEntries } from "../../state";

const StatListPage = () => {
  const dispatch = useDispatch();
  const entries = useSelector<RootState, Entry[]>((state) => state.entries);
  const token = useSelector<RootState, string | null>((state) => state.token);

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const [deletionSuccess, setDeletionSuccess] = React.useState(false);
  const [deletionError, setDeletionError] = React.useState(false);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data } = await axios.post<Entry>(`${apiBaseUrl}/BattleRoyale`, values, {
        headers: { Authorization: `bearer ${token}` },
      });
      dispatch(setEntries({ entries: entries.concat(data) }));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(String(e?.response?.data?.error) || "Unrecognized axios error");
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete<Entry>(`${apiBaseUrl}/Battleroyale/${id}`, {
          headers: { Authorization: `bearer ${token}` },
        });
        const newEntries = entries.filter((entry) => entry.id !== id);
        dispatch(setEntries({ entries: newEntries }));
        setDeletionSuccess(true);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(String(e?.response?.data) || "Unrecognized axios error");
          setDeletionError(true);
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
          setDeletionError(true);
        }
      }
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setDeletionSuccess(false);
    setDeletionError(false);
  };

  return (
    <div className="App">
      <Box>
        <Paper sx={{ margin: "1rem" }} elevation={6}>
          <Typography sx={{ paddingTop: "1rem" }} align="center" variant="h6">
            Entry list
          </Typography>
          <Table sx={{ maxWidth: "110rem", margin: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Season</strong></TableCell>
                <TableCell><strong>Games Played</strong></TableCell>
                <TableCell><strong>Wins</strong></TableCell>
                <TableCell><strong>Kills</strong></TableCell>
                <TableCell><strong>Deaths</strong></TableCell>
                <TableCell><strong>Total Damage</strong></TableCell>
                <TableCell><strong>Highest Damage</strong></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(entries).map((entry: Entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.season}</TableCell>
                  <TableCell>{entry.games}</TableCell>
                  <TableCell>{entry.wins}</TableCell>
                  <TableCell>{entry.kills}</TableCell>
                  <TableCell>{entry.deaths}</TableCell>
                  <TableCell>{entry.damage}</TableCell>
                  <TableCell>{entry.highestDamage}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <AddEntryModal
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
          />
          <Button sx={{ margin: "1rem" }} variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
          <Snackbar open={deletionSuccess} autoHideDuration={5000} onClose={handleClose}>
            <Alert variant="filled" onClose={handleClose} severity="success" sx={{ width: "100%" }}>
              Entry deleted successfully!
            </Alert>
          </Snackbar>
          <Snackbar open={deletionError} autoHideDuration={5000} onClose={handleClose}>
            <Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          </Snackbar>
        </Paper>
      </Box>
    </div>
  );
};

export default StatListPage;
