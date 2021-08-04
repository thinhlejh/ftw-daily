import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '../../util/reactIntl';
import classNames from 'classnames';
import { lazyLoadWithDimensions } from '../../util/contextHelpers';

import { NamedLink } from '../../components';

import css from './SectionLocations.module.css';

import helsinkiImage from './images/location_helsinki.jpg';
import rovaniemiImage from './images/location_rovaniemi.jpg';
import rukaImage from './images/location_ruka.jpg';

class LocationImage extends Component {
  render() {
    const { alt, ...rest } = this.props;
    return <img alt={alt} {...rest} />;
  }
}
const LazyImage = lazyLoadWithDimensions(LocationImage);

const locationLink = (name, image, searchQuery) => {
  const nameText = <span className={css.locationName}>{name}</span>;
  return (
    <NamedLink name="SearchPage" to={{ search: searchQuery }} className={css.location}>
      <div className={css.imageWrapper}>
        <div className={css.aspectWrapper}>
          <LazyImage src={image} alt={name} className={css.locationImage} />
        </div>
      </div>
      <div className={css.linkText}>
        <FormattedMessage
          id="SectionLocations.listingsInLocation"
          values={{ location: nameText }}
        />
      </div>
    </NamedLink>
  );
};

const SectionLocations = props => {
  const { rootClassName, className } = props;

  const classes = classNames(rootClassName || css.root, className);

  return (
    <div className={classes}>
      <div className={css.title}>
        <FormattedMessage id="SectionLocations.title" />
      </div>
      <div className={css.locations}>
        {locationLink(
          'HCMC',
          helsinkiImage,
          '?address=Ho%20Chi%20Minh%20City%2C%20Vietnam&bounds=11.1602136037603%2C107.0265769179448%2C10.34937042531151%2C106.3638783822327'
        )}
        {locationLink(
          'Hanoi',
          rovaniemiImage,
          '?address=Hanoi%2C%20Hoàn%20Kiếm%2C%20Hanoi%2C%20Vietnam&bounds=21.05038011368417%2C105.876445869669%2C20.99509906891873%2C105.7974814649321'
        )}
        {locationLink(
          'Singapore',
          rukaImage,
          '?address=Singapore&bounds=1.478400052327221%2C104.0945000859547%2C1.149599959992529%2C103.5940000228498'
        )}
      </div>
    </div>
  );
};

SectionLocations.defaultProps = { rootClassName: null, className: null };

const { string } = PropTypes;

SectionLocations.propTypes = {
  rootClassName: string,
  className: string,
};

export default SectionLocations;
