import React, { useState, type FC, useRef, useEffect } from 'react';
import Calendar, { type CalendarProps } from 'react-calendar';
import { Icon } from '../../feedback';
import classNames from 'classnames';
import { areDatesEqual, dateToString } from './utils';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import SelectedDayFrame from './partials/SelectedDayFrame';

const DEFAULT_LITERALS = {
  placeholder: 'Fecha de visita',
  weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
};

export interface DatePickerProps {
  'data-testid'?: string;
  literals?: typeof DEFAULT_LITERALS;
  date?: Date;
  onChange: (date: Date | undefined) => void;
  allowPastDates?: boolean;
  align?: 'left' | 'center' | 'right';
}
const DatePicker: FC<DatePickerProps> = ({
  'data-testid': dataTestId = 'adelco-date-picker',
  literals = {},
  onChange,
  date,
  allowPastDates = false,
  align = 'center'
}) => {
  const [open, setOpen] = useState(false);
  const [alignmentStyle, setAlignmentStyle] = useState({});

  const datePickerRef = useRef(null);
  const datePickerButtonRef = useRef<HTMLButtonElement | null>(null);

  const toggleOpen = (): void => {
    setOpen((prev) => !prev);
  };

  useClickOutside([datePickerRef, datePickerButtonRef], toggleOpen, open);

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const handleChange = (newDate: CalendarProps['value']): void => {
    if (newDate instanceof Date) {
      onChange(newDate);
      toggleOpen();
    }
  };

  useEffect(() => {
    if (datePickerButtonRef.current) {
      const buttonWidth = datePickerButtonRef.current?.offsetWidth || 171;
      switch (align) {
        case 'center':
          setAlignmentStyle({ left: `${(buttonWidth - 220) / 2}px` });
          break;
        case 'left':
          setAlignmentStyle({ left: 0 });
          break;
        case 'right':
          setAlignmentStyle({ right: 0 });
      }
    }
  }, []);

  return (
    <div
      className="relative flex flex-col justify-center"
      data-testid={dataTestId}
    >
      <button
        type="button"
        className={classNames(
          'flex items-center w-full  mx-auto',
          'bg-snow py-2 px-4 leading-[19px] mb-2',
          'border-[1px] border-snow rounded-md',
          'outline outline-0 focus:outline-0',
          'text-sm text-left',
          {
            'shadow-lg': open,
            'font-bold': date
          }
        )}
        onClick={toggleOpen}
        ref={datePickerButtonRef}
      >
        <span className="truncate grow text-corporative-03">
          {date ? dateToString(date) : l.placeholder}
        </span>
        {!date && (
          <span
            className={classNames(
              'transition-all origin-center',
              open ? 'rotate-180' : 'rotate-0'
            )}
          >
            <Icon name="arrow_s_down" width={32} height={32} />
          </span>
        )}
        {date && (
          <Icon
            name="close"
            width={26}
            height={26}
            onClick={(e) => {
              onChange(undefined);
              e.stopPropagation();
            }}
            className="pointer-hand m-[3px]"
          />
        )}
      </button>
      <div
        className={classNames('mx-auto absolute top-14 z-10', {
          hidden: !open,
          show: open
        })}
        style={alignmentStyle}
      >
        <Calendar
          formatShortWeekday={(_, date) => l.weekdays[date.getDay()]}
          prevLabel={<Icon name="arrow_back" />}
          nextLabel={<Icon name="arrow_next" />}
          navigationLabel={({ date }) =>
            date.toLocaleString('es-CL', { month: 'long' })
          }
          tileContent={({ date: newDate }) => {
            if (areDatesEqual(newDate, date)) {
              return <SelectedDayFrame />;
            }
          }}
          onClickDay={handleChange}
          inputRef={datePickerRef}
          minDate={allowPastDates ? undefined : new Date()}
          minDetail="month"
          maxDetail="month"
          value={date}
        />
      </div>
    </div>
  );
};

export default DatePicker;
