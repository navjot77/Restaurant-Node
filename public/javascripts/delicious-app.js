import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autoMaps';
import searchStore from './modules/searchStore'

autocomplete($('#address'),$('#long'),$('#lat'));


searchStore($('.search'));