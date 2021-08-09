import React from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { getDefaultTimeZoneOnBrowser } from '../../util/dates';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '../../components';
import { EditListingAvailabilityForm } from '../../forms';

import css from './EditListingAvailabilityPanel.module.css';
import { mapValuesToEntries } from './EditListingAvailabilityPanel.helpers';

const defaultTimeZone = () => typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

const HOURS_PER_DAY = new Array(24).fill();

const EditListingAvailabilityPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    availability,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;

  const defaultAvailabilityPlan = {
    type: 'availability-plan/time',
    timezone: defaultTimeZone(),
    entries: [],
  };
  const availabilityPlan = currentListing.attributes.availabilityPlan || defaultAvailabilityPlan;
  const daysOfWeek = availabilityPlan.entries.map(entry => entry.dayOfWeek);
  const startTimes = availabilityPlan.entries.reduce((prev, entry) => {
    if (!prev[entry.dayOfWeek]) {
      prev[entry.dayOfWeek] = [];
    }
    prev[entry.dayOfWeek].push({
      startTime: entry.startTime,
      endTime: entry.endTime,
    });
    return prev;
  }, {});
  const { 
    mon=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    tue=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    wed=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    thu=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    fri=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    sat=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
    sun=[{
      startTime: '00:00',
      endTime: '23:00',
    }],
   } = startTimes;

  return (
    <div className={classes}>
      <h1 className={css.title}>
        {isPublished ? (
          <FormattedMessage
            id="EditListingAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} /> }}
          />
        ) : (
          <FormattedMessage id="EditListingAvailabilityPanel.createListingTitle" />
        )}
      </h1>
      <EditListingAvailabilityForm
        className={css.form}
        listingId={currentListing.id}
        initialValues={{ daysOfWeek, mon, tue, wed, thu, fri, sat, sun }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        onSubmit={(values) => {
          // We save the default availability plan
          // I.e. this listing is available every night.
          // Exceptions are handled with live edit through a calendar,
          // which is visible on this panel.
          console.log(values);
          const submitValue = {
            ...availabilityPlan,
            entries: mapValuesToEntries(values)
          };
          onSubmit({ availabilityPlan: submitValue });
        }}
        onChange={onChange}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateError={errors.updateListingError}
        updateInProgress={updateInProgress}
      />
    </div>
  );
};

EditListingAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  availability: shape({
    calendar: object.isRequired,
    onFetchAvailabilityExceptions: func.isRequired,
    onCreateAvailabilityException: func.isRequired,
    onDeleteAvailabilityException: func.isRequired,
  }).isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingAvailabilityPanel;
