export type URLParam = {
  key: string;
  value: string;
};

type updateURLParamsProps = (params: URLParam[]) => string;

export const updateURLParams: updateURLParamsProps = (params) => {
  const url = new URL(window.location.href);
  const nextURLParams = new URLSearchParams(url.search);

  params.map(({ key, value }) => {
    if (value) {
      nextURLParams.set(key, value);
    } else {
      nextURLParams.delete(key);
    }
  });

  const updatedURL = `${url.pathname}?${nextURLParams.toString()}`;

  return updatedURL;
};
