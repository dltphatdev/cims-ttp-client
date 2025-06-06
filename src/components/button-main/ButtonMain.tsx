interface Props {
  children: React.ReactNode
  classNameWrapper?: string
}
export default function ButtonMain({ children, classNameWrapper }: Props) {
  return (
    <div className={classNameWrapper}>
      <button className='py-2 px-3 bg-(--color-green) hover:bg-orange-500 light:text-white font-medium text-base rounded-lg'>
        <span className='text-white justify-center flex items-center gap-x-1'>{children}</span>
      </button>
    </div>
  )
}
