import type { TQueryConfig } from '@/types/query-config'

export interface Document {
  id: number
  name: string | null
  description: string | null
  creator_id: number
  created_at: string
  updated_at: string
  creator: {
    fullname: string
  }
}

export interface ListDocumentRes {
  documents: Document[]
  page: number
  limit: number
  totalPages: number
}

export interface DocumentDetailRes {
  document: Document
  gallery: {
    id: number
    user_id: null
    filename: string
    version: number
    created_at: string
  }[]
}

export interface CreateDocumentReqBody {
  name: string
  description: string
  attachment: string
}

export interface UpdateDocumentReqBody {
  id: number
  name: string
  description: string
}

export interface GetDocumentsParams extends Pick<TQueryConfig, 'limit' | 'page'> {
  name?: string | string[] | undefined
}
