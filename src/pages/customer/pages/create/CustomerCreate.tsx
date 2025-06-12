import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'
import FormCustomerCompany from '@/pages/customer/components/form-customer-company'
import FormCustomerPersonal from '@/pages/customer/components/form-customer-personal'

export default function CustomerCreate() {
  const { t } = useTranslation('admin')
  return (
    <Fragment>
      <Helmet>
        <title>Thêm mới khách hàng - TTP Telecom</title>
        <meta name='keywords' content='Thêm mới khách hàng - TTP Telecom' />
        <meta name='description' content='Thêm mới khách hàng - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Create customer')}</h1>
            <Tabs defaultValue='Company'>
              <TabsList>
                <TabsTrigger value='Company'>{t('Company')}</TabsTrigger>
                <TabsTrigger value='Personal'>{t('Personal')}</TabsTrigger>
              </TabsList>
              <FormCustomerCompany />
              <FormCustomerPersonal />
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
