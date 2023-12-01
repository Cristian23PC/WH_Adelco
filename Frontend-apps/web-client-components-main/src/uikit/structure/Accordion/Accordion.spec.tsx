import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Accordion from './Accordion';

describe('Accordion', () => {
  it('Should render', async () => {
    const title = 'Accordion title';
    const content = 'Accordion content';

    render(
      <Accordion open={false} title={title}>
        {content}
      </Accordion>
    );

    expect(await screen.findByTestId('icon-arrow_s_down')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('Should render open', async () => {
    const title = 'Accordion title';
    const content = 'Accordion content';

    render(
      <Accordion open title={title}>
        {content}
      </Accordion>
    );

    const accordion = screen.getByTestId('adelco-accordion');

    expect(accordion).toHaveClass('max-h-[500vh]');
    expect(accordion.children[0]).toHaveClass('font-semibold');

    expect(screen.getByText(title).children[0]).toHaveClass('rotate-180');
  });

  it('Should render closed', async () => {
    const title = 'Accordion title';
    const content = 'Accordion content';

    render(
      <Accordion open={false} title={title}>
        {content}
      </Accordion>
    );

    const accordion = screen.getByTestId('adelco-accordion');

    expect(accordion).toHaveClass('max-h-[46px]');
    expect(accordion.children[0]).not.toHaveClass('font-semibold');

    expect(screen.getByText(title).children[0]).not.toHaveClass('rotate-180');
  });

  it('Should execute onClick', async () => {
    const title = 'Accordion title';
    const content = 'Accordion content';
    const onClick = jest.fn();

    render(
      <Accordion open={false} title={title} onClick={onClick}>
        {content}
      </Accordion>
    );

    const accordion = screen.getByText(title);

    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(accordion);
    expect(onClick).toHaveBeenCalled();
  });
});
