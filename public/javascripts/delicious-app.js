import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autoMaps';
import searchStore from './modules/searchStore'
import makeMap from './modules/map'
import heart from './modules/heart';
autocomplete($('#address'),$('#long'),$('#lat'));


searchStore($('.search'));
makeMap($('#map'));

$$('form.heart').on('submit',heart)