type userValues = {
  firstName: string;
  surname: string;
  rut: string;
  email: string;
};

export const formatWhatsAppMessage = (
  userValues: userValues,
  phone = '+56989310375'
): string => {
  const { firstName, surname, rut, email } = userValues;
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=`;
  const msg = `¡Hola! Necesito asistencia para comprar en el sitio de Adelco. Mi nombre es ${firstName} ${surname} y el RUT de mi empresa ${rut}. Mi correo de contacto es ${email}`;
  return `${url}${encodeURIComponent(msg)}`;
};
