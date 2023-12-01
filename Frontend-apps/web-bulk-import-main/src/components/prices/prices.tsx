/* eslint-disable @typescript-eslint/no-explicit-any */
import Constraints from '@commercetools-uikit/constraints';
import { useFormik } from 'formik';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import SelectInput from '@commercetools-uikit/select-input';
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Papa from 'papaparse';
import DataTable from '@commercetools-uikit/data-table';
import { validate } from './validate';
import { useChannelsFetcher } from '../../hooks/use-channels-connector';
import { PricesService } from '../../services/merchant-center/merchant-center.service';
interface IChannels {
  value: string;
  label: string;
}

const Prices = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [channels, setChannels] = useState<IChannels[]>([]);
  const { channelsPaginatedResult, error, loading } = useChannelsFetcher();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      distributionChannel: undefined,
    },
    validate,
    onSubmit: async (formikValues) => {
      try {
        const filename =
          formikValues.distributionChannel +
          '_' +
          new Date().getTime() +
          '.csv';

        const formData: any = new FormData();
        const fileToUpload = new File([file as File], filename, {
          type: file?.type,
        });

        formData.append('file', fileToUpload);

        await PricesService.updatePrices(formData);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOnChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleClick = () => {
    if (!hiddenFileInput.current) return;
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (file) {
      Papa.parse(file as never, {
        header: true,
        complete: (results) => {
          setRows(results.data as unknown as SetStateAction<never[]>);
        },
        skipEmptyLines: true,
      });
    }
  }, [file]);

  useEffect(() => {
    if (rows[0]) {
      const keys = Object.keys(rows[0]);
      const columnsFormatted = keys.map((key) => ({ key, label: key }));
      setColumns(columnsFormatted as unknown as SetStateAction<never[]>);
    }
  }, [rows]);

  useEffect(() => {
    if (channelsPaginatedResult?.results[0]) {
      const channelsFiltered = channelsPaginatedResult?.results.filter(
        (channel) => channel.roles[0] === 'InventorySupply'
      );
      const channelsFormatted = channelsFiltered.map((channel) => {
        const nameAllLocales = channel.nameAllLocales ?? [];
        const label = nameAllLocales[0].value || '';
        return {
          value: channel.key,
          label,
        };
      });
      setChannels(channelsFormatted);
    }
  }, [channelsPaginatedResult]);

  return (
    <Constraints.Horizontal max={16}>
      <Spacings.Stack scale="xl">
        <Text.Headline
          as="h1"
          intlMessage={{ id: '01101', defaultMessage: 'Precios' }}
        />

        <Spacings.Stack scale="l" data-testid="rows-state-setter">
          <SelectInput
            name="distributionChannel"
            value={formik.values.distributionChannel}
            onChange={formik.handleChange}
            options={channels}
          />
          <SecondaryButton
            id="upload-file-button"
            label="Seleccionar archivo"
            onClick={handleClick}
          />
          <input
            data-testid="input-file-hidden"
            type="file"
            ref={hiddenFileInput}
            name="csvFile"
            accept=".csv"
            onChange={handleOnChangeFile}
            hidden
          />
          <PrimaryButton
            onClick={formik.submitForm}
            label="Subir"
            isDisabled={!formik.isValid}
          />
          {rows[0] && (
            <>
              <DataTable rows={rows} columns={columns} />
            </>
          )}
        </Spacings.Stack>
      </Spacings.Stack>
    </Constraints.Horizontal>
  );
};

Prices.displayName = 'Prices';

export default Prices;
