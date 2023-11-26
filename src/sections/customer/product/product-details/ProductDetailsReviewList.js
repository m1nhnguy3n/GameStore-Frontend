import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Avatar, Box, List, ListItem, Rating, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import AppPagination from '../../../../components/AppPagination';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

ProductDetailsReviewList.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewList({ product }) {
  const { review } = product;
  const [reviewPerPage, setReviewPerPage] = useState([])

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {reviewPerPage.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </List>
      <AppPagination pageSize={5} data={review} setData={(r) => setReviewPerPage(r)} />
    </Box>
  );
}

// ----------------------------------------------------------------------

ReviewItem.propTypes = {
  review: PropTypes.object,
};

function ReviewItem({ review }) {

  const { userFullName, rating, comment, postedAt, avatarUrl, isPurchased } = review;

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{
              mr: { xs: 2, sm: 0 },
              mb: { sm: 2 },
              width: { md: 64 },
              height: { md: 64 },
            }}
          />
          <div>
            <Typography variant="subtitle2" noWrap>
              {userFullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(postedAt)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={rating} precision={0.1} readOnly />

          {isPurchased && (
            <Typography
              variant="caption"
              sx={{
                my: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
              }}
            >
              <Iconify icon={'ic:round-verified'} width={16} height={16} />
              &nbsp;Verified purchase
            </Typography>
          )}

          <Typography variant="body2">{comment}</Typography>
        </div>
      </ListItem>
    </>
  );
}
