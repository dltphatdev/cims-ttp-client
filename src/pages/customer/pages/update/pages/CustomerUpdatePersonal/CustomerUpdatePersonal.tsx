import { useParams } from 'react-router-dom'

const CustomerUpdatePersonal = () => {
  const { customerId } = useParams()
  console.log(customerId)
  return <div>CustomerUpdatePersonal</div>
}

export default CustomerUpdatePersonal
