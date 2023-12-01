import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  const defaultTestId = 'adelco-button';

  it('Should render component', () => {
    render(<Button onClick={() => null}>click me</Button>);

    expect(screen.queryByText(/click me/)).toBeInTheDocument();
  });

  it('Should render small button', () => {
    render(
      <Button onClick={() => null} size="xs">
        click me
      </Button>
    );

    const element = screen.getByTestId(defaultTestId);
    const classList = element.getAttribute('class');

    // Height
    expect(classList).toContain('h-btn-xs-mobile');
    expect(classList).toContain('tablet:h-btn-xs-tablet');
    expect(classList).toContain('desktop:h-btn-xs-desktop');

    // Font size
    expect(classList).toContain('text-xs');

    // Border
    expect(classList).toContain('rounded-2xl');
    expect(classList).toContain('tablet:rounded-4xl');
  });

  it('Should render medium button', () => {
    render(
      <Button onClick={() => null} size="sm">
        click me
      </Button>
    );
    const element = screen.getByTestId(defaultTestId);
    const classList = element.getAttribute('class');

    // Height
    expect(classList).toContain('h-btn-sm-mobile');
    expect(classList).toContain('tablet:h-btn-sm-tablet');
    expect(classList).toContain('desktop:h-btn-sm-desktop');

    // Font size
    expect(classList).toContain('text-xs');
    expect(classList).toContain('tablet:text-sm');

    // Border
    expect(classList).toContain('rounded-3xl');
    expect(classList).toContain('tablet:rounded-4xl');
  });

  it('Should render large button', () => {
    render(
      <Button onClick={() => null} size="md">
        click me
      </Button>
    );

    const element = screen.getByTestId(defaultTestId);
    const classList = element.getAttribute('class');

    // Height
    expect(classList).toContain('h-btn-md-mobile');
    expect(classList).toContain('tablet:h-btn-md-tablet');
    expect(classList).toContain('desktop:h-btn-md-desktop');

    // Font size
    expect(classList).toContain('text-xs');
    expect(classList).toContain('tablet:text-base');

    // Border
    expect(classList).toContain('rounded-3xl');
    expect(classList).toContain('tablet:rounded-4xl');
  });

  it('Should execute onClick', () => {
    const action = jest.fn();
    render(<Button onClick={action}>click me</Button>);

    const button = screen.getByTestId(defaultTestId);

    fireEvent.click(button);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('Should render block button', () => {
    render(<Button onClick={() => null} block />);

    const button = screen.getByTestId(defaultTestId);

    expect(button.getAttribute('class')).toContain('w-full');
  });

  it('Should render md icon', async () => {
    render(<Button onClick={() => null} iconName="map" size="md" />);

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    // Icon
    expect(await screen.findByTestId('icon-map')).toBeInTheDocument();

    // Full rounded border
    expect(classList).toContain('rounded-full');

    // Width and Height equals
    expect(classList).toContain('w-btn-md-mobile');
    expect(classList).toContain('h-btn-md-mobile');

    expect(classList).toContain('tablet:h-btn-md-tablet');
    expect(classList).toContain('tablet:h-btn-md-tablet');

    expect(classList).toContain('desktop:h-btn-md-desktop');
    expect(classList).toContain('desktop:h-btn-md-desktop');
  });

  it('Should render sm icon', async () => {
    render(<Button onClick={() => null} iconName="map" size="sm" />);

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    // Icon
    expect(await screen.findByTestId('icon-map')).toBeInTheDocument();

    // Full rounded border
    expect(classList).toContain('rounded-full');

    // Width and Height equals
    expect(classList).toContain('w-btn-sm-mobile');
    expect(classList).toContain('h-btn-sm-mobile');

    expect(classList).toContain('tablet:h-btn-sm-tablet');
    expect(classList).toContain('tablet:h-btn-sm-tablet');

    expect(classList).toContain('desktop:h-btn-sm-desktop');
    expect(classList).toContain('desktop:h-btn-sm-desktop');
  });

  it('Should render xs icon', async () => {
    render(<Button onClick={() => null} iconName="map" size="xs" />);

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    // Icon
    expect(await screen.findByTestId('icon-map')).toBeInTheDocument();

    // Full rounded border
    expect(classList).toContain('rounded-full');

    // Width and Height equals
    expect(classList).toContain('w-btn-xs-mobile');
    expect(classList).toContain('h-btn-xs-mobile');

    expect(classList).toContain('tablet:h-btn-xs-tablet');
    expect(classList).toContain('tablet:h-btn-xs-tablet');

    expect(classList).toContain('desktop:h-btn-xs-desktop');
    expect(classList).toContain('desktop:h-btn-xs-desktop');
  });

  it('Should render loading icon', async () => {
    render(
      <Button onClick={() => null} iconName="map" loading={true}>
        button text
      </Button>
    );
    const spinner = await screen.findByTestId('icon-spinner');
    const map = await screen.findByTestId('icon-map');
    const text = screen.getByText(/button text/);
    const spinnerClassList = spinner.getAttribute('class');

    expect(spinner).toBeInTheDocument();

    expect(spinnerClassList).toContain('absolute');
    expect(spinnerClassList).toContain('fill-current');
    expect(map.getAttribute('class')).toContain('opacity-0');
    expect(text.getAttribute('class')).toContain('opacity-0');
  });

  it('Should apply color to icon', async () => {
    render(
      <Button onClick={() => null} iconName="map">
        button text
      </Button>
    );
    const map = await screen.findByTestId('icon-map');

    expect(map.getAttribute('class')).toContain('fill-current');
  });

  it('Should render primary styles', () => {
    render(
      <Button onClick={() => null} variant="primary">
        button text
      </Button>
    );

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    expect(classList).toContain('text-corporative-02');
    expect(classList).toContain('bg-corporative-01');
    expect(classList).toContain('hover:text-corporative-03');
    expect(classList).toContain('hover:bg-corporative-01-hover');
    expect(classList).toContain('active:bg-corporative-01');
    expect(classList).toContain('focus:ring');
    expect(classList).toContain('focus:ring-inset');
    expect(classList).toContain('focus:ring-corporative-01-hover');
    expect(classList).toContain('disabled:bg-corporative-01');
    expect(classList).toContain('disabled:opacity-30');
  });

  it('Should render secondary styles', () => {
    render(
      <Button onClick={() => null} variant="secondary">
        button text
      </Button>
    );

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    expect(classList).toContain('text-white');
    expect(classList).toContain('bg-corporative-03');
    expect(classList).toContain('hover:bg-corporative-02-hover');
    expect(classList).toContain('active:bg-corporative-02');
    expect(classList).toContain('focus:ring');
    expect(classList).toContain('focus:ring-inset');
    expect(classList).toContain('focus:ring-corporative-02-hover');
    expect(classList).toContain('disabled:bg-corporative-02');
    expect(classList).toContain('disabled:opacity-30');
  });

  it('Should render tertiary styles', () => {
    render(
      <Button onClick={() => null} variant="tertiary">
        button text
      </Button>
    );

    const button = screen.getByTestId(defaultTestId);
    const classList = button.getAttribute('class');

    expect(classList).toContain('text-corporative-02');
    expect(classList).toContain('bg-white');
    expect(classList).toContain('ring-1');
    expect(classList).toContain('ring-inset');
    expect(classList).toContain('ring-silver');
    expect(classList).toContain('focus:ring-corporative-02');
    expect(classList).toContain('disabled:text-corporative-02');
    expect(classList).toContain('disabled:opacity-30');
  });
});
