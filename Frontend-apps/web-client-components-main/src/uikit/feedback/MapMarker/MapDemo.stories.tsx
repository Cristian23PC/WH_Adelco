import React from 'react';
import { type ComponentMeta, type ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import MapDemo from './MapDemo';
export default {
  title: 'Ui Kit/Feedback/MapMarker',
  component: MapDemo,
  decorators: [withDesign]
} as ComponentMeta<typeof MapDemo>;

const designParameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/J1KIL9QYoFafGo20Cu14yY/Management-Website?type=design&node-id=3663-106662&mode=design&t=DgsTH65C7GhHbwjl-4'
  }
};

const Template: ComponentStory<typeof MapDemo> = (args) => (
  <MapDemo
    className="h-screen"
    businessInfo={{
      name: 'Razón Social',
      tradeName: 'Nombre de la Tienda',
      rut: '4.963.298-3',
      address:
        'Monseñor Álvaro del Portillo 12455, Santiago, Las Condes. Región Metropolitana',
      territoryName: 'ZABC123',
      visitGroup: 'Mensual - C',
      visitDay: 'Martes',
      salesRepName: 'Juan Pérez',
      recentPurchases: true
    }}
    coordinates={[
      {
        lat: -33.4172,
        lng: -70.6306
      },
      {
        lat: -33.4772,
        lng: -70.6906
      },
      {
        lat: -33.3372,
        lng: -70.5506
      },
      {
        lat: -33.4972,
        lng: -70.6406
      },
      {
        lat: -33.4872,
        lng: -70.6196
      },
      {
        lat: -33.4372,
        lng: -70.6596
      },
      {
        lat: -33.4422,
        lng: -70.6196
      },
      {
        lat: -33.5072,
        lng: -70.6496
      },
      {
        lat: -33.9372,
        lng: -70.6106
      }
    ]}
  />
);

export const MapMarker = Template.bind({});
MapMarker.parameters = designParameters;
