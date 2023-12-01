import classNames from 'classnames';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={classNames(
        'rounded-lg border border-snow bg-white p-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
