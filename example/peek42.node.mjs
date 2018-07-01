import apivis from 'apivis';
import peek42, {p, pp} from '../dist/peek42.node';
//import peek42, {p, pp} from 'peek42/dist/peek42.node';
  peek42.use(apivis);

p.api(peek42);
