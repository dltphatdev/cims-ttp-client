import { useLocation } from 'react-router-dom'

const RevenueCreate = () => {
  const { state } = useLocation()
  const performanceId = state.performanceId
  const revenueDirection = state.revenueDirection
  return <div>RevenueCreate</div>
}

export default RevenueCreate
