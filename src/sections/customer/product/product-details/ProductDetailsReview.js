import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { Divider, Dialog } from '@mui/material';
import AuthGuard from '../../../../guards/AuthGuard';
//
import ProductDetailsReviewForm from './ProductDetailsReviewForm';
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewOverview from './ProductDetailsReviewOverview';

// ----------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReview({ product }) {


  const [reviewBox, setReviewBox] = useState(false);

  const handleOpenReviewBox = () => {
    setReviewBox((prev) => !prev);
  };

  const handleCloseReviewBox = () => {
    setReviewBox(false);
  };

  return (
    <>
      <ProductDetailsReviewOverview product={product} onOpen={handleOpenReviewBox} />

      <Divider />

      <Dialog open={reviewBox}>
        <AuthGuard>
          <ProductDetailsReviewForm onClose={handleCloseReviewBox} productId={product.id} />
        </AuthGuard>
        <Divider />
      </Dialog>

      <ProductDetailsReviewList product={product} />
    </>
  );
}
