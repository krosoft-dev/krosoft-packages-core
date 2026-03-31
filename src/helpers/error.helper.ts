import { ErrorHttp } from "../types/api/ErrorHttp";

const isErrorHttp = (e: unknown): e is ErrorHttp => typeof e === "object" && e !== null && "code" in e;

export const extractErrors = (error: unknown): string[] => {
  if (isErrorHttp(error) && (error.code === 400 || error.code === 500)) {
    if (error.errors !== null && error.errors !== undefined) {
      return error.errors;
    }
  }

  return [];
};

export const getMessage = (error: unknown): string => (error instanceof Error ? error.message : String(error));
