export const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return await response.json();
};
