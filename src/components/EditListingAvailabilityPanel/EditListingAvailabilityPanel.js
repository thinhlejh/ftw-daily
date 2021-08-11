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
import { findOptionsForSelectFilter } from '../../util/search';
import config from '../../config';

const defaultTimeZone = () => typeof window !== 'undefined' ? getDefaultTimeZoneOnBrowser() : 'Etc/UTC';

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
  const duration = currentListing.attributes.publicData.duration || '1';
  const daysOfWeek = [...new Set(availabilityPlan.entries.map(entry => entry.dayOfWeek))];
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
    mon=[{...config.defaultTimeRange}],
    tue=[{...config.defaultTimeRange}],
    wed=[{...config.defaultTimeRange}],
    thu=[{...config.defaultTimeRange}],
    fri=[{...config.defaultTimeRange}],
    sat=[{...config.defaultTimeRange}],
    sun=[{...config.defaultTimeRange}],
   } = startTimes;
  
  const durationOptions = findOptionsForSelectFilter('duration', config.custom.filters);

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
        initialValues={{ daysOfWeek, mon, tue, wed, thu, fri, sat, sun, duration }}
        availability={availability}
        availabilityPlan={availabilityPlan}
        durations={durationOptions}
        onSubmit={(values) => {
          const { duration, ...rest } = values;
          const submitValue = {
            ...availabilityPlan,
            entries: mapValuesToEntries(rest)
          };
          onSubmit({ 
            availabilityPlan: submitValue, 
            publicData: {
              duration: parseInt(duration),
            }
          });
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
