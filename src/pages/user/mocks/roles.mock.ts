import { ADMIN, NONE, SALE, TECHNICIAN } from '@/constants/role'
const roles = [
  {
    role_type: ADMIN,
    role_value: 'Sale Admin'
  },
  {
    role_type: SALE,
    role_value: 'Sale'
  },
  {
    role_type: NONE,
    role_value: 'None'
  },
  {
    role_type: TECHNICIAN,
    role_value: 'Technician'
  }
]

export default roles
