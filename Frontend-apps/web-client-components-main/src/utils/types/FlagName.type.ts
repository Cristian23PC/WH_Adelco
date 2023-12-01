import type * as flagNames from '../../uikit/feedback/Flag/flagNames';

type FlagName = (typeof flagNames)[keyof typeof flagNames];

export default FlagName;
