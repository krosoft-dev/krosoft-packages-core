export interface ErrorHttp {
  code?: number;
  message: string | null;
  errors?: string[] | null;
}
