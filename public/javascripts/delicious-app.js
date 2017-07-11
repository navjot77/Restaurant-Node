import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autoMaps';

autocomplete($('#address'),$('#long'),$('#lat'));