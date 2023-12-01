/* eslint-disable react-hooks/exhaustive-deps */
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
import { useModal } from '../../hooks/use-modal';
import { Modal, Loader } from '../../components';
import {
  TApplicationContext,
  useApplicationContext,
} from '@commercetools-frontend/application-shell-connectors';
import ContentModal from '../../components/modal-content';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { Pagination } from '@commercetools-uikit/pagination';
import { useDataTable } from '../../hooks/use-data-table/use-data-table';
import { EHttpStatus } from '../../common/enums/http-status.enum';
import { EStatusModal, IChannels, IError } from './interfaces/prices';

const Prices = () => {
  const { isModalOpen, modalToggle } = useModal();
  const { page, perPage } = usePaginationState();
  const { rows, allRows, setAllRows, columns, setColumns } = useDataTable(
    page.value,
    perPage.value
  );
  const [modalContent, setModalContent] = useState({
    title: '',
    description: '',
    status: EStatusModal.SUCCESS,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('Cargando...');
  const [file, setFile] = useState<File | null>(null);
  const [channels, setChannels] = useState<IChannels[]>([]);
  const { channelsPaginatedResult } = useChannelsFetcher();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const bulkImportUrl = useApplicationContext(
    (context: TApplicationContext<{ bulkImportUrl: string }>) =>
      context.environment.bulkImportUrl
  );

  const handleCleanState = () => {
    setFile(null);
    setColumns([]);
    setAllRows([]);
  };

  const formik = useFormik({
    initialValues: {
      distributionChannel: undefined,
    },
    validate,
    onSubmit: async (formikValues, { resetForm }) => {
      try {
        setLoadingTitle('Cargando...');
        setIsLoading(true);
        const filename =
          formikValues.distributionChannel +
          '_' +
          new Date().getTime() +
          '.csv';
        const formData = new FormData();
        const fileToUpload = new File([file as File], filename, {
          type: file?.type,
        });

        formData.append('file', fileToUpload);

        const result = await PricesService.updatePrices(
          bulkImportUrl,
          formData
        );

        if (result.statusCode !== EHttpStatus.Created) {
          throw new Error();
        }
        setIsLoading(false);
        setModalContent({
          title: 'Éxito',
          description: 'Tu solicitud ha sido procesada con éxito.',
          status: EStatusModal.SUCCESS,
        });

        modalToggle();
        resetForm();
        handleCleanState();
      } catch (error) {
        console.log('error', error);
        const message =
          ((error as IError).response.status === EHttpStatus.NotAcceptable &&
            'Verifique los nombres de las columnas') ||
          'Ha ocurrido un error al procesar tu archivo, vuelva a intentarlo más tarde.';
        setModalContent({
          title: 'Error',
          description: message,
          status: EStatusModal.ERROR,
        });
        modalToggle();
        setIsLoading(false);
      }
    },
  });

  const handleOnChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if ((e.target.files?.length || 0) < 1 || !e.target.files) return;
    setFile(e.target.files[0]);
  };

  const handleClick = () => {
    if (!hiddenFileInput.current) return;
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (file) {
      setLoadingTitle('Cargando archivo...');
      setIsLoading(true);
      Papa.parse(file as never, {
        header: true,
        complete: (results) => {
          setAllRows(
            results.data.map((item: any, index) => ({
              id: index + 1,
              ...item,
            })) as unknown as SetStateAction<never[]>
          );
        },
        skipEmptyLines: true,
      });
    }
  }, [file]);

  useEffect(() => {
    if (allRows[0]) {
      const keys = Object.keys(allRows[0]);
      const columnsFormatted = keys.map((key) => ({ key, label: key }));
      setColumns(columnsFormatted as unknown as SetStateAction<never[]>);
      setIsLoading(false);
    }
  }, [allRows]);

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
    <>
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
              label={file ? file.name : 'Seleccionar archivo'}
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
                <Pagination
                  page={page.value}
                  onPageChange={page.onChange}
                  perPage={perPage.value}
                  onPerPageChange={perPage.onChange}
                  totalItems={allRows.length}
                />
              </>
            )}
          </Spacings.Stack>
        </Spacings.Stack>
      </Constraints.Horizontal>
      <Modal isOpen={isModalOpen}>
        <ContentModal
          title={modalContent.title}
          description={modalContent.description}
          handleAction={() => {
            if (modalContent.status === EStatusModal.SUCCESS) {
              window.location.reload();
            }
            modalToggle();
          }}
          handleClose={() => modalToggle()}
          actionButtonLabel="Aceptar"
        />
      </Modal>
      <Loader isOpen={isLoading} title={loadingTitle} />
    </>
  );
};
Prices.displayName = 'Prices';
export default Prices;
