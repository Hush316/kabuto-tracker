var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

const createHistoryEvent = (type) => {
    const origin = history[type];
    return function () {
        const res = origin.apply(this, arguments);
        const e = new Event(type);
        window.dispatchEvent(e);
        return res;
    };
};

const MouseEventlist = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mouseenter', 'mouseout', 'mouseover'];
class Tracker {
    constructor(options) {
        this.data = Object.assign(this.initDef(), options);
        this.installTracker();
    }
    initDef() {
        window.history['pushState'] = createHistoryEvent('pushState');
        window.history['replaceState'] = createHistoryEvent('replaceState');
        return {
            sdkVersion: TrackerConfig.version,
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            jsError: false
        };
    }
    setUserId(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
    sendTracker(data) {
        this.reportTracker(data);
    }
    targetKeyReport() {
        MouseEventlist.forEach(event => {
            window.addEventListener(event, (e) => {
                const target = e.target;
                const targetKey = target.getAttribute('target-key');
                if (targetKey) {
                    this.reportTracker({
                        event,
                        targetKey
                    });
                }
            });
        });
    }
    captureEvents(mouseEventList, targetKey, data) {
        mouseEventList.forEach(event => {
            window.addEventListener(event, () => {
                this.reportTracker({
                    event,
                    targetKey,
                    data
                });
            });
        });
    }
    installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(['pushState', 'replaceState', 'popState'], 'history-pv');
        }
        if (this.data.hashTracker) {
            this.captureEvents(['hashchange'], 'hash-pv');
        }
        if (this.data.domTracker) {
            this.targetKeyReport();
        }
        if (this.data.jsError) {
            console.log('aaa');
            this.jsError();
        }
    }
    jsError() {
        this.errorEvent();
        this.promiseReject();
    }
    errorEvent() {
        console.log('erroreve');
        window.addEventListener('error', (e) => {
            console.log('ssss');
            this.reportTracker({
                targetKey: 'message',
                event: 'error',
                message: e.message
            });
        });
    }
    promiseReject() {
        console.log('promiseerr');
        window.addEventListener('unhandledrejection', (event) => {
            console.log('eeee');
            event.promise.catch(error => {
                this.reportTracker({
                    targetKey: "reject",
                    event: "promise",
                    message: error
                });
            });
        });
    }
    reportTracker(data) {
        const params = Object.assign(this.data, data, { time: new Date().getTime() });
        let headers = {
            type: 'application/x-www-form-urlencoded'
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        console.log(blob, 22);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
}

export { Tracker as default };
