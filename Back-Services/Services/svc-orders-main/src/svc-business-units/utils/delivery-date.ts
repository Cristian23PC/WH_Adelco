import { NextDeliveryDateDto } from '@/svc-business-units/interfaces/delivery-date.interface';

export const dateExistInNextDeliveryDates = (date: string, nextDeliveryDates: NextDeliveryDateDto[]): boolean => {
  const dateInstance = new Date(date).setHours(0, 0, 0, 0);

  return nextDeliveryDates.some((nextDeliveryDate: NextDeliveryDateDto) => {
    const startDateInstance = new Date(nextDeliveryDate.startDateTime).setHours(0, 0, 0, 0);
    const endDateInstance = new Date(nextDeliveryDate.endDateTime).setHours(0, 0, 0, 0);

    return dateInstance >= startDateInstance && dateInstance <= endDateInstance;
  });
};
