import { Icon, Dropdown } from '@adelco/web-components';
import Card from './Card';
import usePaymentMethods from 'frontastic/actions/adelco/cart/usePaymentMethods';
import { useEffect, useState } from 'react';

type OptionObject = {
  value: string;
  label: string;
};

interface Props {
  onChange: (data: string) => void;
  value?: string;
}

const PaymentMethod = ({ onChange, value }) => {
  const { data } = usePaymentMethods();
  const [options, setOptions] = useState<OptionObject[]>([]);

  useEffect(() => {
    if (data?.paymentMethods.length) {
      setOptions(
        data.paymentMethods.map((method) => ({
          value: method.key,
          label: method.description
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (options.length === 1) {
      onChange(options[0].value, false);
    }
  }, [options]);

  return (
    <Card className="flex flex-col gap-2.5">
      <h3>Método de pago</h3>
      <div>
        <Dropdown options={options} onChange={onChange} value={value} />
      </div>
      <div className="flex items-center gap-2 text-xs">
        <Icon
          className="fill-current text-corporative-01"
          name="sales_outline"
        />
        <span>Pago contra entrega</span>
      </div>
    </Card>
  );
};

export default PaymentMethod;
