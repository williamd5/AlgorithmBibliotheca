class LibName {
    // perform async task n times
    static async asyncTimes (n = 0, fn = new Function, collector = new LibName.TimesCollector) {
        if (n <= 0) return collector;
        return new Promise((resolve, reject) => {
            async function loop () {
                collector.push(await fn(n--));
                if (n > 0) loop();
                else resolve(collector);
            }
            loop();
        })
    }

    // perform sync task n times
    static syncTimes (n = 0, fn = new Function, collector = new LibName.TimesCollector) {
        if (n <= 0) return collector;
        while(n > 0) collector.push(fn(n--));
        return collector;
    }

    // determine whether task is sync/async
    static times (n = 0, fn = new Function, collector = new LibName.TimesCollector) {
        if (n <= 0) return collector;
        if (typeof fn !== "function") {
            const staticResult = fn;
            fn = () => staticResult;
        }
        const result = fn(n--);
        if (result instanceof Promise) {
            return new Promise((resolve, reject) => {
                async function awaitPromise() {
                    collector.push(await result);
                    return LibName.asyncTimes(n, fn, collector)
                }
                awaitPromise().then(resolve);
            })
        }
        else {
            collector.push(result);
            return LibName.syncTimes(n, fn, collector)
        }
    }

    static TimesCollector = class extends Array {
        nth(n) {
            return this[--n]
        }
        first() {
            return this.nth(1);
        }
        second() {
            return this.nth(2);
        }
        third() {
            return this.nth(3);
        }
        fourth() {
            return this.nth(4);
        }
        fifth() {
            return this.nth(5);
        }
        penultimate() {
            return this.nth(this.length - 1);
        }
        last() {
            return this.nth(this.length);
        }
    }
}

function once () {
    return LibName.times(1, ...arguments);
};
function twice () {
    return LibName.times(2, ...arguments);
};
function thrice () {
    return LibName.times(3, ...arguments);
};


Number.prototype.asyncTimes = function () {
    return LibName.asyncTimes(this, ...arguments);
}
Number.prototype.syncTimes = function () {
    return LibName.syncTimes(this, ...arguments);
}
Number.prototype.times = function () {
    return LibName.times(this, ...arguments);
}