import { useParams } from 'react-router-dom'

const CustomerUpdateCompany = () => {
  const { customerId } = useParams()
  console.log(customerId)
  return <div>CustomerUpdateCompany</div>
}

export default CustomerUpdateCompany
