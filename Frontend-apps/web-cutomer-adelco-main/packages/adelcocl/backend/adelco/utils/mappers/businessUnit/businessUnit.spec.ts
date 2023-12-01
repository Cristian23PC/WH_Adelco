import { formatZoneLabel } from './businessUnit';
import { ZoneLabels } from '@Types/adelco/user';

describe('formatZoneLabel', () => {
  it('should format the zone label correctly', () => {
    const zoneLabels: ZoneLabels = {
      regionLabel: 'Region Label',
      communeLabel: 'Commune Label',
      deliveryZoneLabel: 'Delivery Zone Label',
    };

    const expectedFormattedLabel = 'Delivery Zone Label, Comuna de Commune Label, Region Region Label';

    const formattedLabel = formatZoneLabel(zoneLabels);

    expect(formattedLabel).toBe(expectedFormattedLabel);
  });

  it('should format the zone label correctly when delivery zone label is the same as commune label', () => {
    const zoneLabels: ZoneLabels = {
      regionLabel: 'Region Label',
      communeLabel: 'Commune Label',
      deliveryZoneLabel: 'Commune Label',
    };

    const expectedFormattedLabel = 'Commune Label, Region Region Label';

    const formattedLabel = formatZoneLabel(zoneLabels);

    expect(formattedLabel).toBe(expectedFormattedLabel);
  });
});
