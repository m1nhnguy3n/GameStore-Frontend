/* eslint-disable object-shorthand */
import PropTypes from 'prop-types';

import { Box, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';


AppPagination.propTypes = {
  pageSize: PropTypes.number,
  data: PropTypes.array,
  setData: PropTypes.func
};

export default function AppPagination({data, pageSize, setData }) {

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

  useEffect(() => {
    handleData({ from: pagination.from, to: pagination.to }).then((response) => {
      setPagination({ ...pagination, count: response.count });
      setData(response.data);
    });
  }, [data, pagination.from, pagination.to]);

  const handlePageChange = (event, page) => {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;

    setPagination({ ...pagination, from: from, to: to });
  };

  const handleData = ({ from, to }) => {
    let datas = []
    if (Array.isArray(data)) {
      datas = data.slice(from, to);
    }

    return new Promise((resolve, reject) => {
      resolve({
        count: data.length,
        data: datas,
      });
    });
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
      <Pagination count={Math.ceil(pagination.count / pageSize)} onChange={handlePageChange} />
    </Box>
  );
}
