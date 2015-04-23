"use strict";

var exec = require("child_process").exec;

function start(response, postData) {
	console.log("request handler 'start' was called.");

    response.writeHead(200, {"Content-Type": "application/json"});
    response.write("hello from mock server!");
    response.end();
}

function getATSForChannel(response, postData) {
    console.log("handle for getATSForChannel: ");
    var jsonObj = JSON.parse(postData);
    var keys = jsonObj.skuIds;
    var res = {value:{entries:[]}};
    var entries = [];
    
    keys.forEach(function(item, index, array){
        entries.push({key: item, value: 900});
    });

    res.value.entries = entries;
    var stream = new Buffer(JSON.stringify(res));
    response.write(stream);//new Buffer(JSON.stringify(res)
    response.end();
    if (global.Debug) {
        console.log(JSON.stringify(res));
    }    
}

function miscCheck(response, postData) {
    console.log("handle for miscCheck: ");
    if (global.Debug) {
        console.log("miscCheck Data: " + postData);
    }
    var jsonObj = JSON.parse(postData);
    var keys = jsonObj.miscParam.lines;
    var res = {value:{lineResult:[]}};
    var lineResult = [];
    
    var index = 1;
    keys.forEach(function(item, index, array){
        lineResult.push({skuId: item.skuId, ats: 900, standardPrice: 1000, price: 2000, 
                        onChannel: index == 1? false:true, allowBackOrder: true});
        index++;
    });

    res.value.lineResult = lineResult;

    response.write(JSON.stringify(res));
    response.end();
    
    if (global.Debug) {
        console.log(JSON.stringify(res));    
    }
    
}

function checkoutShoppingCart (response, postData){
    console.log("handle for checkoutShoppingCart: ");
    if (global.Debug) {
        console.log("checkoutShoppingCart Data: " + postData);
    }

    var jsonObj = JSON.parse(postData);
    jsonObj = jsonObj.shoppingCart;

    procOrder(jsonObj);
    
    var res = {value:jsonObj};

    response.write(JSON.stringify(res));
    response.end();
    if (global.Debug) {
        console.log(JSON.stringify(res));
    }
}

function procOrder(order) {
    var orderTotal = 0,
        cartTotal  = 0;
    
    var itemNum    = 0;
    order.shoppingCart.cartItems.forEach(function (item, index, array){
        var lineTotal = item.unitPrice * item.quantity;
        item.lineTotal = lineTotal;
        cartTotal += lineTotal;
        itemNum++;
    });
    console.log('item number is ' + itemNum);

    order.shoppingCart.cartTotal = cartTotal;
    if (order.shippingMethod != null) {
        order.orderTotal = cartTotal + order.shippingMethod.cost;
    } else {
        order.orderTotal = cartTotal;
    }

    if (order.promotion && order.promotion.couponCode.length > 0) {
        order.promotion.discountAmount = order.orderTotal*0.1;
        order.promotion.couponCodeValid = true;
        order.promotion.promotionId = 1;
        order.orderTotal -= order.promotion.discountAmount;
    }
    
}

function getShippingCosts(response, postData) {
    console.log("handle for getShippingCosts: ");
    if (global.Debug) {
        console.log("getShippingCosts Data: " + postData);
    }

    var jsonObj = JSON.parse(postData);
    var arr = [];
    for (var i = 0; i < 2; ++i) {
        var data = {
            carrierId: i,
            id: i,
            type : i,
            name : "from mock Service fast",
            cost : 1000*(i+1),
            minDeliveryDays: 1*i,
            maxDeliveryDays: 2*(i+1)
            //default: true
        };
        arr.push(data);
    }
    
    var res = {value:arr};

    response.write(JSON.stringify(res));
    response.end();
    if (global.Debug) {
        console.log(JSON.stringify(res));
    }
}

function placeOrder(response, postData) {
    console.log("handle for placeOrder: ");
    if (global.Debug) {
        console.log("placeOrder Data: " + postData);
    }

    var jsonObj = JSON.parse(postData);

    var order = buildCustomerOrder(jsonObj.eShopOrder);
   
    
    var res = {value:order};
    response.write(JSON.stringify(res));
    response.end();
    if (global.Debug) {
        console.log("send data: " + JSON.stringify(res));
    }
}

