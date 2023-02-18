import Tracker from '../core/index';
/**
* @requestUrl 接口地址
* @historyTracker history上报
* @hashTracker hash上报
* @domTracker dom上报
* @sdkVersion sdk版本
* @extra 透传字段
* @jsError js和promise异常上报 
*/
export interface DefaultOptions{
  uuid:string | undefined,
  requestUrl:string | undefined,
  historyTracker:boolean,
  hashTracker:boolean,
  domTracker:boolean,
  sdkVersion:string| number,
  extra:Record<string,any> | undefined,
  jsError:boolean
}

export interface Options extends Partial<DefaultOptions>{
  requestUrl:string
}

export enum TrackerConfig{
  version='1.0.0'
}
