var config = {
    jd:{
        title:'#product-intro #name h1',
        price:'#product-intro #summary-price #jd-price',
        imgList: '#product-intro #spec-list .spec-items li img'
    },
    tmall:{
        title:'#detail .tb-detail-hd h1',
        price:'#J_StrPriceModBox .tm-price',
        imgList: '#J_UlThumb li a img'
    },
    taobao:{
        title:'#detail .tb-item-info #J_Title h3.tb-main-title',
        price:'#J_StrPrice em.tb-rmb-num',
        imgList: '#J_UlThumb li img'
    },
    amazon:{
        title:'h1#title span',
        price:'#priceblock_ourprice',
        imgList: '#altImages ul li img'
    },
    suning:{
        title:'#productDisplayName',
        price:'#promoPrice',
        imgList: '.imgzoom-thumb .imgzoom-thumb-main ul li img'
    }
};

module.exports = function(url){
    var site = 'taobao';
    site = url.match(/^https?:\/\/\w+.(\w+).\w+/i)[1];
    return {
        data:config[site],
        site:site
    }

};