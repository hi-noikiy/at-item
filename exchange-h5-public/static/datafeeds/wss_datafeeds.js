var udf_datafeed = {
    _EVENTS_: {}, //事件池
    _DATA_: {},
    on: function (type, handler) {
        (this._EVENTS_[type] || (this._EVENTS_[type] = [])).push(handler);
        if (this._DATA_.hasOwnProperty(type)) {
            handler.apply(null, this._DATA_[type]);
        }
        return this;
    },
    off: function (type) {
        this._EVENTS_[type] = null;
        delete this._DATA_[type];
        return this;
    },
    emit: function (type/*, arg1, arg2, ...*/) {
        var es = this._EVENTS_[type] || [];
        var i = 0, len = es.length, args = es.slice.call(arguments, 1);
        this._DATA_[type] = args;
        for (; i < len; i++) {
            es[i].apply(null, args);
        }
        return this;
    },
    onReady (callback) {
        var cnf = {
            supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
            supports_group_request: false,
            supports_marks: true,
            supports_search: false,
            supports_timescale_marks: false,
        };

        callback(cnf);

        /**
         * 初始化WebSocket服务 && 监听服务端的数据响应事件
        */
        this.wss = io('ws://47.75.4.58:3120', {
            transports: ['websocket']
        });
        this.wss.on('btcusdt_1m', (data) => {
            data = JSON.parse(data);
            var bar = {
                time: data.id * 1000,
                close: data.close,
                open: data.open,
                high: data.high,
                low: data.low,
                volume: data.amount
            };
            // 实时推送数据到图表回调函数
            this.emit('btcusdt_1m_ready', bar);
        })
    },
    /**
     * 搜索币种
    */
   searchSymbols (userInput, exchange, symbolType, onResultReadyCallback) {
    var result = [];
    // get symbollist from server.
    result = [
        {
            "symbol": 'btcusdt',
            "full_name": 'btcusdt',
            "description": 'btcusdt',
            "type": "btcusdt"
        }
    ];
    onResultReadyCallback(result);
    console.log(111111, 'searchSymbols', arguments);
},
    /**
     * 通过币种名称解析币种详细配置信息
    */
    resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        onSymbolResolvedCallback({
            "name": symbolName,
            "exchange-traded": "",
            "exchange-listed": "",
            "timezone": "Asia/Shanghai",
            "minmov": 1,
            "minmov2": 0,
            "pointvalue": 1,
            "session": "0000-2400:1234567",
            "has_intraday": true,
            "has_no_volume": false,
            "volume_precision": 1,
            "description": symbolName.toUpperCase(),
            "type": "bitcoin",
            "supported_resolutions": ["1", "5", "15", "30", "60", "1440", "10080", "302400"],
            "pricescale": 100000000,
            "ticker": symbolName.toUpperCase()
        });
        console.log(2222, 'resolveSymbol', arguments);
    },
    /**
     * 获取K线图历史数据
    */
    getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        // get history data from server
        window.fetch('https://api.huobipro.com/market/history/kline?period=1min&size=1000&symbol=btcusdt&AccessKeyId=4722b45f-a745b74c-b57e73ce-721bc').then(res => {
            return res.json();
        }).then(data => {
            var bars = [];
            for(let i = data.data.length; i > 0; i --) {
                var item = data.data[i-1];
                bars.push({
                    time: item.id*1000, close: item.close, open: item.open, high: item.high, low: item.low, volume: item.vol
                })
            }
            var meta = {
                noData: false
            };
            onHistoryCallback(bars, meta);
        });
        console.log(33333, 'getBars', arguments);
    },
    /**
     * 订阅WebSocket端的实时数据
    */
    subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        this.subscriberUID = subscriberUID;
        this.on('btcusdt_1m_ready', bar => {
            onRealtimeCallback(bar);
        })
    },
    unsubscribeBars (subscriberUID) {
        console.log(55555);
    },
    calculateHistoryDepth (resolution, resolutionBack, intervalBack) {
        console.log(666666, 'calculateHistoryDepth', arguments);
        return undefined;
    },
    getMarks () {
        console.log(77777);
    }
};

if (typeof module !== 'undefined' && module && module.exports) {
	module.exports = {
		udf_datafeed: udf_datafeed
	};
}
