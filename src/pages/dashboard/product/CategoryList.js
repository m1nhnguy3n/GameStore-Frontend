import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
// redux
import { getCategories } from '../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { emptyRows, getComparator } from '../../../hooks/useTable';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from '../../../components/table';

// sections
import {
  CategoryNewEditForm,
  CategoryTableRow,
  CategoryTableToolbar,
} from '../../../sections/@dashboard/product/category';

// api
import { deleteCategoryApi } from '../../../api/category';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: '#', align: 'left' },
  { id: 'name', label: 'Category', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CategoryList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettings();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const { categories, isLoading } = useSelector((state) => state.product);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [category, setCategory] = useState({});
  const [isEdit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length) {
      setTableData(categories);
    }
  }, [categories]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = async (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    await deleteCategoryApi(id)
      .then(() => {
        enqueueSnackbar('Delete success!');
      })
      .catch(() => {
        enqueueSnackbar('Delete failed!', { variant: 'error' });
      });
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (data) => {
    setEdit(true);
    setCategory(data);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Category List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Category List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Category List' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CategoryNewEditForm isEdit={isEdit} category={category} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card>
                <CategoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 400 }}>
                    {selected.length > 0 && (
                      <TableSelectedActions
                        dense={dense}
                        numSelected={selected.length}
                        rowCount={tableData.length}
                        onSelectAllRows={(checked) =>
                          onSelectAllRows(
                            checked,
                            tableData.map((row) => row.id)
                          )
                        }
                        actions={
                          <Tooltip title="Delete">
                            <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                              <Iconify icon={'eva:trash-2-outline'} />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    )}

                    <Table size={dense ? 'small' : 'medium'}>
                      <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={tableData.length}
                        numSelected={selected.length}
                        onSort={onSort}
                        onSelectAllRows={(checked) =>
                          onSelectAllRows(
                            checked,
                            tableData.map((row) => row.id)
                          )
                        }
                      />

                      <TableBody>
                        {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) =>
                            row ? (
                              <CategoryTableRow
                                key={row.id}
                                row={row}
                                selected={selected.includes(row.id)}
                                onSelectRow={() => onSelectRow(row.id)}
                                onDeleteRow={() => handleDeleteRow(row.id)}
                                onEditRow={() => handleEditRow(row)}
                              />
                            ) : (
                              !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                            )
                          )}

                        <TableEmptyRows
                          height={denseHeight}
                          emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                        />

                        <TableNoData isNotFound={isNotFound} />
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <Box sx={{ position: 'relative' }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={dataFiltered.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                  />

                  <FormControlLabel
                    control={<Switch checked={dense} onChange={onChangeDense} />}
                    label="Dense"
                    sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
                  />
                </Box>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.categoryName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
