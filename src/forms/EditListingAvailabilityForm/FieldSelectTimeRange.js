/*
 * Renders a group of checkboxes that can be used to select
 * multiple values from a set of options.
 *
 * The corresponding component when rendering the selected
 * values is PropertyGroup.
 *
 */

import React from 'react';
import { arrayOf, bool, node, shape, string } from 'prop-types';
import classNames from 'classnames';
import { FieldArray } from 'react-final-form-arrays';
import { FieldCheckbox, ValidationError, FieldSelect, InlineTextButton } from '../../components';

import css from './FieldSelectTimeRange.module.css';

const hoursPerDay = [...Array(24).keys()];
const startHours = hoursPerDay.map((_, index) => index > 9 ? `${index}:00` : `0${index}:00`);
const endHours = hoursPerDay.map((_, index) => index > 9 ? `${index}:00` : `0${index}:00`);

const FieldSelectTimeRangeRenderer = props => {
  const { className, rootClassName, label, twoColumns, id, fields, options, meta } = props;
  const { value } = fields;

  const classes = classNames(rootClassName || css.root, className);
  const listClasses = twoColumns ? classNames(css.list, css.twoColumns) : css.list;

  return (
    <fieldset className={classes}>
      {label ? <legend>{label}</legend> : null}
      <ul className={listClasses}>
        {options.map((option) => {
          const fieldId = `${id}.${option.key}`;
          return (
            <li key={fieldId} className={css.item}>
              <FieldCheckbox
                id={fieldId}
                name={fields.name}
                label={option.label}
                value={option.key}
              />
              {value.find(opt => opt === option.key) && (
                <FieldArray name={option.key}>
                  {({fields}) => {
                    return (
                      <div className={css.timePicker}>
                        {fields.map((name, index) => {
                          return (
                            <div className={css.fieldWrapper} key={name}>
                              <div className={css.formRow}>
                                <FieldSelect
                                  rootClassName={css.fieldSelect}
                                  id={`${name}.startTime`}
                                  name={`${name}.startTime`}
                                  label="Start"
                                >
                                  {startHours.map(
                                    s => (
                                      <option value={s} key={s}>
                                        {s}
                                      </option>
                                    )
                                  )}
                                </FieldSelect>
                                <FieldSelect
                                  rootClassName={css.fieldSelect}
                                  id={`${name}.endTime`}
                                  name={`${name}.endTime`}
                                  label="End"
                                >
                                  {endHours.map(
                                    s => (
                                      <option value={s} key={s}>
                                        {s}
                                      </option>
                                    )
                                  )}
                                </FieldSelect>
                              </div>
                            </div>
                            )
                          })}
                        <InlineTextButton
                          type="button"
                          className={css.buttonAddNew}
                          onClick={() => fields.push({ startTime: '00:00', endTime: '23:00' })}
                        >
                          Add time
                        </InlineTextButton>
                      </div>
                    )
                  }}
                </FieldArray>
              )}
            </li>
          );
        })}
      </ul>
      <ValidationError fieldMeta={{ ...meta }} />
    </fieldset>
  );
};

FieldSelectTimeRangeRenderer.defaultProps = {
  rootClassName: null,
  className: null,
  label: null,
  twoColumns: false,
};

FieldSelectTimeRangeRenderer.propTypes = {
  rootClassName: string,
  className: string,
  // id: string.isRequired,
  label: node,
  options: arrayOf(
    shape({
      key: string.isRequired,
      label: node.isRequired,
    })
  ).isRequired,
  twoColumns: bool,
};

const FieldSelectTimeRange = props => <FieldArray component={FieldSelectTimeRangeRenderer} {...props} id="daysOfWeek" name="daysOfWeek" />;

// Name and component are required fields for FieldArray.
// Component-prop we define in this file, name needs to be passed in
// FieldSelectTimeRange.propTypes = {
//   name: string.isRequired,
// };

export default FieldSelectTimeRange;
