import type { SuccessResponseApi } from '@/types/common'
import type { GetDocumentsParams, ListDocumentRes } from '@/types/document'
import http from '@/utils/http'

const documentApi = {
  getListDocuments(params: GetDocumentsParams) {
    return http.get<SuccessResponseApi<ListDocumentRes>>('documents', { params })
  }
  // upsertDocument() {
  //   return http.put<{ message: string }>('document')
  // }
}

export default documentApi
