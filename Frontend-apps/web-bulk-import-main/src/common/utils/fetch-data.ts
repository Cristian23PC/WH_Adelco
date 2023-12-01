const fetchData = <T extends unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const promise = fetch(input, init)
    .then((response) => response.json())
    .then((json: T) => json);

  return promise;
};

export { fetchData };
