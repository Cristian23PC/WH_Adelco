import { DeliveryDate, DeliveryDates } from '@Types/adelco/cart';
import { StringHelpers } from '../../../helpers/stringHelpers';

const getDateUtcTimezone = (date: string) =>
  new Date(date.split('T')[0] + 'T00:00:00'); // INFO: Set hour to 0 and avoid timezone issues

export const getEarlyDateItem = (
  dateArray: DeliveryDates
): DeliveryDate | null => {
  if (!dateArray || dateArray.length === 0) {
    return null;
  }

  return dateArray.reduce((prev, current) =>
    new Date(current?.startDateTime) < new Date(prev?.startDateTime)
      ? current
      : prev
  );
};

export const formatDateTime = (dateString: string) => {
  const date = getDateUtcTimezone(dateString);

  const dateParts = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  const weekday = dateParts.find((part) => part.type === 'weekday').value;
  const month = dateParts.find((part) => part.type === 'month').value;
  const day = dateParts.find((part) => part.type === 'day').value;
  const year = dateParts.find((part) => part.type === 'year').value;

  const capitalizeWeekday = StringHelpers.capitaliseFirstLetter(weekday);

  return `${capitalizeWeekday} ${day}/${month}/${year}`;
};

export const formatDeliveryDates = (deliveryDate: DeliveryDate) => {
  const { startDateTime, endDateTime } = deliveryDate;

  const isSameDay =
    getDateUtcTimezone(startDateTime).getTime() ===
    getDateUtcTimezone(endDateTime).getTime();

  const startDateTimeFormatted = formatDateTime(startDateTime);

  if (isSameDay) {
    return startDateTimeFormatted;
  }

  const endDateTimeFormatted = formatDateTime(endDateTime);

  return `Entre ${startDateTimeFormatted} y ${endDateTimeFormatted}`;
};