function buildCustomerOrder(shopOrder) {
    //build order lines
    var lines = [];
    shopOrder.shoppingCart.cartItems.forEach(function(item, index){
        lines.push({
            id: item.skuId,
            sku:{
                id:item.skuId,
                name:"PRODUCTNONO"
            },
            netUnitPrice:item.unitPrice,
            netLineTotal:item.lineTotal,
            grossUnitPrice:item.unitPrice,
            grossLineTotal:item.lineTotal,
            netLineTotalAfterDisc:item.unitPrice,
            grossLineTotalAfterDisc:item.unitPrice,
            lineNumber:index+1,
            salesOrderLineId:index+1,
            invoiceStatus:"tNotInvoiced",
            lineCalcBase:"byUnitPrice",
            lineType:"tProductLine",
            logisticsStatus:"tOrdered",
            skuName:"PRODUCTNONO",
            skuCode:"PRODUCTNONO",
            quantity:item.quantity
        });
    });

    var forshipping = [
        {
            lineType:'tServiceLine',
            netLineTotal:shopOrder.shippingMethod.cost,
            grossLineTotal:shopOrder.shippingMethod.cost
        }
    ];
    var resObj = {
        id:global.Orders.length + 1,
        docNumber:global.Orders.length+1,
        docDate:new Date(),
        taxTotal:shopOrder.orderTotal*0.1,
        billingAddr:convertAddress(shopOrder.billingAddress),
        shippingAddr:convertAddress(shopOrder.shippingAddress),
        remark:shopOrder.remark,
        promotionId:1,
        subTotal:shopOrder.shoppingCart.cartTotal,
        grossDocTotal:shopOrder.orderTotal,
        paymentAccount:{
            id:0
        },
        productLines:lines,
        shippingLines:forshipping,
        paymentStatus:'tNotPaid',
        docCurrency:{
            code: 'USD',
            id: 1
        },
        status:'tOpen',
        orderType:'SO',
        allocationStatus:'ALLOC',
        calcBase:'byDefault',
        invoiceStatus:'tNotInvoiced',
        logisticsStatus:'tOrdered'
    }
    if (shopOrder.promotion && shopOrder.promotion.couponCode.length > 0) {
        resObj.promotion = {
            discountAmount:shopOrder.promotion.discountAmount,
            couponCodeValid:true,
            promotionId:1
        }
        // resObj.grossDocTotal = shopOrder.orderTotal - resObj.promotion.discountAmount;
        resObj.discountSum = shopOrder.promotion.discountAmount;
        resObj.discountPercentage  = 0.1;
    }
    
    global.Orders.push(resObj);
    return resObj;
}

function convertAddress(eshopAddr) {
    return {
        'countryId':        eshopAddr.country,      
        'stateId':          eshopAddr.state,            
        'cityName':         eshopAddr.city,          
        'street1':          eshopAddr.address1,               
        'street2':          eshopAddr.address2,
        'zipCode':          eshopAddr.zipCode,
        'mobile':           eshopAddr.phone,                
        'recipientName':    eshopAddr.userName,                
        'companyName':      eshopAddr.company
    };
}

function getSalesOrders(response, postData) {
    console.log("handle for getSalesOrders: ");
    if (global.Debug) {
        console.log("getSalesOrders Data: " + postData);
    }
   
    var res = {
        value:global.Orders,
        'odata.count':global.Orders.length
        };
    response.write(JSON.stringify(res));
    response.end();
    if (global.Debug) {
        console.log("send data: " + JSON.stringify(res));
    }
}

