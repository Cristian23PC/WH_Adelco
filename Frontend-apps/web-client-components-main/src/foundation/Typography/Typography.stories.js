import React from 'react';
import { withDesign } from 'storybook-addon-designs';

export default {
  title: 'Foundation/Typography',
  parameters: {
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true
      }
    }
  },
  decorators: [withDesign]
};

export const Typography = () => (
  <>
    <h1 className="font-title font-bold text-2xl mb-5">Typography</h1>
    <p className="mt-2">
      La tipografía nos ayuda a jerarquizar la información y el contenido en
      nuestras pantallas. En Adela System utilizamos dos familias tipográficas:
    </p>
    <p className="mt-2">
      <strong>Poppins</strong> para títulos y
    </p>
    <p className="mt-2">
      <strong>Manrope</strong> para cuerpos de texto, tanto para la comunicación
      interna como para la externa.
    </p>

    <h3 className="font-title font-bold text-xl my-5">Tamaños</h3>
    <p>Los dividimos en 3 dimensiones:</p>
    <p className="mt-2">
      <strong>Display</strong> - Para títulos sobredimensionados. Uso con
      moderación.
    </p>
    <p>
      <strong>Heading</strong> - Para títulos y subtítulos estándares.
    </p>
    <p>
      <strong>Body</strong> - Para el cuerpo de texto en general.
    </p>
    <p className="mt-2">
      El tamaño base definido para párrafos y cuerpos de texto es{' '}
      <strong>body/medium</strong>.
    </p>
    <p className="mt-2">
      Los estilos están agrupados de manera tal que se puedan hacer
      combinaciones correspondientes a su talla, es decir,{' '}
      <strong>heading/medium</strong> con el <strong>body/medium</strong> (esto
      es solo una recomendación).
    </p>
    <div className="p-5 bg-snow mt-8 rounded-lg">
      <table>
        <tr>
          <td className="w-96">
            <p className="font-title font-bold text-2xl mt-4">Limpieza</p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              heading / large / 24
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-title font-bold text-2xl
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="text-lg">
              Accesorios de aseo, cocina y baño, control plaga, limpia pisos y
              muebles, papeles tissue.
            </p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              body / large / 18
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-body text-lg
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="font-title font-bold text-xl1 mt-4">Limpieza</p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              heading / medium / 22
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-title font-bold text-xl1
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="text-base">
              Accesorios de aseo, cocina y baño, control plaga, limpia pisos y
              muebles, papeles tissue.
            </p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              body / medium / 16
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-body text-base
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="font-title font-bold text-xl mt-4">Limpieza</p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              heading / small / 20
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-title font-bold text-xl
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="text-sm">
              Accesorios de aseo, cocina y baño, control plaga, limpia pisos y
              muebles, papeles tissue.
            </p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              body / small / 14
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-body text-sm
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="font-title font-bold text-lg mt-4">Limpieza</p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              heading / xsmall / 18
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-title font-bold text-lg
            </p>
          </td>
        </tr>

        <tr>
          <td>
            <p className="text-xs">
              Accesorios de aseo, cocina y baño, control plaga, limpia pisos y
              muebles, papeles tissue.
            </p>
          </td>
          <td>
            <p className="font-body font-normal text-xs ml-4 text-system">
              body / xsmall / 12
            </p>
            <p className="font-body font-normal text-xs ml-4 text-nickel">
              Tailwind: font-body text-xs
            </p>
          </td>
        </tr>
      </table>
    </div>
    <h3 className="font-title font-bold text-xl my-5">Pesos</h3>
    <p>
      Manejamos distintos pesos tipográficos para poder definir jerarquías de
      información fácilmente. Para cada dimensión encontramos:
    </p>
    <p className="mt-2">
      <strong>Display</strong> - Extrabold, bold, semibold.
    </p>
    <p>
      <strong>Heading</strong> - Extrabold, bold, semibold.Body.
    </p>
    <p>
      <strong>Body</strong> - Extrabold, bold, semibold, regular.
    </p>
    <h3 className="font-title font-bold text-xl my-5">Decoración</h3>
    <p>
      Para los casos de <strong>body/small</strong> y{' '}
      <strong>body/xsmall </strong> manejamos las decoraciones: underline y
      strikethrough.
    </p>
    <h3 className="font-title font-bold text-xl my-5">Alineación</h3>
    <p>
      El texto siempre se debe utilizar alineado a la izquierda y nunca
      justificado, ya que eso genera espacios en el texto que pueden distraer y
      confundir. Existen excepciones cuando el párrafo de texto sea corto
      podremos usar entonces una alineación centrada de ser necesario.
    </p>
    <h3 className="font-title font-bold text-xl my-5">Color (por definir)</h3>
    <p>
      El color esta definido a partir del contexto en el que se encuentre
      (tokens). El color en un texto permite jerarquizar de manera correcta la
      información que queremos comunicar a nuestros usuarios.
    </p>
  </>
);

Typography.parameters = {
  design: {
    name: 'Figma Design',
    type: 'figma',
    url: 'https://www.figma.com/file/7whxbhNxoHmIC54XV4aCK7/Adela-System?node-id=78-274&viewport=3616%2C3616%2C0.03&t=6jP8yqZXk6OO3aRg-0'
  }
};
