import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { sentenceCase } from 'change-case';

// redux
import { addProduct } from '../../../redux/slices/product';
import { useDispatch } from '../../../redux/store';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFEditor, RHFSelect, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const CATEGORY_OPTION = [
  {
    id: 1,
    categoryName: 'MMO',
  },
  {
    id: 2,
    categoryName: 'Action',
  },
];

const STOCK_STATUS = [
  {
    id: 1,
    statusName: 'in_stock',
  },
  {
    id: 2,
    statusName: 'out_of_stock',
  },
];

const PUBLISHER_OPTION = [
  {
    id: 1,
    publisherName: 'Steam',
  },
  {
    id: 2,
    publisherName: 'Epic Games',
  },
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const NewProductSchema = Yup.object().shape({
    productName: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    // images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id || '',
      productName: currentProduct?.productName || '',
      description: currentProduct?.description || '',
      image: currentProduct?.image || '',
      price: currentProduct?.price || 0,
      available: currentProduct?.available || 0,
      stockId: currentProduct?.stockId || STOCK_STATUS[0].id,
      categoryId: currentProduct?.categoryId || CATEGORY_OPTION[0].id,
      publisherId: currentProduct?.publisherId || PUBLISHER_OPTION[0].id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = ;
  watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
      if (isEdit) {
        handleAndUpdateData(data);
      } else {
        handleAndAddProduct(data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.product.list);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAndAddProduct = (product) => {
    // console.log(product.inStock);
    // const stockStatusId = product.inStock ? 1 : 2;
    // product.stockId = stockStatusId;
    console.log(product.image);
    dispatch(addProduct(product));
  };

  const handleAndUpdateData = (data) => {
    const value = {
      categoryId: data.categoryId,
    };
    console.log(value);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'image',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="productName" label="Product Name" />

              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>

              <div>
                <LabelStyle>Images</LabelStyle>
                <RHFUploadSingleFile name="image" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              {/* <RHFSwitch name="inStock" label="In stock" /> */}
              <RHFSelect name="stockId" label="Stock Status">
                {STOCK_STATUS.map((stockStatus) => (
                  <option key={stockStatus.id} value={Number(stockStatus.id)}>
                    {sentenceCase(stockStatus.statusName)}
                  </option>
                ))}
              </RHFSelect>

              <Stack spacing={3} mt={2}>
                <RHFSelect name="categoryId" label="Category">
                  {CATEGORY_OPTION.map((category) => (
                    <option key={category.id} value={Number(category.id)}>
                      {category.categoryName}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect name="publisherId" label="Publisher">
                  {PUBLISHER_OPTION.map((publisher) => (
                    <option key={publisher.id} value={Number(publisher.id)}>
                      {publisher.publisherName}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
            </Card>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="available"
                  label="Available"
                  placeholder="0"
                  value={getValues('available') === 0 ? '' : getValues('available')}
                  onChange={(event) => setValue('available', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    type: 'number',
                  }}
                />
              </Stack>

              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Regular Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Product' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
