export const formatRut = (rut: string) => {
  const rutWithoutDots = rut.replace(/\./g, '');

  const lastCharacter = rutWithoutDots.slice(-1).toUpperCase();

  const rutWithoutLastCharacter = rutWithoutDots.slice(0, -1);

  if (rutWithoutLastCharacter.endsWith('-')) {
    return rutWithoutLastCharacter + lastCharacter;
  } else {
    return rutWithoutLastCharacter + '-' + lastCharacter;
  }
};
