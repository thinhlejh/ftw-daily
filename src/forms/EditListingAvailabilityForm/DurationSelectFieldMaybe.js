import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from './DurationSelectFieldMaybe.module.css';

const DurationSelectFieldMaybe = props => {
  const { name, id, durations, intl } = props;
  const durationLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.durationLabel',
  });
  const durationPlaceholder = intl.formatMessage({
    id: 'EditListingDescriptionForm.durationPlaceholder',
  });
  const durationRequired = required(
    intl.formatMessage({
      id: 'EditListingDescriptionForm.durationRequired',
    })
  );
  return durations ? (
    <FieldSelect
      className={css.category}
      name={name}
      id={id}
      label={durationLabel}
      validate={durationRequired}
    >
      <option disabled value="">
        {durationPlaceholder}
      </option>
      {durations.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default DurationSelectFieldMaybe;
