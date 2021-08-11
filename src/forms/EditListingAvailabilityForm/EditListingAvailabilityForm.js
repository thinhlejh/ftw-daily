import React, { Component, useEffect } from 'react';
import { bool, func, object, string } from 'prop-types';
import { compose } from 'redux';
import  { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { intlShape, injectIntl, FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { propTypes } from '../../util/types';
import { Form, Button } from '../../components';
import { availabilityConfig } from '../../marketplace-custom-config';

import css from './EditListingAvailabilityForm.module.css';
import FieldSelectTimeRange from './FieldSelectTimeRange';
import DurationSelectFieldMaybe from './DurationSelectFieldMaybe';

export class EditListingAvailabilityFormComponent extends Component {
  render() {
    return (
      <FinalForm
        {...this.props}
        mutators={{ ...arrayMutators }}
        render={formRenderProps => {
          const {
            className,
            rootClassName,
            disabled,
            ready,
            intl,
            handleSubmit,
            invalid,
            pristine,
            dirtyFields,
            saveActionMsg,
            updated,
            updateError,
            updateInProgress,
            durations,
            values,
            form
          } = formRenderProps;

          const errorMessage = updateError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingAvailabilityForm.updateFailed" />
            </p>
          ) : null;

          const { duration } = values;
          const classes = classNames(rootClassName || css.root, className);
          const submitReady = (updated && pristine) || ready;
          const submitInProgress = updateInProgress;
          const submitDisabled = invalid || disabled || submitInProgress;

          useEffect(() => {
            if (dirtyFields.duration) {
              form.reset({
                duration,
                daysOfWeek: [],
                mon: [{
                  startTime: null,
                  endTime: null,
                }],
                tue: [{
                  startTime: null,
                  endTime: null,
                }],
                wed: [{
                  startTime: null,
                  endTime: null,
                }],
                thu: [{
                  startTime: null,
                  endTime: null,
                }],
                fri: [{
                  startTime: null,
                  endTime: null,
                }],
                sat: [{
                  startTime: null,
                  endTime: null,
                }],
                sun: [{
                  startTime: null,
                  endTime: null,
                }],
              });
            }
          }, [dirtyFields]);

          return (
            <Form className={classes} onSubmit={handleSubmit}>
              {errorMessage}

              <DurationSelectFieldMaybe
                id="duration"
                name="duration"
                durations={durations}
                intl={intl}
              />
              <FieldSelectTimeRange
                duration={parseInt(duration)}
                label={intl.formatMessage({ id: 'FieldSelectTimeRange.label' })}
                options={availabilityConfig} />

              <Button
                className={css.submitButton}
                type="submit"
                inProgress={submitInProgress}
                disabled={submitDisabled}
                ready={submitReady}
              >
                {saveActionMsg}
              </Button>
            </Form>
          );
        }}
      />
    );
  }
}

EditListingAvailabilityFormComponent.defaultProps = {
  updateError: null,
};

EditListingAvailabilityFormComponent.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateError: propTypes.error,
  updateInProgress: bool.isRequired,
  availability: object.isRequired,
  availabilityPlan: propTypes.availabilityPlan.isRequired,
};

export default compose(injectIntl)(EditListingAvailabilityFormComponent);
