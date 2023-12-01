import { ApiError } from '@/common/errors/api.error';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { getNextDeliveryDates } from '@adelco/lib_delivery';
import { dateExistInNextDeliveryDates } from '@/svc-business-units/utils/delivery-date';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { AdelcoCart } from '@adelco/price-calc';

const MAX_DELIVERY_DATE_OPTIONS = 5;
const TIME_REGEX = /(?<day>\d{1,2})\/\d{1,2}\/\d{4}, (?<hours>\d{1,2}):(?<minutes>\d{1,2}):\d{1,2}/;

interface MinutesForDay {
  minutes: number;
  day: string;
}

@Injectable()
export class SvcCartsService {
  constructor(private readonly configService: ConfigService, private readonly deliveryZonesService: DeliveryZonesService) {}

  private baseUrl = this.configService.get('svc-carts.baseUrl');

  async getActiveCart(businessUnitId: string, username: string, roles: string[], forceUpdate = false): Promise<AdelcoCart> {
    const response = await fetch(`${this.baseUrl}/business-unit/${businessUnitId}/carts/active?forceUpdate=${forceUpdate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': username,
        'x-user-roles': JSON.stringify(roles)
      }
    });
    const data = await response.json();

    if (data.statusCode) {
      throw new ApiError({
        status: data.statusCode,
        message: data.message,
        code: data?.code
      });
    }

    return data;
  }

  async checkAndGetDeliveryDateForCart(deliveryZoneKey: string, deliveryDate: string, validateDate = true): Promise<string> {
    let deliveryDateToSet = deliveryDate;
    const deliveryZone = await this.deliveryZonesService.getT2Zone(deliveryZoneKey);
    const utcOffset = this.calculateSantiagoUtcOffsetInMinutes();

    const nextDeliveryDates = getNextDeliveryDates(deliveryZone.value, MAX_DELIVERY_DATE_OPTIONS, utcOffset);

    if (!nextDeliveryDates.deliveryDates.length) {
      throw ErrorBuilder.buildError('doesNotHaveNextDeliveryDates');
    }

    const shouldSetDateToCart = !deliveryDate || (validateDate && !dateExistInNextDeliveryDates(deliveryDate, nextDeliveryDates.deliveryDates));

    if (shouldSetDateToCart) {
      deliveryDateToSet = nextDeliveryDates.deliveryDates[0].startDateTime;
    }
    return deliveryDateToSet;
  }

  private getMinutesFromFormattedDate(formattedDate: string): MinutesForDay {
    const { day, hours, minutes } = TIME_REGEX.exec(formattedDate).groups;

    return {
      minutes: Number.parseInt(hours) * 60 + Number.parseInt(minutes),
      day
    };
  }

  private calculateSantiagoUtcOffsetInMinutes(): number {
    const now = new Date();
    const nowWithSantiagoOffset = now.toLocaleString('es', { timeZone: 'America/Santiago' });
    const { day, minutes } = this.getMinutesFromFormattedDate(nowWithSantiagoOffset);

    const nowWithoutOffset = now.toLocaleString('es', { timeZone: 'Etc/GMT0' });
    const { day: utcDay, minutes: utcMinutes } = this.getMinutesFromFormattedDate(nowWithoutOffset);

    if (day === utcDay) {
      return minutes - utcMinutes;
    } else {
      return minutes - 24 * 60 - utcMinutes;
    }
  }
}
