import userApi from '@/apis/user.api'
import FileUploadMultiple from '@/components/file-upload-multiple'
import FormattedDate from '@/components/formatted-date'
import SearchMain from '@/components/search-main'
import TableMain from '@/components/table-main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'
import httpStatusCode from '@/constants/httpStatusCode'
import { LIMIT, PAGE } from '@/constants/pagination'
import { DOCUMENT_FILES_HEADER_TABLE } from '@/constants/table'
import { useQueryParams } from '@/hooks/use-query-params'
import type { GetDocumentFilesParams } from '@/types/user'
import { documentFileSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm, type Resolver } from 'react-hook-form'
import { Fragment } from 'react/jsx-runtime'
import { toast } from 'sonner'
import * as yup from 'yup'

const formData = documentFileSchema.pick(['attachments'])
type FormData = yup.InferType<typeof formData>

export default function DocumentFiles() {
  const queryClient = useQueryClient()
  const [resetFileUpload, setResetFileUpload] = useState(false)
  const [files, setFiles] = useState<File[] | undefined>()
  const queryParams: GetDocumentFilesParams = useQueryParams()
  const queryConfig: GetDocumentFilesParams = omitBy(
    {
      page: queryParams.page || PAGE,
      limit: queryParams.limit || LIMIT,
      filename: queryParams.filename as string[]
    },
    isUndefined
  )
  const { handleSubmit, setError } = useForm<FormData>({
    defaultValues: {
      attachments: []
    },
    resolver: yupResolver(formData) as Resolver<FormData>
  })

  const { data: documentFiles } = useQuery({
    queryKey: ['documentFiles', queryConfig],
    queryFn: () => userApi.getListDocumentFiles(queryConfig)
  })
  const galleries = documentFiles?.data?.data?.galleries
  const pagination = documentFiles?.data?.data

  const createDocumentFilesMutation = useMutation({
    mutationFn: userApi.createDocumentFiles
  })

  const uploadFileAttachmentMutation = useMutation({
    mutationFn: userApi.uploadDocumentFiles
  })

  const handleSubmitForm = handleSubmit(async (data) => {
    try {
      let attachments: string[] | undefined = undefined
      if (files) {
        const form = new FormData()
        Array.from(files).forEach((file) => form.append('attachments', file))
        const uploadResponeArray = await uploadFileAttachmentMutation.mutateAsync(form)
        attachments = uploadResponeArray.data.data?.map((file) => file.filename)
        // setValue('attachments', attachments)
      }
      const payload = {
        ...data,
        attachments
      }
      for (const key in payload) {
        const value = payload[key as keyof typeof payload]
        if (value === undefined || value === null) {
          delete payload[key as keyof typeof payload]
        }
      }

      if (attachments?.length === 0) {
        toast.error('Files is required')
        return
      }
      const res = await createDocumentFilesMutation.mutateAsync(payload)
      toast.success(res.data.message)
      queryClient.invalidateQueries({ queryKey: ['documentFiles'] })
      setResetFileUpload((prev) => !prev)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === httpStatusCode.UnprocessableEntity) {
        const formError = error.response?.data?.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData]['msg'],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFiles = (files?: File[]) => setFiles(files)

  return (
    <Fragment>
      <Helmet>
        <title>Document files - TTP Telecom</title>
        <meta name='keywords' content='Document files - TTP Telecom' />
        <meta name='description' content='Document files - TTP Telecom' />
      </Helmet>
      <div className='@container/main'>
        <div className='py-4 md:gap-6 md:py-6'>
          <div className='grid grid-cols-12 mn:gap-10 lg:gap-0'>
            <div className='mn:col-span-12 lg:col-span-9'>
              <div className='px-4 lg:px-6'>
                <div className='flex items-start flex-wrap justify-between mb-4 gap-3'>
                  <SearchMain
                    queryConfig={queryConfig}
                    payloadField={{
                      text: 'filename'
                    }}
                  />
                </div>
                <TableMain
                  page={pagination?.page.toString() || PAGE}
                  page_size={galleries && galleries.length > 0 ? (pagination?.totalPages as number).toString() : '0'}
                  headers={DOCUMENT_FILES_HEADER_TABLE}
                  headerClassNames={['', '', '', 'text-right']}
                  data={galleries}
                  renderRow={(item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell colSpan={1}>{item.filename}</TableCell>
                      <TableCell className='w-[10%]'>
                        <div
                          key={item.user.id}
                          className='bg-[#E6F7FF] rounded-sm text-[#1890FF] w-fit px-2 py-1.5 m-2'
                        >
                          {item.user.fullname}
                        </div>
                      </TableCell>
                      <TableCell className='text-right w-[10%]'>
                        <FormattedDate isoDate={item.created_at as string} />
                      </TableCell>
                    </TableRow>
                  )}
                />
              </div>
            </div>
            <div className='mn:col-span-12 lg:col-span-3'>
              <div className='lg:px-6 mn:px-6'>
                <form noValidate className='mn:mx-auto lg:mx-0 mn:w-full  lg:w-fit' onSubmit={handleSubmitForm}>
                  <Card className='gap-3'>
                    <CardContent className='grid gap-3'>
                      <div className='grid gap-3'>
                        <FileUploadMultiple resetSignal={resetFileUpload} labelRequired onChange={handleChangeFiles} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type='submit'>Upload</Button>
                    </CardFooter>
                  </Card>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}
