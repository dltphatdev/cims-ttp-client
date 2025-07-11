import InputMain from '@/components/input-main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { documentFileSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Helmet } from 'react-helmet-async'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Fragment } from 'react/jsx-runtime'
import * as yup from 'yup'

const formData = documentFileSchema.pick(['name', 'description', 'attachment'])

type FormData = yup.InferType<typeof formData>

export default function DocumentCreate() {
  const { t } = useTranslation('admin')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      attachment: ''
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })
  return (
    <Fragment>
      <Helmet>
        <title>Thêm tài liệu - TTP Telecom</title>
        <meta name='keywords' content='Thêm tài liệu - TTP Telecom' />
        <meta name='description' content='Thêm tài liệu - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='px-4 lg:px-6'>
            <h1 className='mb-2 font-bold text-2xl'>{t('Create document')}</h1>
            <Card>
              <CardContent className='grid gap-3'>
                <div className='grid gap-3'>
                  <InputMain
                    register={register}
                    name='name'
                    labelRequired={true}
                    labelValue={t('Filename')}
                    type='text'
                    placeholder={t('Filename')}
                    errorMessage={errors.name?.message}
                  />
                </div>
                {/* <div className='grid gap-3'>
                  <FileUploadMultiple onChange={handleChangeFiles} />
                </div> */}
                <div className='grid gap-3'>
                  <Label htmlFor='note' className='text-sm font-medium light:text-gray-700'>
                    Mô tả <span className='text-red-500'>*</span>
                  </Label>
                  <Textarea {...register('description')} placeholder='Mô tả' />
                  {errors?.description && <span className='text-red-600'>{errors?.description?.message}</span>}
                </div>
              </CardContent>
              <CardFooter>
                <Button>{t('Save')}</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