function getSalesOrder(response, postData) {
    console.log("handle for getSalesOrder: ");
    if (global.Debug) {
        console.log("getSalesOrder Data: " + postData);
    }
    if (global.Orders.length == 0) {
        response.end();
        return ;
    }

    var jsonObj = JSON.parse(postData);
    if (jsonObj.hasOwnProperty('id')) {
        jsonObj.orderId = jsonObj.id;
    }

    var i = 0;
    for (; i < global.Orders.length; ++i) {
        if (global.Orders[i].id == jsonObj.orderId) {
            break;
        }
    }
    var o = '{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/SalesOrder@Element","allocationStatus":"ALLOC","autoConfirmCreation":false,"autoDeliver":false,"autoInvoiceAndPay":false,"billingAddr":{"odata.metadata":{"type":"EntitisModel.ComplexTypeAddress"},"countryId":3,"stateId":null,"cityName":"dfasdfas","street1":"asdfasdfasdf","street2":"","zipCode":"dfasdfasdfasdf","mobile":"asdfasdfasdf","recipientName":"asdfasdf","companyName":"","displayName":"Afghanistan asdfasdfas dfasdfas asdfasdfasdf  (dfasdfasdfasdf)  asdfasdf"},"calcBase":"byDefault","catlogId":null,"confirmationNeeded":false,"contactId":null,"creationTime":"2015-03-27T09:46:27.280Z","creatorDisplayName":null,"customerCode":"30","customerName":null,"customerRemark":null,"deliveryDate":null,"discountPercentage":"0.00","discountSum":"0.00","discountSumLC":"0.00","docDate":"2015-03-27T09:46:00.000Z","docNumber":"34","docRate":"1","docTotal":"100.00","docTotalLC":"100.00","earliestDeliveryDate":null,"earliestShipDate":null,"exceptionFlag":false,"exceptionReasons":"","extOrderId":null,"freeText1":null,"fulfillmentDate":null,"grossDiscountSumLC":"0.00","grossDocTotal":"110.00","grossDocTotalLC":"110.00","grossProfitAmount":"100.00","grossProfitRate":"100.00","grossProfitSellAmount":"100.00","hasBeenCalculated":false,"headerAction":"S,R,C,X,I","id":34,"invoiceStatus":"tNotInvoiced","invoicedTotal":{"odata.metadata":{"type":"EntitisModel.Money"},"value":"0","currency":"USD"},"isLineCreatableAndDeletable":false,"isRecalcNeed":false,"isReturnLineAllowed":false,"logisticsStatus":"tOrdered","manuallyClosed":false,"merchantFulfillmentID":null,"name":"SalesOrder","netDiscountSumLC":"0.00","netDocTotal":"100.00","netDocTotalLC":"100.00","omsBizFlow":"NONE","orderType":"SO","ownerCode":1,"ownerDisplayName":"ZHOU ZHENGPING","paidTotal":{"odata.metadata":{"type":"EntitisModel.Money"},"value":"0","currency":"USD"},"paymentMethod":null,"paymentStatus":"tNotPaid","priceMethod":"NET_PRICE","promotionDescription":null,"promotionId":null,"propertyDynamicMeta":"taxTotalLC:T,netDocTotalLC:T,sourceType:T,grossDocTotalLC:T,docCurrency:T,docRate:T,grossProfitSellAmount:T,orderType:T,paymentStatus:T,customer:T,docNumber:T,grossDocTotal:T,netDocTotal:T,sourceId:T,grossProfitAmount:T,grossProfitRate:T,invoicedTotal:T,taxTotal:T,channel:T,priceMethod:T,paidTotal:T","remark":"","seriesId":4,"shipDate":null,"shipServiceLevel":null,"shipperTrackingNumber":null,"shippingAddr":{"odata.metadata":{"type":"EntitisModel.ComplexTypeAddress"},"countryId":3,"stateId":null,"cityName":"dfasdfas","street1":"asdfasdfasdf","street2":"","zipCode":"dfasdfasdfasdf","mobile":"asdfasdfasdf","recipientName":"asdfasdf","companyName":"","displayName":"Afghanistan asdfasdfas dfasdfas asdfasdfasdf  (dfasdfasdfasdf)  asdfasdf"},"shippingCost":"0.00","shippingCostLC":"0.00","shippingPreference":"Free rate","sourceId":null,"sourceType":null,"status":"tOpen","subTotal":"100.00","subTotalLC":"100.00","taxTotal":"10.00","taxTotalLC":"10.00","updateTime":"2015-03-27T09:46:27.376Z","updatorDisplayName":null,"versionNum":1,"warehouses":",WH01","sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"orderDeliveryDetails":[],"orderInvoiceDetails":[],"orderPaymentDetails":[],"orderRelatedBusinessDetails":[],"orderReturnOrderDetails":[],"orderServiceCaseDetails":[],"productLines":[{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/OrderProductLine@Element","amazonOrderItemCode":null,"baseDocId":null,"baseDocLineId":null,"baseDocLineNumber":null,"baseDocNumber":null,"baseDocType":null,"canelReason":null,"costTotal":"0","discountPercentage":"0.00","docCurrencyId":1,"exceptionFlag":false,"exceptionReasonDesc":null,"giftMessage":null,"grossLineTotal":"110.00","grossLineTotalAfterDisc":"110.00","grossLineTotalAfterDiscLC":"110.00","grossLineTotalLC":"110.00","grossProfitAmount":"100.00","grossProfitRate":"100.00","grossUnitPrice":"110.00","id":72,"invoiceStatus":"tNotInvoiced","isNonLogistical":false,"isPreparingStock":false,"isService":false,"lineAction":"S,C,I","lineCalcBase":"byUnitPrice","lineComments":null,"lineNumber":1,"lineType":"tProductLine","logisticsStatus":"tOrdered","merchantFulfillmentItemID":null,"netLineTotal":"100.00","netLineTotalAfterDisc":"100.00","netLineTotalAfterDiscLC":"100.00","netLineTotalLC":"100.00","netUnitPrice":"100.00","originLine":null,"planningWhsId":null,"priceSource":null,"promotionDescription":null,"promotionId":null,"propertyDynamicMeta":"totalAfterDiscountLC:T,costTotal:T,exceptionFlag:T,exceptionReason:T,exceptionReasonDesc:T,invoiceStatus:T,lineType:T,taxAmount:T,logisticsStatus:T,grossProfitAmount:T,grossProfitRate:T,lineNumber:T,netLineTotalLC:T,taxAmountLC:T,totalLC:T,grossLineTotalLC:T","purchaseRequestId":null,"purchaseReuqestLineId":null,"quantity":"1","remark":null,"shippingId":null,"shippingType":null,"skuCode":"PRODUCTNONO","skuName":"PRODUCTNONO","targetDocId":null,"taxAmount":"10.00","taxAmountLC":"10.00","total":"100.00","totalAfterDiscount":"100.00","totalAfterDiscountLC":"100.00","totalLC":"100.00","unitCost":"0","unitPrice":"100.00","uom":null,"warehouseCode":"WH01","warehouseName":"WAREHOUSE","sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectNodeDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"docCurrency":null,"exceptionReason":null,"promotion":null,"sku":{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/SKU@Element","id":3,"name":"PRODUCTNONO","sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"product":null},"warehouse":{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/Warehouse@Element","id":1,"whsName":"WAREHOUSE","sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"virtualNodes":[],"defaulterUser":null}}],"returnLines":[],"shippingLines":[{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/OrderShippingLine@Element","amazonOrderItemCode":null,"baseDocId":null,"baseDocLineId":null,"baseDocLineNumber":null,"baseDocNumber":null,"baseDocType":null,"canelReason":null,"costTotal":"0","discountPercentage":"0","docCurrencyId":1,"exceptionFlag":false,"exceptionReasonDesc":null,"giftMessage":null,"grossLineTotal":"0.00","grossLineTotalAfterDisc":"0.00","grossLineTotalAfterDiscLC":"0.00","grossLineTotalLC":"0.00","grossProfitAmount":"0","grossProfitRate":"0","grossUnitPrice":"0.00","id":73,"invoiceStatus":"tNotInvoiced","isNonLogistical":true,"isPreparingStock":false,"isService":true,"lineAction":"I","lineCalcBase":"byTotal","lineComments":null,"lineNumber":2,"lineType":"tServiceLine","logisticsStatus":"tNA","merchantFulfillmentItemID":null,"netLineTotal":"0.00","netLineTotalAfterDisc":"0.00","netLineTotalAfterDiscLC":"0.00","netLineTotalLC":"0.00","netUnitPrice":"0.00","originLine":null,"planningWhsId":null,"priceSource":null,"promotionDescription":null,"promotionId":null,"propertyDynamicMeta":"totalAfterDiscountLC:T,costTotal:T,warehouse:T,exceptionReason:T,invoiceStatus:T,lineType:T,taxAmount:T,logisticsStatus:T,grossProfitRate:T,grossProfitAmount:T,lineNumber:T,netLineTotalLC:T,taxAmountLC:T,totalLC:T,grossLineTotalLC:T","purchaseRequestId":null,"purchaseReuqestLineId":null,"quantity":"1","remark":null,"shippingId":null,"shippingType":null,"skuCode":"product_code_reserved_for_shipping","skuName":"Shipping Service","targetDocId":null,"taxAmount":"0","taxAmountLC":"0","total":"0.00","totalAfterDiscount":"0.00","totalAfterDiscountLC":"0.00","totalLC":"0.00","unitCost":"0","unitPrice":"0.00","uom":null,"warehouseCode":null,"warehouseName":null,"sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectNodeDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"docCurrency":null,"exceptionReason":null,"promotion":null,"sku":null,"warehouse":null}],"baseDoc":null,"campaign":null,"carrier":null,"channel":{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/Channel@Element","id":2,"name":"ESHOPZPTEST","sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"paymentAccounts":[],"shippingMethods":[],"warehouses":[],"channelType":null,"currency":null,"process":null,"salesPriceList":null,"standardPriceList":null},"customer":{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/Customer@Element","displayName":"12@083.com","id":25,"sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false},"customerGroup":null,"defaultBillToAddress":null,"defaultShipToAddress":null,"industry":null,"language":null,"linkedCustomer":null,"priceList":null},"docCurrency":{"odata.metadata":"https://CNPVGVB1EP015.pvgl.sap.corp:49191/sbo/$metadata#EntitiesNameSpace.EntitisContainer/Currency@Element","code":"USD","id":1,"sbo.dynamicmeta":{"odata.metadata":{"type":"EntitisModel.BusinessObjectDynamicMetadata"},"share":false,"changeOwner":false,"readOnly":false}},"paymentAccount":null,"process":null,"promotion":null,"salesPerson":null}';

    response.write(JSON.stringify(global.Orders[i]));
    response.end();
    if (global.Debug) {
        console.log("send data: " + JSON.stringify(global.Orders[i]));
    }

}

