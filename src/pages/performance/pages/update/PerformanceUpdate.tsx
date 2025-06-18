import { useParams } from 'react-router-dom'

export default function PerformanceUpdate() {
  const { customerId } = useParams()
  console.log(customerId)
  return <div>Effective update</div>
}
