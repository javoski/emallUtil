var cheerio = require('cheerio')
var originRequest = require('request')
var mallConfig = require('./emallConfig')
var iconv = require('iconv-lite')

var headers = {  
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
};
function request (url, callback, refer) {
    if(refer){
        headers.Referer = refer;
    }
    var options = {
        url: url,
        encoding: null,
        headers: headers,
        maxRedirects:100
    }
    originRequest(options, callback);
}

var util = {
    getProduct:function(url, callback){
        var _this = this;
        request(url, function(err, _res, body){
            var result = null;
            if(!err && _res.statusCode == 200){
                var config = mallConfig(url);
                var html = '';
                if(config.site == 'suning'){
                    html = iconv.decode(body, 'utf8');
                }else{
                    html = iconv.decode(body, 'gbk');
                }
                var $ = cheerio.load(html);
                result = {
                    name: $(config.data.title).html(),
                    price: $(config.data.price).html(),
                    description: $('meta[name=description]').attr('content'),
                    site: config.site
                };
                result.name = iconv.encode(result.name, 'utf8').toString();
                var imgList = [];
                $(config.data.imgList).each(function(index, elem){
                    if(config.site == 'taobao'){
                        imgList.push(_this.getBigImage(config.site, $(elem).attr('data-src')));
                    }else{
                        imgList.push(_this.getBigImage(config.site, $(elem).attr('src')));
                    }
                });
                result.imgList = imgList;
                if(config.site == 'jd' || config.site == 'tmall'){
                    result.priceUrl = _this.getPriceUrl(config.site, url);
                }
            }
            callback(err, result);
        });
    },
    getBigImage: function(site, imgUrl){
        switch(site){
            case 'jd':
                return imgUrl.replace(/\/n\d\//i, '/n1/');
                break;
            case 'taobao':
            case 'tmall':
                if(imgUrl.indexOf('http') != 0){
                    imgUrl = 'http:'+imgUrl;
                }
                return imgUrl.replace(/_\d+x\d+\w*.jpg\w*/i, '');
                break;
        }

    },
    getPriceUrl: function(site, url){
        var id,
            url;
        var querystring = require('querystring');
        switch(site){
            case 'jd':
                id = url.match(/jd.com\/(\w+).html/i)[1];
                url = 'http://p.3.cn/prices/mgets?skuIds=J_'+id+'type=1';
                break;
            case 'tmall':
                id = querystring.parse(url).id;
                url = 'http://mdskip.taobao.com/core/initItemDetail.htm?itemId='+id;
                break;
        }
        return url;
    },
    getPrice: function(site, url, callback, refer){
        var _this = this;
        var price = '';
        switch(site){
            case 'tmall':
                request(_this.getPriceUrl(site, refer), function(err, res, body){
                    var result = '';
                    result = iconv.decode(body, 'gbk');
                    var obj = JSON.parse(result);
                    if(obj.isSuccess){
                        console.log(obj.defaultModel.detailPageTipsDO);
                        var priceInfo = obj.defaultModel.itemPriceResultDO.priceInfo;
                        if(priceInfo.promotionList){
                            price = priceInfo.promotionList.price;
                        }else{
                            price = priceInfo.price;
                        }
                        callback(err, price);
                    }
                }, refer);
                break;
        }
    }
};

module.exports = util;