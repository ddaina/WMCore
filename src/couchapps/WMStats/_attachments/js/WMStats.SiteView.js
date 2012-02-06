WMStats.namespace("SiteView")

WMStats.SiteView = (function() {
    
    var _data = null;
    var _containerDiv = null;
    var _url = WMStats.Globals.couchDBViewPath + 'latest-agent-time';
    var _options = {"reduce": true, "group_level": 2, "descending": true};
    
    var tableConfig = {
        "aoColumns": [
            { "mDataProp": "agent_url", "sTitle": "agent"},
            { "mDataProp": "site", "sTitle": "site"},
            { "mDataProp": "queued.first", "sTitle": "queued first", "sDefaultContent": 0 },
            { "mDataProp": "queued.retry", "sTitle": "queued retry", "sDefaultContent": 0 },
            { "mDataProp": "submitted.first", "sTitle": "submitted first", "sDefaultContent": 0 },
            { "mDataProp": "submitted.retry", "sTitle": "submitted retry", "sDefaultContent": 0 },
            { "mDataProp": "submitted.pending", "sTitle": "submitted pending", "sDefaultContent": 0 },
            { "mDataProp": "submitted.running", "sTitle": "submitted running", "sDefaultContent": 0 },
            { "mDataProp": "failure.create", "sTitle": "create fail", "sDefaultContent": 0 },
            { "mDataProp": "failure.submit", "sTitle": "submit fail", "sDefaultContent": 0 },
            { "mDataProp": "failure.exception", "sTitle": "exception fail", "sDefaultContent": 0 },
            { "mDataProp": "canceled", "sTitle": "canceled", "sDefaultContent": 0 },
            { "mDataProp": "success", "sTitle": "success", "sDefaultContent": 0 },
            { "mDataProp": "cooloff", "sTitle": "cool off", "sDefaultContent": 0 },
            { "mDataProp": "timestamp", "sTitle": "updated"}
            //TODO add more data
        ]
    }
    
    function getData() {
        return _data;
    }
    
    var setSiteData = function(data, baseColumns) {
        var rows =[]
        for (var i in data) {
            tableRow = data[i].value;
            for (var j = 0; j < baseColumns.length; j ++) {
                tableRow[baseColumns[j]] = data[i].key[j];
            }
            rows.push(tableRow);
        }
        _data = rows;
        return rows
    }

    var createSiteTable = function(selector, data) {
        var baseCols = ["timestamp", "agent_url", "site"];
        tableConfig.aaData = setSiteData(data, baseCols);
        return WMStats.Table(tableConfig).create(selector)
    }

    var constructSiteKey = function(data) {
        /*
         * assemple keys from data for lasted site summary.
         * key format is [timestamp, agent_url, site]
         */
        var keys = [];
        for (var i in data.rows){
            keys.push([data.rows[i].value, data.rows[i].key[0], data.rows[i].key[1]]);
        }
        return JSON.stringify(keys);      
    }   
            

    var getLatestSiteKeyAndCreateTable = function (siteKeys) {
        /*
         * get list of request ids first from the couchDB then get the details of the requests.
         * This is due to the reduce restiction on couchDB - can't be one http call. 
         */
    
        var options = {"keys": constructSiteKey(siteKeys), "reduce": true, 
                       "group": true};
        //TODO need to change to post call
        var url = WMStats.Globals.couchDBViewPath + 'agent-site';
        $.get(url, options,
              function(siteData) {
                  return createSiteTable(_containerDiv + " table#siteTable", siteData.rows);
              },
              'json')
    };
    
    function createTable(selector){
        _containerDiv = selector;
        $(selector).html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="siteTable"></table>' );
        $.get(_url, _options, getLatestSiteKeyAndCreateTable, 'json')
    }
    
    return {'getData': getData, 'createTable': createTable};    
})();

