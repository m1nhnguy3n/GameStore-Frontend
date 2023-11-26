import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, FormHelperText, Rating, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import { addReviewApi } from '../../../../api/product';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  productId: PropTypes.number,
};

export default function ProductDetailsReviewForm({ onClose, productId, ...other }) {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const ReviewSchema = Yup.object().shape({
    rating: Yup.mixed().required('Rating is required'),
    comment: Yup.string().required('Review is required'),
  });

  const defaultValues = {
    rating: null,
    comment: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await handleAndPostReview(data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAndPostReview = async (review) => {
    const userFullName = `${user.firstName} ${user.lastName}`;
    review.userFullName = userFullName;
    review.email = user.email;
    review.avatarUrl = user.avatarUrl;
    review.productId = productId;
    review.userId = user.id
    await addReviewApi(review)
      .then(() => {
        enqueueSnackbar('Post Review Successful!');
      })
      .catch(() => {
        enqueueSnackbar('Post Review Failed!', { variant: 'error' });
      });
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other}>
      <Typography variant="subtitle1" gutterBottom>
        Add Review
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">Your review about this product:</Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => <Rating {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="comment" label="Review *" multiline rows={3} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Post review
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}
