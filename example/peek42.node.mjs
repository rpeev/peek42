import apivis from 'apivis';
import peek42, {p, pp} from '../dist/peek42.node.mjs';
//import peek42, {p, pp} from 'peek42/dist/peek42.node.mjs';
  peek42.use(apivis);

p.api(process);
