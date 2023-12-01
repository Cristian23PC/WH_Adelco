export const formatCapitalizeText = (str: string): string => {
  const name = str.toLowerCase();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const formatOption = ({
  key,
  label
}: {
  key: string;
  label: string;
}) => ({ value: key, label });

export const labelizeText = (str: string): string => {
  return str
    .trim()
    .split(/[\s-]+/) // split by empty spaces and hyphens
    .map((text) => formatCapitalizeText(text.trim()))
    .join(' ');
};
