import ChartMain from '@/components/chart-area-interactive'
import { Helmet } from 'react-helmet-async'
import { Fragment } from 'react/jsx-runtime'

const Dashboard = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Dashboard - TTP Telecom</title>
        <meta name='keywords' content='Dashboard - TTP Telecom' />
        <meta name='description' content='Dashboard - TTP Telecom' />
      </Helmet>
      <div className='flex flex-1 flex-col'>
        <div className='@container/main'>
          <div className='py-4 md:gap-6 md:py-6'>
            <div className='px-4 lg:px-6'>
              <ChartMain />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Dashboard
