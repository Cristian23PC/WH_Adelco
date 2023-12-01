import type * as iconNames from '../../uikit/feedback/Icon/iconNames';

type IconName = (typeof iconNames)[keyof typeof iconNames];

export default IconName;
