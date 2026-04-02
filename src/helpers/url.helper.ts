import { SortOption } from "../types/SortOption";

export function buildUrl(baseUrl: string, params: object, sortBy?: SortOption[]): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== 0 && value !== "") {
      if (Array.isArray(value)) {
        value.forEach(item => {
          urlParams.append(key, String(item));
        });
      } else {
        urlParams.append(key, value as string);
      }
    }
  });

  if (sortBy !== undefined && sortBy.length > 0) {
    sortBy.forEach(sortOption => {
      urlParams.append("sortBy", `${sortOption.key}:${sortOption.order}`);
    });
  }

  const queryString = urlParams.toString().replace(/%3A/g, ":").replace(/%5B/g, "[").replace(/%5D/g, "]");
  return queryString !== "" ? `${baseUrl}?${queryString}` : baseUrl;
}
