import React from 'react';
import { required } from '../../util/validators';
import { FieldSelect } from '../../components';

import css from '../EditListingDescriptionForm/EditListingDescriptionForm.module.css';

const SubjectSelectFieldMaybe = props => {
  const { name, id, subjects, intl } = props;
  const subjectLabel = intl.formatMessage({
    id: 'EditListingDescriptionForm.subjectLabel',
  });
  const subjectPlaceholder = intl.formatMessage({
    id: 'EditListingDescriptionForm.subjectPlaceholder',
  });
  const subjectRequired = required(
    intl.formatMessage({
      id: 'EditListingDescriptionForm.subjectRequired',
    })
  );
  return subjects ? (
    <FieldSelect
      className={css.category}
      name={name}
      id={id}
      label={subjectLabel}
      validate={subjectRequired}
    >
      <option disabled value="">
        {subjectPlaceholder}
      </option>
      {subjects.map(c => (
        <option key={c.key} value={c.key}>
          {c.label}
        </option>
      ))}
    </FieldSelect>
  ) : null;
};

export default SubjectSelectFieldMaybe;
