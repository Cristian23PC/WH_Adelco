import Card from './Card';

const ShippingInformation = ({ shippingAddress, deliveryDate }) => {
  return (
    <Card>
      <h3 className="mb-2.5">Información de entrega</h3>
      <div className="flex flex-col gap-2.5 text-xs">
        <div>
          <h5 className="mb-1">Dirección de entrega</h5>
          <p className="text-corporative-02-hover">{shippingAddress}</p>
        </div>
        <div>
          <h5 className="mb-1">Fecha de entrega</h5>
          <p className="text-corporative-02-hover">{deliveryDate}</p>
        </div>
      </div>
    </Card>
  );
};

export default ShippingInformation;
