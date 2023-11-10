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
  IconButton,
  useTheme,
  TableFooter,
  TablePagination,
} from "@mui/material";
import { Refresh, Delete } from '@mui/icons-material';

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";
import { Entry } from "../../types";
import { apiBaseUrl } from "../../constants";
import { TableBody } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setEntries } from "../../state";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const StatListPage = () => {
  const dispatch = useDispatch();
  const entries = useSelector<RootState, Entry[]>((state) => state.entries);
  const token = useSelector<RootState, string | null>((state) => state.token);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - entries.length) : 0;

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refreshEntries = async () => {
    const { data: entryListFromApi } = await axios.get<Entry[]>(`${apiBaseUrl}/BattleRoyale`, {
      headers: { Authorization: `bearer ${token}` },
    });
    dispatch(setEntries({ entries: entryListFromApi }));
  }

  return (
    <div className="App">
      <Paper sx={{ margin: "1rem", width: "98%" }} elevation={6}>
        <Typography sx={{ paddingTop: "1rem" }} align="center" variant="h6">
          Entry list
        </Typography>
        <Table sx={{ maxWidth: "98%", margin: "1em" }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Season</strong>
              </TableCell>
              <TableCell>
                <strong>Games Played</strong>
              </TableCell>
              <TableCell>
                <strong>Wins</strong>
              </TableCell>
              <TableCell>
                <strong>Kills</strong>
              </TableCell>
              <TableCell>
                <strong>Deaths</strong>
              </TableCell>
              <TableCell>
                <strong>Total Damage</strong>
              </TableCell>
              <TableCell>
                <strong>Highest Damage</strong>
              </TableCell>
              <TableCell>
                <Button startIcon={<Refresh />} onClick={() => refreshEntries()}></Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? Object.values(entries).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : Object.values(entries)
            ).map((entry: Entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.season}</TableCell>
                <TableCell>{entry.games}</TableCell>
                <TableCell>{entry.wins}</TableCell>
                <TableCell>{entry.kills}</TableCell>
                <TableCell>{entry.deaths}</TableCell>
                <TableCell>{entry.damage}</TableCell>
                <TableCell>{entry.highestDamage}</TableCell>
                <TableCell>
                  <Button startIcon={<Delete />} variant="contained" color="error" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={entries.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
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
    </div>
  );
};

export default StatListPage;
