import { FC, FormEventHandler, useState } from 'react';
import {
  Dropdown,
  OptionRadio,
  TextField,
  Switch,
  Button,
  Icon
} from '@adelco/web-components';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schedule } from '@/types/BUSalesProfile';
import useAssignBUSalesProfileSchedule from '@/hooks/BUSalesProfile/useAssignBUSalesProfileSchedule';
import scheduleOptions from './options.json';
import { mapFormToSchedule, mapScheduleToForm } from './utils';
import { type FormValues, type FormFields } from './types';
import { validationSchema } from './validationSchema';
import { generateVisits } from './estimation';

interface VisitPlannerProps {
  buid: number;
  schedule?: Schedule;
  onClose: () => void;
}

const VisitPlanner: FC<VisitPlannerProps> = ({ buid, schedule, onClose }) => {
  const {
    watch,
    register,
    setValue,
    formState: { isValid, isSubmitting }
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: schedule ? mapScheduleToForm(schedule) : { noVisit: false },
    mode: 'onSubmit'
  });
  const { assignSchedule, isLoading } = useAssignBUSalesProfileSchedule();

  const generateNextVisits = (): string[] => {
    const payload = mapFormToSchedule(watch());
    const nextVisits = generateVisits(payload.visitSchedule, 60).map(
      (visit) => {
        return visit.time.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    );

    return nextVisits;
  };

  const [nextVisits, setNextVisits] = useState<string[]>(
    schedule ? generateNextVisits : []
  );

  const resetFormFields = (fields: FormFields[]): void => {
    fields.forEach((field) => {
      setValue(field, undefined, {
        shouldDirty: true,
        shouldValidate: true
      });
    });
    setNextVisits([]);
  };

  const handleChangeFrequencyType = (frequencyType: string): void => {
    setValue('frequencyType', frequencyType as FormValues['frequencyType'], {
      shouldDirty: true,
      shouldValidate: true
    });

    setNextVisits(generateNextVisits());
  };

  const handleChangeNoVisit = (checked: boolean): void => {
    setValue('noVisit', checked, {
      shouldDirty: true,
      shouldValidate: true
    });
    if (checked) {
      resetFormFields([
        'frequencyType',
        'daySelector',
        'position',
        'biweeklyGroups',
        'monthlyGroups'
      ]);
      setNextVisits([]);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event?.preventDefault();
    const payload = mapFormToSchedule(watch());
    await assignSchedule({ id: buid, payload });
    onClose();
  };

  return (
    <>
      <div className="absolute right-4 top-4 z-100">
        <Icon name="close" onClick={onClose} width={30} height={30} />
      </div>
      <form
        className="flex w-[300px] flex-col gap-y-[26px]"
        onSubmit={handleSubmit}
      >
        <h2 className="font-bold text-lg text-corporative-03">
          Agenda de visita
        </h2>

        <div className="flex flex-col gap-y-4">
          <p className="font-semibold">Día</p>
          <div className="text-left">
            <Dropdown
              options={scheduleOptions.days}
              label="Seleccionar día"
              value={watch('daySelector')}
              onChange={(day: string) => {
                setValue('daySelector', day as FormValues['daySelector'], {
                  shouldDirty: true,
                  shouldValidate: true
                });
                setNextVisits(generateNextVisits());
              }}
              disabled={watch('noVisit')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <p className="font-semibold">Frecuencia</p>
          <div className="flex flex-col gap-2">
            {scheduleOptions.frequencyTypes.map((ftype) => (
              <OptionRadio
                label={ftype.label}
                key={ftype.value}
                value={ftype.value}
                name="frequencyType"
                checked={watch('frequencyType') === ftype.value}
                onChange={() => handleChangeFrequencyType(ftype.value)}
                disabled={watch('noVisit')}
              />
            ))}
          </div>
          {watch('frequencyType') === 'biweekly' && (
            <div className="text-left">
              <Dropdown
                options={scheduleOptions.groups.biweekly}
                label="Seleccionar grupo"
                value={watch('biweeklyGroups')}
                onChange={(day: string) => {
                  setValue(
                    'biweeklyGroups',
                    day as FormValues['biweeklyGroups'],
                    {
                      shouldDirty: true,
                      shouldValidate: true
                    }
                  );
                  setNextVisits(generateNextVisits());
                }}
                disabled={watch('noVisit')}
              />
            </div>
          )}
          {watch('frequencyType') === 'monthly' && (
            <div className="text-left">
              <Dropdown
                options={scheduleOptions.groups.monthly}
                label="Seleccionar grupo"
                value={watch('monthlyGroups')}
                onChange={(day: string) => {
                  setValue(
                    'monthlyGroups',
                    day as FormValues['monthlyGroups'],
                    {
                      shouldDirty: true,
                      shouldValidate: true
                    }
                  );
                  setNextVisits(generateNextVisits());
                }}
                disabled={watch('noVisit')}
              />
            </div>
          )}
          {nextVisits.length > 0 && (
            <div
              className={classNames(
                'flex gap-1 flex-col p-2',
                'rounded-lg border border-corporative-01 w-full bg-[#FFFDF3] text-left'
              )}
            >
              <div className="flex gap-2 items-center">
                <Icon
                  name="notification"
                  width={24}
                  height={24}
                  className="fill-corporative-01"
                />
                <p className="text-xs font-semibold">Próximas visitas</p>
              </div>
              <div className="flex flex-col gap-1 text-xs ms-6">
                {nextVisits.slice(0, 2).map((visit, index) => (
                  <span key={index}>{visit}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-4">
          <p className="font-semibold">Posición</p>
          <TextField
            id="position"
            type="number"
            label="Posición"
            {...register('position')}
            disabled={watch('noVisit')}
            min={0}
            max={1000}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-sm">Cliente sin visita</span>
          <Switch
            variant="md"
            checked={watch('noVisit')}
            onChange={(event) => {
              const checked = event.target.checked;
              handleChangeNoVisit(checked);
            }}
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={!isValid}
          type="submit"
          loading={isSubmitting || isLoading}
        >
          Guardar cambios
        </Button>
      </form>
    </>
  );
};

export default VisitPlanner;
