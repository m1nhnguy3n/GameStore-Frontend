import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material';
// redux
import { getUsers } from '../../../redux/slices/user';
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
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
// api
import { deleteOneUser } from '../../../api/user';
// sections
import { UserTableRow, UserTableToolbar } from '../../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------


const ROLE_OPTIONS = ['all', 'Administrator', 'Customer'];

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'isVerified', label: 'Verified', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {
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
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);

  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users.length) {
      setTableData(users);
    }
  }, [users]);

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
    deleteOneUser(id)
      .then(() => {
        enqueueSnackbar("Delete Succeed!!");
      }).catch(() => {
        enqueueSnackbar('Delete Failed!!', {variant: 'error'});
    });
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.user.edit(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterRole);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              New User
            </Button>
          }
        />

        <Card>

          <UserTableToolbar
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
            optionsRole={ROLE_OPTIONS}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
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
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

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
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.firstName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.roles[0] === filterRole);
  }

  return tableData;
}
