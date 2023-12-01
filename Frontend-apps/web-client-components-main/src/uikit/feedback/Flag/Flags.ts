import * as flagNames from './flagNames';
import ArFlag from './flags/ar';
import BrFlag from './flags/br';
import ClFlag from './flags/cl';
import CoFlag from './flags/co';
import EcFlag from './flags/ec';
import MxFlag from './flags/mx';
import PeFlag from './flags/pe';
import UsFlag from './flags/us';
import VzFlag from './flags/vz';

export default {
  [flagNames.AR]: ArFlag,
  [flagNames.BR]: BrFlag,
  [flagNames.CL]: ClFlag,
  [flagNames.CO]: CoFlag,
  [flagNames.EC]: EcFlag,
  [flagNames.MX]: MxFlag,
  [flagNames.PE]: PeFlag,
  [flagNames.US]: UsFlag,
  [flagNames.VZ]: VzFlag
};
