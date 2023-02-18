import { DefaultOptions, TrackerConfig, Options } from '../types/index';
import { createHistoryEvent } from '../utils/pv';


const MouseEventlist: string[] = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseenter', 'mouseout', 'mouseover']

export default class Tracker {
  public data: Options
  constructor(options: Options) {
    this.data = Object.assign(this.initDef(), options)
    this.installTracker()
  }

  private initDef(): DefaultOptions {
    window.history['pushState'] = createHistoryEvent('pushState')
    window.history['replaceState'] = createHistoryEvent('replaceState')
    return <DefaultOptions>{
      sdkVersion: TrackerConfig.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: false,
      jsError: false
    }
  }

  public setUserId<T extends DefaultOptions['uuid']>(uuid: T) {
    this.data.uuid = uuid
  }

  public setExtra<T extends DefaultOptions['extra']>(extra: T) {
    this.data.extra = extra
  }

  public sendTracker<T>(data: T) {
    this.reportTracker(data)
  }

  private targetKeyReport() {
    MouseEventlist.forEach(event => {
      window.addEventListener(event, (e) => {
        const target = e.target as HTMLElement
        const targetKey = target.getAttribute('target-key')
        if (targetKey) {
          this.reportTracker({
            event,
            targetKey
          })
        }
      })
    })
  }

  private captureEvents<T>(mouseEventList: string[], targetKey: string, data?: T) {
    mouseEventList.forEach(event => {
      window.addEventListener(event, () => {
        this.reportTracker({
          event,
          targetKey,
          data
        })
      })
    })
  }

  private installTracker() {
    if (this.data.historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv')
    }
    if (this.data.hashTracker) {
      this.captureEvents(['hashchange'], 'hash-pv')
    }
    if (this.data.domTracker) {
      this.targetKeyReport()
    }
    if (this.data.jsError) {
      console.log('aaa');
      
      this.jsError()
    }
  }

  private jsError() {
    this.errorEvent()
    this.promiseReject()
  }

  private errorEvent() {
    console.log('erroreve');
    
    window.addEventListener('error', (e) => {
      console.log('ssss');
      
      this.reportTracker({
        targetKey: 'message',
        event: 'error',
        message: e.message
      })
    })
  }

  private promiseReject() {
    console.log('promiseerr');
    
    window.addEventListener('unhandledrejection', (event) => {
      console.log('eeee');
      event.promise.catch(error => {
        this.reportTracker({
          targetKey: "reject",
          event: "promise",
          message: error
        })
      })
    })
  }

  private reportTracker<T>(data: T) {
    const params = Object.assign(this.data, data, { time: new Date().getTime() })
    let headers = {
      type: 'application/x-www-form-urlencoded'
    }
    let blob = new Blob([JSON.stringify(params)], headers)
    console.log(blob,22);
    
    navigator.sendBeacon(this.data.requestUrl, blob)
  }
}
