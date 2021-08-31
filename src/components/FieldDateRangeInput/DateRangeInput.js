/**
 * DateRangeInput wraps DateRangePicker from React-dates and gives a list of all default props we use.
 * Styles for DateRangePicker can be found from 'public/reactDates.css'.
 *
 * N.B. *isOutsideRange* in defaultProps is defining what dates are available to booking.
 */
import React, { Component } from 'react';
import { bool, func, instanceOf, oneOf, shape, string, arrayOf, object } from 'prop-types';
import { isInclusivelyAfterDay, isInclusivelyBeforeDay, SingleDatePicker } from 'react-dates';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import moment from 'moment';
import { START_DATE, END_DATE, dateFromAPIToLocal } from '../../util/dates';
import { propTypes } from '../../util/types';
import config from '../../config';
import {
  filterAvailableTimeSlots,
  isDateBlocked,
  isOutside,
} from './DateRangeInput.helpers';

import { IconArrowHead } from '../../components';
import css from './DateRangeInput.module.css';
import FieldSelect from '../FieldSelect/FieldSelect';

export const HORIZONTAL_ORIENTATION = 'horizontal';
export const ANCHOR_LEFT = 'left';

// Since final-form tracks the onBlur event for marking the field as
// touched (which triggers possible error validation rendering), only
// trigger the event asynchronously when no other input within this
// component has received focus.
//
// This prevents showing the validation error when the user selects a
// value and moves on to another input within this component.
const BLUR_TIMEOUT = 100;

// IconArrowHead component might not be defined if exposed directly to the file.
// This component is called before IconArrowHead component in components/index.js
const PrevIcon = props => (
  <IconArrowHead {...props} direction="left" rootClassName={css.arrowIcon} />
);
const NextIcon = props => (
  <IconArrowHead {...props} direction="right" rootClassName={css.arrowIcon} />
);

// Possible configuration options of React-dates
const defaultProps = {
  initialDates: null, // Possible initial date passed for the component
  value: null, // Value should keep track of selected date.

  // input related props
  disabled: false,
  required: false,
  readOnly: false,
  screenReaderInputMessage: null, // Handled inside component
  showDefaultInputIcon: false,
  // customArrowIcon: <span />,
  customInputIcon: null,
  customCloseIcon: null,
  noBorder: true,
  block: false,

  // calendar presentation and interaction related props
  renderMonthText: null,
  numberOfMonths: 1,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  appendToBody: false,
  disableScroll: false,
  daySize: 38,
  isRTL: false,
  initialVisibleMonth: null,
  firstDayOfWeek: config.i18n.firstDayOfWeek,
  numberOfMonths: 1,
  keepOpenOnDateSelect: false,
  renderCalendarInfo: null,
  hideKeyboardShortcutsPanel: true,

  // navigation related props
  navPrev: <PrevIcon />,
  navNext: <NextIcon />,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  transitionDuration: 200, // milliseconds between next month changes etc.

  renderCalendarDay: undefined, // If undefined, renders react-dates/lib/components/CalendarDay
  // day presentation and interaction related props
  renderDayContents: day => {
    return <span className="renderedDay">{day.format('D')}</span>;
  },
  enableOutsideDays: false,
  isDayBlocked: () => false,

  // outside range -><- today ... today+available days -1 -><- outside range
  isOutsideRange: day => {
    const endOfRange = config.dayCountAvailableForBooking - 1;
    return (
      !isInclusivelyAfterDay(day, moment()) ||
      !isInclusivelyBeforeDay(day, moment().add(endOfRange, 'days'))
    );
  },
  isDayHighlighted: () => {},

  // Internationalization props
  // Multilocale support can be achieved with displayFormat like moment.localeData.longDateFormat('L')
  // https://momentjs.com/
  monthFormat: 'MMMM YYYY',
  weekDayFormat: 'dd',
  phrases: {
    closeDatePicker: null, // Handled inside component
    clearDate: null, // Handled inside component
  },
};

class DateRangeInputComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      currentStartDate: null,
      selectedDate: moment(),
      focused: null,
    };

    this.blurTimeoutId = null;
    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (this.props.focusedInput && this.props.focusedInput !== prevProps.focusedInput) {
      this.setState({ focusedInput: this.props.focusedInput });
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.blurTimeoutId);
  }

  onDatesChange(date) {
    this.props.form.change('selectedTimeSlotId', filterAvailableTimeSlots(this.props.timeSlots, date)[0].id.uuid);
    this.setState(() => ({
      selectedDate: date,
    }));
  }

  onFocusChange(focusedInput) {
    // DateRangePicker requires 'onFocusChange' function and 'focusedInput'
    // but Fields of React-Form deals with onFocus & onBlur instead
    this.setState({ focusedInput });

    if (focusedInput) {
      window.clearTimeout(this.blurTimeoutId);
      this.props.onFocus(focusedInput);
    } else {
      window.clearTimeout(this.blurTimeoutId);
      this.blurTimeoutId = window.setTimeout(() => {
        this.props.onBlur();
      }, BLUR_TIMEOUT);
    }
  }

  render() {
    const {
      className,
      unitType,
      initialDates,
      intl,
      name,
      startDatePlaceholderText,
      endDatePlaceholderText,
      onBlur,
      onChange,
      onFocus,
      phrases,
      screenReaderInputMessage,
      useMobileMargins,
      value,
      children,
      render,
      timeSlots,
      validate,
      form,
      ...datePickerProps
    } = this.props;

    const isDayBlocked = isDateBlocked(timeSlots);
    const isOutsideRange = isOutside(timeSlots);

    const placeholder =
      startDatePlaceholderText ||
      intl.formatMessage({ id: 'FieldDateRangeInput.startDatePlaceholderText' });

    const classes = classNames(css.inputRoot, className, {
      [css.withMobileMargins]: useMobileMargins,
    });

    const availableTimes = filterAvailableTimeSlots(timeSlots, this.state.selectedDate);

    return (
        <div className={classes}>
          <SingleDatePicker
            {...datePickerProps}
            date={this.state.selectedDate}
            onDateChange={this.onDatesChange}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            id='date'
            placeholder={placeholder}
            isDayBlocked={isDayBlocked}
            isOutsideRange={isOutsideRange}
          />
          {availableTimes?.length > 0 ? (
            <FieldSelect validate={validate} rootClassName={css.fieldSelect} id="selectedTimeSlotId" name="selectedTimeSlotId">
              {availableTimes.map(
                s => (
                  <option value={s.id.uuid} key={s.id.uuid}>
                    {moment(dateFromAPIToLocal(s.attributes.start)).format('hh:mm A')}
                  </option>
                )
              )}
            </FieldSelect>
          ) : (
            <FormattedMessage id="ListingPage.emptyTimeSlot" />
          )}
        </div>
    );
  }
}

DateRangeInputComponent.defaultProps = {
  className: null,
  useMobileMargins: false,
  timeSlots: null,
  ...defaultProps,
};

DateRangeInputComponent.propTypes = {
  className: string,
  startDateId: string,
  endDateId: string,
  unitType: propTypes.bookingUnitType.isRequired,
  focusedInput: oneOf([START_DATE, END_DATE]),
  initialDates: instanceOf(Date),
  intl: intlShape.isRequired,
  isOutsideRange: func,
  phrases: shape({
    closeDatePicker: string,
    clearDate: string,
  }),
  useMobileMargins: bool,
  startDatePlaceholderText: string,
  endDatePlaceholderText: string,
  screenReaderInputMessage: string,
  form: object.isRequired,
  timeSlots: arrayOf(propTypes.timeSlot),
};

export default injectIntl(DateRangeInputComponent);
