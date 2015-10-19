"use strict";

var server = require("./server"),
    router = require("./router"),
    requestHandler = require("./requestHandler");


var handle = {};
handle["/"] = requestHandler.start;


handle['getATSForChannel'] 		= requestHandler.getATSForChannel;
handle['miscCheck'] 			= requestHandler.miscCheck;
handle['checkoutShoppingCart'] 	= requestHandler.checkoutShoppingCart;
handle['getShippingCosts'] 		= requestHandler.getShippingCosts;
handle['placeOrder']			= requestHandler.placeOrder;
handle['getSalesOrders']		= requestHandler.getSalesOrders;
handle['getSalesOrder']			= requestHandler.getSalesOrder;
handle['logIn']					= requestHandler.logIn;
handle['mytenants']				= requestHandler.mytenants;
handle['exchangeToken']			= requestHandler.exchangeToken;
handle['createEShopCustomer']	= requestHandler.createEShopCustomer;


global.Debug 	= 0;
global.Orders 	= [];

server.start(router.route, handle);
