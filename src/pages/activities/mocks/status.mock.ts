import { NEW, IN_PROGRESS, COMPLETED, CANCELLED } from '@/constants/activity'

const statuses = [
  {
    status_type: NEW,
    status_value: 'New'
  },
  {
    status_type: IN_PROGRESS,
    status_value: 'InProgress'
  },
  {
    status_type: COMPLETED,
    status_value: 'Completed'
  },
  {
    status_type: CANCELLED,
    status_value: 'Cancelled'
  }
]

export default statuses
