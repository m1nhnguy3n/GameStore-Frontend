import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useLocation, useParams } from 'react-router-dom';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
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
import { getCdkey } from '../../../redux/slices/product';
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

// api
import { getCdkeyApi } from '../../../api/cdkey';
// sections
import { CdkeyTableRow, CdkeyNewEditForm } from '../../../sections/@dashboard/product/cdkey';
import { ProductTableToolbar } from '../../../sections/@dashboard/product/product-list';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: '#', align: 'left' },
  { id: 'code', label: 'CD Key', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function CDkeyList() {
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

  const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();
    
  const { productId } = useParams();

  const { cdkey, isLoading } = useSelector((state) => state.product);

  // const [cdkey, setCdkey] = useState({})

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [isEdit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(getCdkey(productId));
  }, [dispatch, productId]);


  useEffect(() => {
    if (cdkey) {
      setTableData(cdkey.code);
    }
  }, [cdkey]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (data) => {
    setEdit(true);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const denseHeight = dense ? 60 : 80;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="CDKey List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="CDKey List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Product List', href: PATH_DASHBOARD.product.list },{ name: 'CDKey List' }]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <CdkeyNewEditForm productId={Number(productId)}/>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card>
                <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                            tableData.map((row, index) => index)
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
                            tableData.map((row, index) => index)
                          )
                        }
                      />

                      <TableBody>
                        {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) =>
                            row ? (
                              <CdkeyTableRow
                                id={index}
                                key={index}
                                row={row}
                                selected={selected.includes(index)}
                                onSelectRow={() => onSelectRow(index)}
                                onDeleteRow={() => handleDeleteRow(index)}
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
    tableData = tableData.filter((item) => item.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
