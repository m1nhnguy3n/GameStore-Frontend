import orderBy from 'lodash/orderBy';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// redux
import { filterProducts, getProducts } from '../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_PAGE } from '../../../routes/paths';

// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { FormProvider } from '../../../components/hook-form';

// sections
import CartWidget from '../../../sections/customer/product/CartWidget';
import {
  ShopFilterSidebar,
  ShopProductList,
  ShopProductSearch,
  ShopProductSort,
  ShopTagFiltered,
} from '../../../sections/customer/product/shop';

// ----------------------------------------------------------------------

export default function Shop() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);

  const { products, sortBy, filters } = useSelector((state) => state.product);

  const filteredProducts = applyFilter(products, sortBy, filters);

  const defaultValues = {
    category: filters.category,
    platform: filters.platform,
    priceRange: filters.priceRange,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault = !values.priceRange && values.platform.length === 0 && values.category === 'All';

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    reset();
    handleCloseFilter();
  };

  const handleRemoveCategory = () => {
    setValue('category', 'All');
  };

  const handleRemovePlatform = (value) => {
    const newValue = filters.platform.filter((item) => item !== value);
    setValue('platform', newValue);
  };

  const handleRemovePrice = () => {
    setValue('priceRange', '');
  };

  return (
    <Page title="Shop">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 15, mb: 10, position: 'relative' }}>
        <HeaderBreadcrumbs
          heading="Shop"
          links={[
            {
              name: 'Shop',
              href: PATH_PAGE.product.shop,
            },
            { name: 'Products' },
          ]}
        />

        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <ShopProductSearch />

          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <FormProvider methods={methods}>
              <ShopFilterSidebar
                onResetAll={handleResetFilter}
                isOpen={openFilter}
                onOpen={handleOpenFilter}
                onClose={handleCloseFilter}
              />
            </FormProvider>

            <ShopProductSort />
          </Stack>
        </Stack>

        <Stack sx={{ mb: 3 }}>
          {!isDefault && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>{filteredProducts.length}</strong>
                &nbsp;Products found
              </Typography>

              <ShopTagFiltered
                filters={filters}
                isShowReset={!isDefault && !openFilter}
                onRemoveCategory={handleRemoveCategory}
                onRemovePlatform={handleRemovePlatform}
                onRemovePrice={handleRemovePrice}
                onResetAll={handleResetFilter}
              />
            </>
          )}
        </Stack>

        <ShopProductList products={filteredProducts} loading={!products.length && isDefault} />
        <CartWidget />
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, sortBy, filters) {
  // SORT BY
  if (sortBy === 'featured') {
    products = orderBy(products, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    products = orderBy(products, ['createdAt'], ['desc']);
  }
  if (sortBy === 'priceDesc') {
    products = orderBy(products, ['price'], ['desc']);
  }
  if (sortBy === 'priceAsc') {
    products = orderBy(products, ['price'], ['asc']);
  }
  // FILTER PRODUCTS
  if (filters.category !== 'All') {
    products = products.filter((product) => product.category.categoryName === filters.category);
  }
  if (filters.platform.length > 0) {
    products = products.filter((product) => filters.platform.includes(product.platform.platformName));
  }
  if (filters.priceRange) {
    products = products.filter((product) => {
      if (filters.priceRange === 'below') {
        return product.price < 25;
      }
      if (filters.priceRange === 'between') {
        return product.price >= 25 && product.price <= 75;
      }
      return product.price > 75;
    });
  }
  return products;
}
