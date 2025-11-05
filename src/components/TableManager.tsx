"use client";
import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Stack,
  Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSearchQuery, toggleSort, setPage } from "@/store/slices/uiSlice";
import { addColumn, setVisibility, resetToDefaults } from "@/store/slices/columnsSlice";
import { RowRecord, importRows } from "@/store/slices/dataSlice";
import Papa from "papaparse";
import { saveAs } from "file-saver";

function useVisibleColumns() {
  const columns = useSelector((s: RootState) => s.columns.columns);
  return React.useMemo(() => columns.filter((c) => c.visible), [columns]);
}

export default function TableManager() {
  const dispatch = useDispatch();
  const { searchQuery, sortBy, sortOrder, page, rowsPerPage } = useSelector(
    (s: RootState) => s.ui
  );
  const allColumns = useSelector((s: RootState) => s.columns.columns);
  const visibleColumns = useVisibleColumns();
  const rows = useSelector((s: RootState) => s.data.rows);

  const [manageOpen, setManageOpen] = React.useState(false);
  const [newField, setNewField] = React.useState({ key: "", label: "" });
  const [isEditing, setIsEditing] = React.useState(false);
  const [edited, setEdited] = React.useState<Record<string, RowRecord>>({});
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) =>
        v !== null && typeof v !== "object" && String(v).toLowerCase().includes(q)
      )
    );
  }, [rows, searchQuery]);

  const sorted = React.useMemo(() => {
    if (!sortBy || !sortOrder) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[sortBy as keyof RowRecord];
      const vb = b[sortBy as keyof RowRecord];
      const sa = va === undefined || va === null ? "" : String(va).toLowerCase();
      const sb = vb === undefined || vb === null ? "" : String(vb).toLowerCase();
      if (sa < sb) return sortOrder === "asc" ? -1 : 1;
      if (sa > sb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortBy, sortOrder]);

  const paged = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  const normalizeKey = (k: string) => k.trim().toLowerCase().replace(/\s+/g, "_");
  const labelFromKey = (k: string) =>
    k.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  const ensureEditedRow = (row: RowRecord) => {
    setEdited((prev) => (prev[row.id] ? prev : { ...prev, [row.id]: { ...row } }));
  };

  const getCellError = (colKey: string, value: any): string | null => {
    if (colKey === "age" && value !== "" && isEditing) {
      const n = Number(value);
      if (!Number.isFinite(n)) return "Age must be a number";
      if (n < 0) return "Age must be >= 0";
    }
    return null;
  };

  const onImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res: Papa.ParseResult<Record<string, string>>) => {
        if (!Array.isArray(res.data)) return;
        const headerPairs = ((res.meta.fields || []) as string[])
          .filter(Boolean)
          .map((k) => ({ raw: k, norm: normalizeKey(k) }))
          .filter((h) => h.norm !== "id");

        headerPairs.forEach(({ norm }) => {
          if (!allColumns.some((c) => c.key === norm)) {
            dispatch(addColumn({ key: norm, label: labelFromKey(norm) }));
          }
        });

        try {
          const normalizedRows = (res.data as Array<Record<string, string>>).map((row) => {
            const out: Record<string, string> = {};
            Object.entries(row).forEach(([k, v]) => {
              const nk = normalizeKey(k);
              if (nk === "id") return;
              out[nk] = v ?? "";
            });
            return out;
          });
          dispatch(importRows({ rows: normalizedRows }));
        } catch {
          alert("Invalid CSV data rows.");
        }
      },
      error: () => {
        alert("Invalid CSV format.");
      },
    });
  };

  const exportCsv = () => {
    const headers = visibleColumns.map((c) => c.key);
    const data = rows.map((r) =>
      Object.fromEntries(headers.map((h) => [h, r[h] ?? ""]))
    );
    const csv = Papa.unparse({ fields: headers, data: data as any });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_export.csv");
  };

  return (
    <Box p={2}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
        <IconButton onClick={() => setManageOpen(true)} aria-label="manage-columns">
          <SettingsOutlinedIcon />
        </IconButton>
        <Button variant="outlined" startIcon={<UploadFileOutlinedIcon />} component="label">
          Import CSV
          <input
            hidden
            type="file"
            accept=".csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
            }}
          />
        </Button>
        <Button variant="contained" startIcon={<DownloadOutlinedIcon />} onClick={exportCsv}>
          Export CSV
        </Button>
      </Stack>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.key}
                    onClick={() => dispatch(toggleSort(col.key))}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    {col.label}
                    {sortBy === col.key ? (sortOrder === "asc" ? " ▲" : " ▼") : ""}
                  </TableCell>
                ))}
                <TableCell width={120}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((row) => {
                const draft = edited[row.id] || row;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onDoubleClick={() => {
                      setIsEditing(true);
                      ensureEditedRow(row);
                    }}
                    style={{ cursor: "default" }}
                  >
                    {visibleColumns.map((col) => {
                      const value = draft[col.key] ?? "";
                      const error = getCellError(col.key, value);
                      return (
                        <TableCell key={`${row.id}-${col.key}`}>
                          {isEditing ? (
                            <TextField
                              size="small"
                              value={value as any}
                              error={!!error}
                              helperText={error || ""}
                              onChange={(e) => {
                                ensureEditedRow(row);
                                const v = e.target.value;
                                setEdited((prev) => ({
                                  ...prev,
                                  [row.id]: { ...prev[row.id], [col.key]: v },
                                }));
                              }}
                            />
                          ) : (
                            <span>{value as any}</span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      {isEditing ? (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Save All">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  // Validate all edited rows
                                  const hasError = Object.values(edited).some((er) =>
                                    visibleColumns.some((c) => getCellError(c.key, (er as any)[c.key]))
                                  );
                                  if (hasError) {
                                    alert("Fix validation errors before saving.");
                                    return;
                                  }
                                  // Commit updates
                                  Object.values(edited).forEach((er) => {
                                    // Coerce age to number if applicable
                                    const next = { ...er } as RowRecord;
                                    if ("age" in next && next.age !== null && next.age !== "") {
                                      const n = Number(next.age);
                                      if (Number.isFinite(n)) (next as any).age = n;
                                    }
                                    // Dispatch update
                                    // We can reuse updateRow action
                                  });
                                  // Batch: dispatch per record to keep it simple
                                  // Note: import here to avoid circular? already imported at top
                                  const { updateRow } = require("@/store/slices/dataSlice");
                                  Object.values(edited).forEach((er) => {
                                    dispatch(updateRow(er as RowRecord));
                                  });
                                  setEdited({});
                                  setIsEditing(false);
                                }}
                              >
                                <SaveOutlinedIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Cancel All">
                            <IconButton
                              color="inherit"
                              onClick={() => {
                                setEdited({});
                                setIsEditing(false);
                              }}
                            >
                              <CloseOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => {
                              setIsEditing(true);
                              ensureEditedRow(row);
                            }}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => setDeleteId(row.id)}>
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={sorted.length}
          page={page}
          onPageChange={(_, p) => dispatch(setPage(p))}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Paper>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete row?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => {
            const { deleteRow } = require("@/store/slices/dataSlice");
            if (deleteId) dispatch(deleteRow(deleteId));
            setDeleteId(null);
          }}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={manageOpen} onClose={() => setManageOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          <Stack spacing={1} mt={1}>
            {allColumns.map((c) => (
              <Stack key={c.key} direction="row" alignItems="center" spacing={1}>
                <Checkbox
                  checked={c.visible}
                  onChange={(e) =>
                    dispatch(setVisibility({ key: c.key, visible: e.target.checked }))
                  }
                />
                <Box>{c.label}</Box>
              </Stack>
            ))}
            <Box mt={2}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  label="Field Key"
                  value={newField.key}
                  onChange={(e) => setNewField((p) => ({ ...p, key: e.target.value }))}
                />
                <TextField
                  size="small"
                  label="Label"
                  value={newField.label}
                  onChange={(e) => setNewField((p) => ({ ...p, label: e.target.value }))}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    const key = normalizeKey(newField.key);
                    const label = newField.label.trim() || labelFromKey(key);
                    if (!key) return;
                    dispatch(addColumn({ key, label }));
                    setNewField({ key: "", label: "" });
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={() => dispatch(resetToDefaults())}>Reset Columns</Button>
          <Button onClick={() => setManageOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}