function logIn(response, postData) {
    console.log("handle for logIn: ");
    if (global.Debug) {
        console.log("logIn Data: " + postData);
    }
    var res = {
        code: "P011B00000",
        token:"MOCKSERVER"
    }
    response.write(JSON.stringify(res));
    response.end();
}

function mytenants(response, postData) {
    console.log("handle for mytenants: ");
    if (1) {
        console.log("mytenants Data: " + postData);
    }
    var res = {
        code: "P011B00000",
        token:"MOCKSERVER"
    }
    response.write(JSON.stringify(res));
    response.end();
}

function exchangeToken(response, postData) {
    console.log("handle for exchangeToken: ");
    if (1) {
        console.log("exchangeToken Data: " + postData);
    }
    var res = {
        code: "P011B00000",
        token:"MOCKSERVER"
    }
    response.write(JSON.stringify(res));
    response.end();
}

function createEShopCustomer(response, postData) {
    console.log("handle for createEShopCustomer: ");
    if (1) {
        console.log("createEShopCustomer Data: " + postData);
    }
    var res = {
        customerCode: "P011B00000",
        customerID:"MOCKSERVER",
        channelAccountID:"121212"
    }
    response.write(JSON.stringify(res));
    response.end();

}

module.exports = {};
module.exports.start = start;
module.exports.getATSForChannel        = getATSForChannel;
module.exports.miscCheck               = miscCheck;
module.exports.checkoutShoppingCart    = checkoutShoppingCart;
module.exports.getShippingCosts        = getShippingCosts;
module.exports.placeOrder              = placeOrder;
module.exports.getSalesOrders          = getSalesOrders;
module.exports.getSalesOrder           = getSalesOrder;
module.exports.logIn                   = logIn;
module.exports.mytenants               = mytenants;
module.exports.exchangeToken           = exchangeToken;
module.exports.createEShopCustomer     = createEShopCustomer;