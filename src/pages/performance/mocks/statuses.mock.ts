import { APPROVED, CANCELLED, NEW } from '@/constants/performanceStatus'
const statuses = [
  {
    status_type: NEW,
    status_value: 'New'
  },
  {
    status_type: APPROVED,
    status_value: 'Approved'
  },
  {
    status_type: CANCELLED,
    status_value: 'Cancelled'
  }
]
export default statuses
