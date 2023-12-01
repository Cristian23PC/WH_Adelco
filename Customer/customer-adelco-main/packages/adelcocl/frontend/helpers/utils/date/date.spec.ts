import { getEarlyDateItem, formatDateTime, formatDeliveryDates } from './';

describe('getEarlyDateItem', () => {
  it('should return the item with the earliest start date', () => {
    const dateArray = [
      {
        startDateTime: '2023-10-26T12:30:36.683Z',
        endDateTime: '2023-10-19T12:30:36.683Z'
      },
      {
        startDateTime: '2023-10-19T12:30:36.683Z',
        endDateTime: '2023-10-26T12:30:36.683Z'
      },
      {
        startDateTime: '2023-11-02T12:30:36.683Z',
        endDateTime: '2023-11-02T12:30:36.683Z'
      }
    ];

    const earliestItem = getEarlyDateItem(dateArray);

    expect(earliestItem.startDateTime).toBe('2023-10-19T12:30:36.683Z');
  });

  it('should return null for an empty dateArray', () => {
    const dateArray = [];

    const earliestItem = getEarlyDateItem(dateArray);

    expect(earliestItem).toBeNull();
  });
});

describe('formatDateTime', () => {
  it('should format a date as "weekday MM/DD/YYYY"', () => {
    const date = '2023-10-19T12:30:36.683Z';
    const formattedDate = formatDateTime(date);

    expect(formattedDate).toBe('Jueves 19/10/2023');
  });
});

describe('formatDeliveryDates', () => {
  it('should format delivery dates on the same day', () => {
    const deliveryDate = {
      startDateTime: '2023-10-19T12:30:36.683Z',
      endDateTime: '2023-10-19T16:30:36.683Z'
    };

    const formattedDates = formatDeliveryDates(deliveryDate);

    expect(formattedDates).toBe('Jueves 19/10/2023');
  });

  it('should format delivery dates spanning multiple days', () => {
    const deliveryDate = {
      startDateTime: '2023-10-19T12:30:36.683Z',
      endDateTime: '2023-10-20T12:30:36.683Z'
    };

    const formattedDates = formatDeliveryDates(deliveryDate);

    expect(formattedDates).toBe('Entre Jueves 19/10/2023 y Viernes 20/10/2023');
  });
});
