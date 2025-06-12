import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TabsContent } from '@/components/ui/tabs'
import { DEACTIVATED } from '@/constants/customerStatus'
import { COMPANY } from '@/constants/customerType'
import { UNVERIFIED } from '@/constants/customerVerify'
import { MALE } from '@/constants/gender'
import { AppContext } from '@/contexts/app-context'
import { customerSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useContext } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const formData = customerSchema.pick([
  'name',
  'type',
  'consultantor_id',
  'tax_code',
  'website',
  'surrogate',
  'address_company',
  'address_personal',
  'phone',
  'email',
  'contact_name',
  'status',
  'verify',
  'attachment',
  'note',
  'assign_at',
  'date_of_birth',
  'gender'
])

type FormData = yup.InferType<typeof formData>
const FormCustomerPersonal = () => {
  const { t } = useTranslation('admin')
  const { profile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      type: COMPANY,
      consultantor_id: '',
      tax_code: '',
      website: '',
      surrogate: '',
      address_company: '',
      address_personal: '',
      phone: '',
      email: '',
      contact_name: '',
      status: DEACTIVATED,
      verify: UNVERIFIED,
      attachment: '',
      note: '',
      assign_at: '',
      date_of_birth: new Date(1990, 0, 1),
      gender: MALE
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const handleSubmitForm = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <TabsContent value='Personal'>
        <Card>
          <CardContent className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='tabs-demo-current'>Current password</Label>
              <Input id='tabs-demo-current' type='password' />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='tabs-demo-new'>New password</Label>
              <Input id='tabs-demo-new' type='password' />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </form>
  )
}

export default FormCustomerPersonal
