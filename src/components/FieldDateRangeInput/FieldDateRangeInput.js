/**
 * Provides a date picker for Final Forms (using https://github.com/airbnb/react-dates)
 *
 * NOTE: If you are using this component inside BookingDatesForm,
 * you should convert value.date to start date and end date before submitting it to API
 */

import React, { Component } from 'react';
import { bool, string, arrayOf } from 'prop-types';
import classNames from 'classnames';
import { propTypes } from '../../util/types';

import DateRangeInput from './DateRangeInput';
import css from './FieldDateRangeInput.module.css';
import { FormattedMessage } from 'react-intl/dist/react-intl';
import { getGMT } from '../../util/dates';

const MAX_MOBILE_SCREEN_WIDTH = 768;

class FieldDateRangeInputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { focusedInput: null };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Update focusedInput in case a new value for it is
    // passed in the props. This may occur if the focus
    // is manually set to the date picker.
    if (this.props.focusedInput && this.props.focusedInput !== prevProps.focusedInput) {
      this.setState({ focusedInput: this.props.focusedInput });
    }
  }

  handleBlur(focusedInput) {
    this.setState({ focusedInput: null });
    this.props.input.onBlur(focusedInput);
    // Notify the containing component that the focused
    // input has changed.
    if (this.props.onFocusedInputChange) {
      this.props.onFocusedInputChange(null);
    }
  }

  handleFocus(focusedInput) {
    this.setState({ focusedInput });
    this.props.input.onFocus(focusedInput);
  }

  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      rootClassName,
      unitType,
      startDateId,
      startDateLabel,
      endDateId,
      availableTimesLabel,
      // input,
      // meta,
      useMobileMargins,
      // Extract focusedInput and onFocusedInputChange so that
      // the same values will not be passed on to subcomponents.
      // focusedInput,
      // onFocusedInputChange,
      values,
      format,
      ...rest
    } = this.props;
    /* eslint-disable no-unused-vars */
    const { timeSlots = [] } = rest;

    const providerGMTLabel = timeSlots && timeSlots[0] ? (
      <span className={classNames(css.providerTime)} >
        <FormattedMessage
          id="ListingPage.providerTimezone"
          values={{gmt: getGMT(timeSlots[0].attributes.start)}} 
        />
      </span>
    ): null;

    if (startDateLabel && !startDateId) {
      throw new Error('startDateId required when a startDateLabel is given');
    }

    if (availableTimesLabel && !endDateId) {
      throw new Error('endDateId required when a endDateLabel is given');
    }

    // If startDate is valid label changes color and bottom border changes color too
    // const startDateIsValid = value && value.startDate instanceof Date;
    const startDateLabelClasses = classNames(css.startDateLabel, {
      [css.labelSuccess]: false, //startDateIsValid,
    });

    // If endDate is valid label changes color and bottom border changes color too
    // const endDateIsValid = value && value.endDate instanceof Date;
    const endDateLabelClasses = classNames(css.endDateLabel, {
      [css.labelSuccess]: false, //endDateIsValid,
    });

    const label =
      startDateLabel && availableTimesLabel ? (
        <div className={classNames(css.labels, { [css.mobileMargins]: useMobileMargins })}>
          <label className={startDateLabelClasses} htmlFor={startDateId}>
            {startDateLabel}
          </label>
          <label className={endDateLabelClasses} htmlFor={endDateId}>
            {availableTimesLabel}
          </label>
        </div>
      ) : null;

    // eslint-disable-next-line no-unused-vars
    const inputProps = {
      unitType,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      useMobileMargins,
      readOnly: typeof window !== 'undefined' && window.innerWidth < MAX_MOBILE_SCREEN_WIDTH,
      ...rest,
    };
    const classes = classNames(rootClassName || css.fieldRoot, className);

    return (
      <div className={classes}>
        {label}
        <DateRangeInput {...inputProps} />
        <div
          className={classNames(css.inputBorders, {
            [css.mobileMargins]: useMobileMargins && !this.state.focusedInput,
          })}
        >
        {providerGMTLabel}
        </div>
      </div>
    );
  }
}

FieldDateRangeInputComponent.defaultProps = {
  className: null,
  rootClassName: null,
  useMobileMargins: false,
  timeSlots: null,
};

FieldDateRangeInputComponent.propTypes = {
  className: string,
  rootClassName: string,
  unitType: propTypes.bookingUnitType.isRequired,
  useMobileMargins: bool,
  timeSlots: arrayOf(propTypes.timeSlot),
};

const FieldDateRangeInput = props => {
  return <FieldDateRangeInputComponent {...props} />;
};

export { DateRangeInput };
export default FieldDateRangeInput;
