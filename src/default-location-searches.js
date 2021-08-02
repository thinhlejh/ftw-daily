import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
const defaultLocations = [
  {
    id: 'default-hcm',
    predictionPlace: {
      address: 'HCMC, Vietnam',
      bounds: new LatLngBounds(new LatLng(11.1602136037603, 107.0265769179448), new LatLng(10.34937042531151, 106.3638783822327)),
    },
  },
  {
    id: 'default-hn',
    predictionPlace: {
      address: 'Hanoi, Vietnam',
      bounds: new LatLngBounds(new LatLng(21.05038011368417, 105.876445869669), new LatLng(20.99509906891873, 105.7974814649321)),
    },
  },
  {
    id: 'default-sg',
    predictionPlace: {
      address: 'Singapore',
      bounds: new LatLngBounds(new LatLng(1.478400052327221, 104.0945000859547), new LatLng(1.149599959992529, 103.5940000228498)),
    },
  },
];
export default defaultLocations;
