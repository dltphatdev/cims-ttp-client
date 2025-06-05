const Dashboard = () => {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          {/* <SectionCards /> */}
          {/* <div className='px-4 lg:px-6'>
            <ChartAreaInteractive />
          </div> */}
          {/* <div className='px-4 lg:px-6'>
            <ProductTable data={products} />
          </div> */}

          <div className='*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6'>
            abc
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
