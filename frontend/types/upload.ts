export interface IUploadedFile {
  id?: string;
  originalName: string;
  secureUrl: string;
  publicId: string;
  resourceType: "image" | "raw" | string;
  format: string;
  bytes: number;
  width?: number | null;
  height?: number | null;
  uploadedAt?: string;
}

export interface IUploadResult {
  uploaded: IUploadedFile[];
  totalUploaded: number;
}

export interface IUploadResponse {
  success: boolean;
  message?: string;
  status?: number;
  data?: IUploadResult;
  error?: any;
}

