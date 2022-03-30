// This file is created by egg-ts-helper@1.30.2
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTest from '../../../app/service/Test';
import ExportRobotActicle from '../../../app/service/Robot/acticle';
import ExportRobotAxios from '../../../app/service/Robot/axios';
import ExportRobotHoliday from '../../../app/service/Robot/holiday';
import ExportRobotIndex from '../../../app/service/Robot/index';
import ExportRobotUtils from '../../../app/service/Robot/utils';

declare module 'egg' {
  interface IService {
    test: AutoInstanceType<typeof ExportTest>;
    robot: {
      acticle: AutoInstanceType<typeof ExportRobotActicle>;
      axios: AutoInstanceType<typeof ExportRobotAxios>;
      holiday: AutoInstanceType<typeof ExportRobotHoliday>;
      index: AutoInstanceType<typeof ExportRobotIndex>;
      utils: AutoInstanceType<typeof ExportRobotUtils>;
    }
  }
}
