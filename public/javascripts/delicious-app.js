import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autoMaps';
import searchStore from './modules/searchStore'
import makeMap from './modules/map'

autocomplete($('#address'),$('#long'),$('#lat'));


searchStore($('.search'));
makeMap($('#map'));