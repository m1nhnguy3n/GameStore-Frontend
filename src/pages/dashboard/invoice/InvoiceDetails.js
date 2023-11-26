import { useParams } from 'react-router-dom';
import {useEffect} from 'react'
// @mui
import { Container } from '@mui/material';
// redux
import { getListInvoicesForAdmin } from '../../../redux/slices/user';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
// sections
import Invoice from '../../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  const { id } = useParams();

  const { invoicesForAdmin } = useSelector((state) => state.user);

  const invoice = invoicesForAdmin.find((invoice) => invoice.id === Number(id));

  useEffect(() => {
    dispatch(getListInvoicesForAdmin());
  }, [dispatch]);

  return (
    <Page title="Invoice: View">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Invoice Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Invoices',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: invoice?.id.toString() || '' },
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  );
}
