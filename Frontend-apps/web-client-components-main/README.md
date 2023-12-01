# Getting Started

This is the Adelco Web Components Repository for UI Kit and Frontastic Components.

## Installation

```
yarn add @adelco/web-components
```

or

```
npm --save install @adelco/web-components
```

Additionally install the peer dependencies (if not present)

```
yarn add react
```

or

```
npm --save install react
```

## Usage

Import the components theme from the npm package in the app main file

```jsx
import "@adelco/web-components/dist/adelco.css";
...
```

Import and using the components

```jsx
import { Button } from '@adelco/web-components';

const Example = () => {
  return (
    <div>
      <Button variant="primary">Primary Button</Button>
    </div>
  );
};

export default Example;
```

## Available components

Work in progress ...
