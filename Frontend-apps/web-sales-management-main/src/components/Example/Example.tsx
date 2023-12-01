import { useState, FC } from 'react';
import { Button } from '@adelco/web-components';

export interface ExampleProps {
  onSubmit: (count: number) => void;
}

const Example: FC<ExampleProps> = ({ onSubmit }) => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        Count number: <span>{count}</span>
      </div>
      <div className="flex gap-4">
        <Button
          iconName="remove"
          onClick={() => setCount((prevState) => prevState - 1)}
          data-testid="dec-button"
        />
        <Button
          iconName="add"
          onClick={() => setCount((prevState) => prevState + 1)}
          data-testid="inc-button"
        />
      </div>
      <Button onClick={() => onSubmit(count)}>Submit</Button>
    </div>
  );
};

export default Example;
