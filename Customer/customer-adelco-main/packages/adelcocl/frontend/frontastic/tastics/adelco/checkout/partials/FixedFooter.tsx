import { Button } from '@adelco/web-components';

const FixedFooter = ({ onClick, isLoading, disabled }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full border border-snow bg-white p-4 tablet:hidden">
      <Button
        onClick={onClick}
        loading={isLoading}
        disabled={isLoading || disabled}
        block
      >
        Crear pedido
      </Button>
    </div>
  );
};

export default FixedFooter;
