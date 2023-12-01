export type DeliveryDate = {
  startDateTime: string;
  endDateTime: string;
};

export type DeliveryDates = DeliveryDate[];

export type DeliveryDatesResponse = { deliveryDates: DeliveryDates };
