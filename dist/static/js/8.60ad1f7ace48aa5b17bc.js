webpackJsonp([8],{"7AMX":function(e,t,n){"use strict";var a={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"container"},[n("el-card",{staticClass:"box-card"},[n("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[n("el-page-header",{on:{back:e.goBack}})],1),e._v(" "),n("el-row",{staticClass:"app-left"},[n("el-col",{attrs:{span:24}},[e.kind||e.isDemand?n("p",{staticClass:"title"},[n("span",[e._v(e._s(e.$t("public:likeTo"))+e._s(1==this.type?e.$t("public:unstake"):e.$t("public:stake")))])]):n("p",{staticClass:"title"},[n("span",[e._v(e._s(e.$t("public:likeTo"))+e._s(2==this.type?e.$t("public:unstake"):e.$t("public:stake")))])]),e._v(" "),n("div",{staticClass:"input-area"},[n("div",{staticClass:"balance"},[n("span",{staticClass:"info"},[e._v(e._s(e.$t("public:Balance"))+"：")]),e._v(" "),n("span",{staticClass:"num"},[e._v(e._s(e.toFixed(e.tokenBalance,6)||"--")+" "+e._s(e.name))])]),e._v(" "),n("div",{class:["inputBox",{overMax:e.isConnected&&e.isOverMax}]},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.depositNum,expression:"depositNum"}],attrs:{type:"text",minLength:"1",maxLength:"5"},domProps:{value:e.depositNum},on:{input:[function(t){t.target.composing||(e.depositNum=t.target.value)},e.inputEvent]}}),e._v(" "),n("button",{on:{click:e.clickAllBtn}},[e._v(e._s(e.$t("public:MAX")))])])]),e._v(" "),n("p",{directives:[{name:"show",rawName:"v-show",value:e.isConnected&&e.isOverMax,expression:"isConnected && isOverMax"}],staticClass:"warn-tips"},[e._v("\n            "+e._s(e.$t("public:balanceInsufficient"))+"\n          ")]),e._v(" "),n("div",{staticClass:"submitBtns"},[n("button",{directives:[{name:"loading",rawName:"v-loading",value:e.GettingApprove||e.trading,expression:"GettingApprove || trading"}],class:["enter",{disabled:e.btnDisabled}],attrs:{disabled:e.btnDisabled},on:{click:e.submitOrder}},[e._v("\n              "+e._s(e.submitBtnText)+"\n            ")])])])],1)],1)],1)},staticRenderFns:[]};t.a=a},HqR4:function(e,t){e.exports=[{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"_address",type:"address"},{indexed:!1,internalType:"bool",name:"statusBefore",type:"bool"},{indexed:!1,internalType:"bool",name:"status",type:"bool"}],name:"WhitelistUpdate",type:"event"},{inputs:[{internalType:"uint256",name:"_gTokenAmt",type:"uint256"}],name:"BNBTogToken",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"payable",type:"function"},{inputs:[],name:"BNBgTokenRatio",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_gTokenAmt",type:"uint256"},{internalType:"address",name:"_BuyToken",type:"address"}],name:"BuyTokenTogToken",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"BuytokengTokenRatio",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"OrderDealNum",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"OrderDealStatus",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"WithdrawGasValue",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_gTokenAmt",type:"uint256"},{internalType:"address payable",name:"_to",type:"address"}],name:"gTokenToBNB",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"_gTokenAmt",type:"uint256"},{internalType:"address",name:"_BuyToken",type:"address"},{internalType:"uint256",name:"orderId",type:"uint256"}],name:"gTokenToBuyToken",outputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],stateMutability:"payable",type:"function"},{inputs:[],name:"govAddress",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_govAddress",type:"address"}],name:"initialize",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"}],name:"recover",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address payable",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"}],name:"recoverB",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_Ratio",type:"uint256"}],name:"setBNBgTokenRatio",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_govAddress",type:"address"}],name:"setGov",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_BuyToken",type:"address"},{internalType:"bool",name:"_bSupport",type:"bool"},{internalType:"uint256",name:"_Ratio",type:"uint256"}],name:"setSupportedBuyToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_address",type:"address"},{internalType:"bool",name:"status",type:"bool"}],name:"setWhitelist",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_WithdrawGasValue",type:"uint256"}],name:"setWithdrawGasValue",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"supportedBuyToken",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"userInfo",outputs:[{internalType:"uint256",name:"shares",type:"uint256"},{internalType:"bool",name:"minus",type:"bool"},{internalType:"uint256",name:"status",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"whitelist",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{stateMutability:"payable",type:"receive"}]},JHeQ:function(e,t,n){"use strict";n.d(t,"b",function(){return A}),n.d(t,"g",function(){return _}),n.d(t,"f",function(){return w}),n.d(t,"h",function(){return x}),n.d(t,"d",function(){return T}),n.d(t,"e",function(){return B}),n.d(t,"c",function(){return k}),n.d(t,"a",function(){return C}),n.d(t,"i",function(){return I});var a=n("GKmE"),r=n("yePN"),o=n.n(r),i=n("vPne"),s=(n.n(i),n("HqR4")),c=n.n(s),u=n("qhvF"),d=n.n(u),p=n("Z6J0"),l=(n.n(p),n("9jsg")),h=n.n(l),b=n("iNeo"),f=n.n(b),m=n("cx+2");n("H6e8");function g(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function a(r,o){try{var i=t[r](o),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){a("next",e)},function(e){a("throw",e)});e(s)}("next")})}}var v,y,A=function(e,t,n,r){var i=this,s=__ownInstance__.$store.state.base.address,c=n&&r?web3.utils.toHex(Object(a.l)(n,r)):web3.utils.toHex(Object(a.m)(1.157920892373163*Math.pow(10,59))),u=new web3.eth.Contract(o.a,e),d=t||__ownInstance__.$store.state.base.bankAddress,p=u.methods.approve(d,c).encodeABI(),l=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:l}),new Promise(function(t,n){var a,r=void 0;web3.eth.getTransactionCount(s).then((a=g(regeneratorRuntime.mark(function a(o){var c,u,d,h;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,web3.eth.getGasPrice();case 2:return c=a.sent,u={from:s,to:e,data:p},a.next=6,web3.eth.estimateGas(u);case 6:d=a.sent,h=[{chainId:__ownInstance__.$store.state.base.chainId,nonce:web3.utils.toHex(o),gasLimit:web3.utils.toHex(d),gasPrice:web3.utils.toHex(c),to:e,from:s,data:p}],web3.eth.sendTransaction(h[0]).on("transactionHash",function(e){console.log("hash",e),e&&(r=e)}).on("receipt",function(e){__ownInstance__.$store.dispatch("changeTradeStatus",{id:l,val:1,hash:r}),t(r)}).on("confirmation",function(e,t){}).on("error",function(e){var t=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:l,val:2,isUserDeny:t,hash:r}),console.log("err",e),n(e)});case 9:case"end":return a.stop()}},a,i)})),function(e){return a.apply(this,arguments)}))})},_=(v=g(regeneratorRuntime.mark(function e(){var t,n,r,o,i,s,c,u,p,l=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,h=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",b=arguments.length>2&&void 0!==arguments[2]?arguments[2]:18,f=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},v=this,y=(arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]?arguments[5]:0);return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=__ownInstance__.$store.state.base.address,n=__ownInstance__.$store.state.base.gamesFillingAddress,r=new web3.eth.Contract(d.a,n),o=0,18==b?o=Object(a.l)(l,b):(i=Math.pow(10,b),o=Object(a.j)(l,i)),s=Object(a.h)(y,5),c=Object(a.l)(s,b),console.log(c),u=r.methods.BuyTokenTogToken(o,h).encodeABI(),p=(new Date).getTime().toString(),__ownInstance__.$store.dispatch("createOrderForm",{val:0,id:p}),e.abrupt("return",new Promise(function(e,a){var r,o=void 0;web3.eth.getTransactionCount(t).then((r=g(regeneratorRuntime.mark(function r(i){var s,d,l;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,web3.eth.getGasPrice();case 2:return s=r.sent,r.next=5,web3.eth.estimateGas({from:t,to:n,data:u});case 5:d=r.sent,console.log("estimateGas",d),(l=[{from:t,to:n,data:u,gasPrice:web3.utils.toHex(s),gas:web3.utils.toHex(d)}])[0].value=web3.utils.toHex(c),web3.eth.sendTransaction(l[0]).on("transactionHash",function(){var e=g(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("hash",t),!t){e.next=6;break}return o=t,f.hash=t,e.next=6,Object(m.w)(f);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:1,hash:o}),e(o)}).on("confirmation",function(e,t){}).on("error",function(e){var t=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,isUserDeny:t,hash:o}),console.log("err",e),a(e)});case 10:case"end":return r.stop()}},r,v)})),function(e){return r.apply(this,arguments)})).catch(function(e){console.log("BuyTokenTogToken_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,hash:o}),a(e)})}));case 12:case"end":return e.stop()}},e,this)})),function(){return v.apply(this,arguments)}),w=(y=g(regeneratorRuntime.mark(function e(){var t,n,r,o,i,s,c,u,p=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,l=(arguments.length>1&&void 0!==arguments[1]&&arguments[1],arguments.length>2&&void 0!==arguments[2]?arguments[2]:18),h=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},b=this,f=(arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]?arguments[5]:0);return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=__ownInstance__.$store.state.base.address,n=__ownInstance__.$store.state.base.gamesFillingAddress,r=new web3.eth.Contract(d.a,n),o=Object(a.l)(p,l),i=r.methods.ETHTogToken(o).encodeABI(),s=Object(a.h)(f,5),c=Object(a.l)(s,l),u=(new Date).getTime().toString(),__ownInstance__.$store.dispatch("createOrderForm",{val:0,id:u}),e.abrupt("return",new Promise(function(e,a){var r,o=void 0;web3.eth.getTransactionCount(t).then((r=g(regeneratorRuntime.mark(function r(s){var d,p,l;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,web3.eth.getGasPrice();case 2:return d=r.sent,r.next=5,web3.eth.estimateGas({from:t,to:n,data:i});case 5:p=r.sent,console.log("estimateGas",p),(l=[{from:t,to:n,data:i,gasPrice:web3.utils.toHex(d),gas:web3.utils.toHex(p)}])[0].value=web3.utils.toHex(c),web3.eth.sendTransaction(l[0]).on("transactionHash",function(){var e=g(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("hash",t),!t){e.next=6;break}return o=t,h.hash=t,e.next=6,Object(m.w)(h);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:1,hash:o}),e(o)}).on("confirmation",function(e,t){}).on("error",function(e){var t=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:2,isUserDeny:t,hash:o}),console.log("err",e),a(e)});case 10:case"end":return r.stop()}},r,b)})),function(e){return r.apply(this,arguments)})).catch(function(e){console.log("ETHTogToken_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:2,hash:o}),a(e)})}));case 10:case"end":return e.stop()}},e,this)})),function(){return y.apply(this,arguments)}),x=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:18,r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},o=this,i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,u=__ownInstance__.$store.state.base.address,d=__ownInstance__.$store.state.base.gamesFillingAddress,p=Object(a.l)(e,n),l=new web3.eth.Contract(c.a,d).methods.gTokenToBuyToken(p,t,i).encodeABI(),h=Object(a.h)(s,5),b=Object(a.l)(h,n),f=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:f}),new Promise(function(e,t){var n,a=void 0;web3.eth.getTransactionCount(u).then((n=g(regeneratorRuntime.mark(function n(i){var s,c,p;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,web3.eth.getGasPrice();case 2:return s=n.sent,n.next=5,web3.eth.estimateGas({from:u,to:d,data:l,value:web3.utils.toHex(b)});case 5:c=n.sent,console.log("estimateGas",c),(p=[{from:u,to:d,data:l,gasPrice:web3.utils.toHex(s),gas:web3.utils.toHex(c)}])[0].value=web3.utils.toHex(b),web3.eth.sendTransaction(p[0]).on("transactionHash",function(){var e=g(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("hash",t),!t){e.next=6;break}return a=t,r.hash=t,e.next=6,Object(m.w)(r);case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:f,val:1,hash:a}),e(a)}).on("confirmation",function(e,t){}).on("error",function(e){var n=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:f,val:2,isUserDeny:n,hash:a}),console.log("err",e),t(e)});case 10:case"end":return n.stop()}},n,o)})),function(e){return n.apply(this,arguments)})).catch(function(e){console.log("gTokenToBuyToken_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:f,val:2,hash:a}),t(e)})})},T=function(e,t,n){arguments.length>3&&void 0!==arguments[3]&&arguments[3];var r=this;arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]&&arguments[5];console.log("amount",t),console.log("goblinAddress",e);var o=__ownInstance__.$store.state.base.address,i=(__ownInstance__.$store.state.base.chainName,e),s=new web3.eth.Contract(h.a,i),c=Object(a.l)(t,n),u=web3.utils.toHex(c),d=s.methods.deposit(u).encodeABI(),p=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:p}),new Promise(function(e,t){var n,a=void 0;web3.eth.getTransactionCount(o).then((n=g(regeneratorRuntime.mark(function n(s){var c,u,l,h;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,web3.eth.getGasPrice();case 2:return c=n.sent,u={from:o,to:i,data:d},n.t0=parseInt,n.next=7,web3.eth.estimateGas(u);case 7:n.t1=n.sent,n.t2=1.4*n.t1,l=(0,n.t0)(n.t2),console.log("estimateGas",l),h=[{from:o,to:i,data:d,gasPrice:web3.utils.toHex(c),gas:web3.utils.toHex(l)}],web3.eth.sendTransaction(h[0]).on("transactionHash",function(){var e=g(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("hash",t),t&&(a=t);case 2:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:1,hash:a}),e(a)}).on("confirmation",function(e,t){}).on("error",function(e){var n=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,isUserDeny:n,hash:a}),console.log("err",e),t(e)});case 13:case"end":return n.stop()}},n,r)})),function(e){return n.apply(this,arguments)})).catch(function(e){console.log("receiveAirdrop_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,hash:a}),t(e)})})},B=function(e,t,n){arguments.length>3&&void 0!==arguments[3]&&arguments[3];var r=this;arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]&&arguments[5];console.log("depositPoolsOut",t);var o=__ownInstance__.$store.state.base.address,i=(__ownInstance__.$store.state.base.chainName,e),s=new web3.eth.Contract(h.a,i),c=Object(a.l)(t,n),u=s.methods.withdraw(web3.utils.toHex(c)).encodeABI(),d=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:d}),new Promise(function(e,t){var n,a=void 0;web3.eth.getTransactionCount(o).then((n=g(regeneratorRuntime.mark(function n(s){var c,p,l;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,web3.eth.getGasPrice();case 2:return c=n.sent,n.next=5,web3.eth.estimateGas({from:o,to:i,data:u});case 5:p=n.sent,console.log("estimateGas",p),l=[{from:o,to:i,data:u,gasPrice:web3.utils.toHex(c),gas:web3.utils.toHex(p)}],web3.eth.sendTransaction(l[0]).on("transactionHash",function(){var e=g(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:console.log("hash",t),t&&(a=t);case 2:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:1,hash:a}),e(a)}).on("confirmation",function(e,t){}).on("error",function(e){var n=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:2,isUserDeny:n,hash:a}),console.log("err",e),t(e)});case 9:case"end":return n.stop()}},n,r)})),function(e){return n.apply(this,arguments)})).catch(function(e){console.log("receiveAirdrop_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:2,hash:a}),t(e)})})},k=function(e,t,n){var r=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:18;console.log("bettingTransfer",n);var i=__ownInstance__.$store.state.base.address,s=__ownInstance__.$store.state.base.chainName,c=new web3.eth.Contract(f.a,e),u=Object(a.l)(n,o),d=c.methods.transfer(t,web3.utils.toHex(u)).encodeABI(),p=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:p}),new Promise(function(t,n){var a,o=void 0;web3.eth.getTransactionCount(i).then((a=g(regeneratorRuntime.mark(function a(c){var u,l,h;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,web3.eth.getGasPrice();case 2:if(u=a.sent,l=void 0,"HECO"!==s){a.next=8;break}l=web3.utils.toHex(4e5),a.next=11;break;case 8:return a.next=10,web3.eth.estimateGas({from:i,to:e,data:d});case 10:l=a.sent;case 11:h=[{from:i,to:e,data:d,gasPrice:web3.utils.toHex(u),gas:web3.utils.toHex(l)}],web3.eth.sendTransaction(h[0]).on("transactionHash",function(e){console.log("hash",e),e&&(o=e)}).on("receipt",function(e){__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:1,hash:o}),t(e)}).on("confirmation",function(e,t){}).on("error",function(e){var t=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,isUserDeny:t,hash:o}),console.log("err",e),n(e)});case 13:case"end":return a.stop()}},a,r)})),function(e){return a.apply(this,arguments)})).catch(function(e){console.log("bettingTransfer_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:p,val:2,hash:o}),n(e)})})},C=function(e){var t=this,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:18;console.log("BuyTokenToLuck001",e);var r=__ownInstance__.$store.state.base.address,o=__ownInstance__.$store.state.base.luck001Address,i=new web3.eth.Contract(d.a,o),s=Object(a.l)(e,n),c=i.methods.BuyTokenToLuck001(s).encodeABI(),u=(new Date).getTime().toString();return __ownInstance__.$store.dispatch("createOrderForm",{val:0,id:u}),new Promise(function(e,n){var a,i=void 0;web3.eth.getTransactionCount(r).then((a=g(regeneratorRuntime.mark(function a(s){var d,p,l;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,web3.eth.getGasPrice();case 2:return d=t.sent,t.next=5,web3.eth.estimateGas({from:r,to:o,data:c});case 5:p=t.sent,l=[{from:r,to:o,data:c,gasPrice:web3.utils.toHex(d),gas:web3.utils.toHex(p)}],web3.eth.sendTransaction(l[0]).on("transactionHash",function(e){console.log("hash",e),e&&(i=e)}).on("receipt",function(t){__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:1,hash:i}),e(t)}).on("confirmation",function(e,t){}).on("error",function(e){var t=4001===e.code;__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:2,isUserDeny:t,hash:i}),console.log("err",e),n(e)});case 8:case"end":return t.stop()}},a,t)})),function(e){return a.apply(this,arguments)})).catch(function(e){console.log("BuyTokenToLuck001_err",e),__ownInstance__.$store.dispatch("changeTradeStatus",{id:u,val:2,hash:i}),n(e)})})},I=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",r=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:0,s=__ownInstance__.$store.state.base.tronPrivateKey,c=__ownInstance__.$store.state.base.address,u=Number(t),d=(new Date).getTime().toString();return console.log(n,a),__ownInstance__.$store.dispatch("createOrderForm",{val:0,id:d}),new Promise((e=g(regeneratorRuntime.mark(function e(t,p){var l,h,b,f,g,v,y;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(l=void 0,e.prev=1,h=[{type:"address",value:a},{type:"uint256",value:u*Math.pow(10,6)}],b={feeLimit:tronLink.tronWeb.toSun(i)},console.log(b),f=void 0,g=void 0,"T000000000000000000000000000000000"!=n){e.next=14;break}return e.next=10,tronLink.tronWeb.transactionBuilder.sendTrx(a,u*Math.pow(10,6),c);case 10:f=e.sent,g=f,e.next=18;break;case 14:return e.next=16,tronLink.tronWeb.transactionBuilder.triggerSmartContract(n,"transfer(address,uint256)",b,h,c);case 16:f=e.sent,g=f.transaction;case 18:if(!f){e.next=39;break}return console.log("transferData",f),e.next=22,tronLink.tronWeb.trx.sign(g,s);case 22:if(v=e.sent,console.log("signedTransaction",v),!v){e.next=39;break}return e.next=27,tronLink.tronWeb.trx.sendRawTransaction(v);case 27:if(y=e.sent,console.log("result",y),!y||!y.result){e.next=38;break}return l=y.txID||y.txid,o.hash=l,e.next=34,Object(m.w)(o);case 34:__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:1,hash:l}),t(l),e.next=39;break;case 38:__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:2,errMessage:y.code});case 39:p(!1),e.next=47;break;case 42:e.prev=42,e.t0=e.catch(1),console.log("error",e.t0),__ownInstance__.$store.dispatch("changeTradeStatus",{id:d,val:2,errMessage:e.t0}),p(!1);case 47:p(!1);case 48:case"end":return e.stop()}},e,r,[[1,42]])})),function(t,n){return e.apply(this,arguments)})).catch(function(e){return e})}},Qqud:function(e,t,n){(e.exports=n("FZ+f")(!0)).push([e.i,".container[data-v-04cbf8c0]{width:80%;background-color:transparent!important}.container[data-v-04cbf8c0] .el-breadcrumb{height:25px;font-size:16px}.container[data-v-04cbf8c0] .warn-tips{color:red;font-size:14px;margin-top:5px}.container[data-v-04cbf8c0] .box-card{background-color:transparent!important;color:#fff;border-radius:30px}.container[data-v-04cbf8c0] .box-card .el-card__body{padding-bottom:80px}.container[data-v-04cbf8c0] .box-card .title{color:#fff;font-size:18px;font-weight:600;padding-bottom:10px}.container[data-v-04cbf8c0] .box-card .input-area .receInfo{text-align:right;font-size:12px;margin-bottom:8px}.container[data-v-04cbf8c0] .box-card .input-area .receInfo span{font-weight:600;font-size:14px}.container[data-v-04cbf8c0] .box-card .input-area .balance{font-size:12px;line-height:12px;padding-bottom:8px;text-align:right}.container[data-v-04cbf8c0] .box-card .input-area .balance .info,.container[data-v-04cbf8c0] .box-card .input-area .balance .num{color:#fff}.container[data-v-04cbf8c0] .box-card .input-area .inputBox{height:45px;background-color:rgba(0,49,255,.06);border-radius:8px;position:relative}.container[data-v-04cbf8c0] .box-card .input-area .inputBox img{position:absolute;height:30px;width:30px;left:14px;top:8px}.container[data-v-04cbf8c0] .box-card .input-area .inputBox button{position:absolute;height:30px;width:80px;text-align:center;line-height:26px;font-size:12px;border:0;background-color:#0096ff;color:#fff;right:15px;top:8px;border-radius:19px;cursor:pointer}.container[data-v-04cbf8c0] .box-card .input-area .inputBox input{width:100%;height:45px;margin:0;border:none;outline:none;background-color:#21313b;color:#fff;font-size:18px;padding-left:10px;box-sizing:border-box}.container[data-v-04cbf8c0] .box-card .input-area .overMax{border:1px solid red}.container[data-v-04cbf8c0] .box-card .submitBtns{padding-top:30px;text-align:center}.container[data-v-04cbf8c0] .box-card .submitBtns .enter{margin-top:20px;width:200px;padding:1.5rem;color:#fff;font-size:1rem;font-weight:600;text-transform:uppercase;border:none;border-radius:.8rem;background-color:#141a1f;background-repeat:no-repeat;transition:opacity .2s linear 0s;cursor:pointer}.container[data-v-04cbf8c0] .box-card .submitBtns .enter.is-disabled,.container[data-v-04cbf8c0] .box-card .submitBtns .enter:hover{background:#c8c9cc63;color:#fff}.container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#aaa;color:#fff;cursor:not-allowed}[data-theme=light] .container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#aaa;border-color:#aaa}[data-theme=dark] .container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#4f4e4e;border-color:#4f4e4e}","",{version:3,sources:["/Users/qinlinhui/Sites/WWW/RunesWeb/src/views/hashpower/detail.vue"],names:[],mappings:"AACA,4BAA4B,UAAU,sCAAuC,CAC5E,AACD,2CAA2C,YAAY,cAAc,CACpE,AACD,uCAAuC,UAAW,eAAe,cAAc,CAC9E,AACD,sCAAsC,uCAAwC,WAAW,kBAAkB,CAC1G,AACD,qDAAqD,mBAAmB,CACvE,AACD,6CAA6C,WAAW,eAAe,gBAAgB,mBAAmB,CACzG,AACD,4DAA4D,iBAAiB,eAAe,iBAAiB,CAC5G,AACD,iEAAiE,gBAAgB,cAAc,CAC9F,AACD,2DAA2D,eAAe,iBAAiB,mBAAmB,gBAAgB,CAC7H,AAGD,iIAAgE,UAAU,CACzE,AACD,4DAA4D,YAAY,oCAAqC,kBAAkB,iBAAiB,CAC/I,AACD,gEAAgE,kBAAkB,YAAY,WAAW,UAAU,OAAO,CACzH,AACD,mEAAmE,kBAAkB,YAAY,WAAW,kBAAkB,iBAAiB,eAAe,SAAS,yBAAyB,WAAW,WAAW,QAAQ,mBAAmB,cAAc,CAC9P,AACD,kEAAkE,WAAW,YAAY,SAAS,YAAY,aAAa,yBAAyB,WAAW,eAAe,kBAAkB,qBAAqB,CACpN,AACD,2DAA2D,oBAAqB,CAC/E,AACD,kDAAkD,iBAAiB,iBAAiB,CACnF,AACD,yDAAyD,gBAAgB,YAAY,eAAe,WAAW,eAAe,gBAAgB,yBAAyB,YAAY,oBAAqB,yBAAyB,4BAA4B,iCAAkC,cAAc,CAC5S,AAGD,oIAFqE,qBAAqB,UAAU,CAGnG,AACD,kEAAkE,gBAAgB,WAAW,kBAAkB,CAC9G,AACD,qFAAuF,gBAAgB,iBAAiB,CACvH,AACD,oFAAsF,mBAAmB,oBAAoB,CAC5H",file:"detail.vue",sourcesContent:['\n.container[data-v-04cbf8c0]{width:80%;background-color:transparent !important\n}\n.container[data-v-04cbf8c0] .el-breadcrumb{height:25px;font-size:16px\n}\n.container[data-v-04cbf8c0] .warn-tips{color:#f00;font-size:14px;margin-top:5px\n}\n.container[data-v-04cbf8c0] .box-card{background-color:transparent !important;color:#fff;border-radius:30px\n}\n.container[data-v-04cbf8c0] .box-card .el-card__body{padding-bottom:80px\n}\n.container[data-v-04cbf8c0] .box-card .title{color:#fff;font-size:18px;font-weight:600;padding-bottom:10px\n}\n.container[data-v-04cbf8c0] .box-card .input-area .receInfo{text-align:right;font-size:12px;margin-bottom:8px\n}\n.container[data-v-04cbf8c0] .box-card .input-area .receInfo span{font-weight:600;font-size:14px\n}\n.container[data-v-04cbf8c0] .box-card .input-area .balance{font-size:12px;line-height:12px;padding-bottom:8px;text-align:right\n}\n.container[data-v-04cbf8c0] .box-card .input-area .balance .info{color:#fff\n}\n.container[data-v-04cbf8c0] .box-card .input-area .balance .num{color:#fff\n}\n.container[data-v-04cbf8c0] .box-card .input-area .inputBox{height:45px;background-color:rgba(0,49,255,0.06);border-radius:8px;position:relative\n}\n.container[data-v-04cbf8c0] .box-card .input-area .inputBox img{position:absolute;height:30px;width:30px;left:14px;top:8px\n}\n.container[data-v-04cbf8c0] .box-card .input-area .inputBox button{position:absolute;height:30px;width:80px;text-align:center;line-height:26px;font-size:12px;border:0;background-color:#0096FF;color:#fff;right:15px;top:8px;border-radius:19px;cursor:pointer\n}\n.container[data-v-04cbf8c0] .box-card .input-area .inputBox input{width:100%;height:45px;margin:0;border:none;outline:none;background-color:#21313b;color:#fff;font-size:18px;padding-left:10px;box-sizing:border-box\n}\n.container[data-v-04cbf8c0] .box-card .input-area .overMax{border:1px solid #f00\n}\n.container[data-v-04cbf8c0] .box-card .submitBtns{padding-top:30px;text-align:center\n}\n.container[data-v-04cbf8c0] .box-card .submitBtns .enter{margin-top:20px;width:200px;padding:1.5rem;color:#fff;font-size:1rem;font-weight:600;text-transform:uppercase;border:none;border-radius:0.8rem;background-color:#141a1f;background-repeat:no-repeat;transition:opacity 0.2s linear 0s;cursor:pointer\n}\n.container[data-v-04cbf8c0] .box-card .submitBtns .enter.is-disabled{background:#c8c9cc63;color:#fff\n}\n.container[data-v-04cbf8c0] .box-card .submitBtns .enter:hover{background:#c8c9cc63;color:#fff\n}\n.container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#aaa;color:#fff;cursor:not-allowed\n}\n[data-theme="light"] .container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#aaa;border-color:#aaa\n}\n[data-theme="dark"] .container[data-v-04cbf8c0] .box-card .submitBtns .enter.disabled{background:#4f4e4e;border-color:#4f4e4e\n}\n'],sourceRoot:""}])},Z6J0:function(e,t){e.exports=[{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{inputs:[],name:"BNBS19Ratio",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_S19Amt",type:"uint256"}],name:"BNBToS19",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"BuyToken",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_S19Amt",type:"uint256"}],name:"BuyTokenToS19",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"S19",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"US19Ratio",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"token",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"}],name:"recover",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address payable",name:"to",type:"address"},{internalType:"uint256",name:"value",type:"uint256"}],name:"recoverB",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_Ratio",type:"uint256"}],name:"setBNBS19Ratioo",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_Ratio",type:"uint256"}],name:"setBuyTokenToS19Ratio",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_BuyToken",type:"address"}],name:"setBuyTokenToken",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_S19",type:"address"}],name:"setS19Token",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{stateMutability:"payable",type:"receive"}]},a0Bu:function(e,t,n){"use strict";var a=n("iXYn"),r=n.n(a),o=n("NYxO"),i=n("JHeQ"),s=n("cx+2"),c=n("+zHA"),u=n("GKmE"),d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};function p(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function a(r,o){try{var i=t[r](o),s=i.value}catch(e){return void n(e)}if(!i.done)return Promise.resolve(s).then(function(e){a("next",e)},function(e){a("throw",e)});e(s)}("next")})}}t.a={name:"PledegDetail",data:function(){return{propertyList:[{id:1,name:"币种"}],activeDayIndex:4,depositNum:"",toolTipsLoading:!1,hashId:1,tokenBalance:"--",ableReceive:"--",rewardAmount:"",tokenAddress:"",currencyToken:"",goblin:"",name:"",approved:1,decimals:18,isDemand:!1,isIRO:!1,trading:!1}},created:function(){try{var e=sessionStorage.getItem("hashpowerPoolsDetailInfo"),t=JSON.parse(e);console.log(t),this.currencyToken=t.currencyToken,this.goblin=t.goblin,this.name=t.name,this.hashId=t.hashId}catch(e){}},mounted:function(){},watch:{isConnected:{immediate:!0,handler:function(e){var t=this;return p(regeneratorRuntime.mark(function n(){return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:e&&t.goblin&&(1==t.type?t.getTokenBalanceApprove():t.getTokenBalance());case 1:case"end":return n.stop()}},n,t)}))()}},goblin:{handler:function(e){this.isConnected&&e&&(1==this.type?this.getTokenBalanceApprove():this.getTokenBalance())}}},computed:d({},Object(o.c)({address:function(e){return e.base.address},isConnected:function(e){return e.base.isConnected},fairLaunchAddress:function(e){return e.base.fairLaunchAddress},mainTheme:function(e){return e.comps.mainTheme},apiUrl:function(e){return e.base.apiUrl}}),{btnDisabled:function(){return this.isConnected&&!(2===this.approved&&1==this.type)&&!Boolean(Number(this.depositNum))||this.isOverMax},themeText:function(){return 1==this.type?this.$t("public:Deposit"):this.$t("public:Withdraw")},type:function(){return this.$route.query.type},kind:function(){return this.$route.query.kind},GettingApprove:function(){return this.isConnected&&0===this.approved},submitBtnText:function(){return this.isConnected?2===this.approved&&1==this.type?this.$t("public:Approve"):this.themeText:this.$t("public:ConnectWallet")},isOverMax:function(){return this.isDemand?"--"===this.tokenBalance&&Number(this.depositNum)||"--"!==this.tokenBalance&&Number(this.depositNum)>Number(this.tokenBalance):"--"===this.tokenBalance&&Number(this.depositNum)||"--"!==this.tokenBalance&&Number(this.depositNum)>Number(this.tokenBalance)||Number(this.depositNum)>Number(this.ableReceive)},pid:function(){return this.isDemand?this.fixedpId:this.activeDayIndex}}),methods:{currentTokenImage:function(e){var t="light"===this.mainTheme?"L":"D";return r.a[e]&&r.a[e][t]?r.a[e][t]:r.a.default},inputEvent:function(e){this.depositNum=this.$inputLimit(e,6,!0)},returnPage:function(){this.depositNum="",this.$router.go(-1)},submitOrder:function(){var e=this;return p(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e.isConnected){t.next=2;break}return t.abrupt("return",e.$connect());case 2:if(!e.trading){t.next=4;break}return t.abrupt("return");case 4:1==e.type?i.d:i.e,e.activeDayIndex,e.trading=!0,Object(c.c)(e.apiUrl+"/Hashpower/Hashpower/startInvestNow",{address:e.address,hashId:e.hashId,number:e.depositNum,type:e.type},function(){var t=p(regeneratorRuntime.mark(function t(n){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.loading=!1,t.next=3,Object(s.x)(3,e.hashId);case 3:console.log(n),n&&1e4==n.code?(e.trading=!1,e.depositNum="",e.$message({type:"success",message:1==e.type?"质押成功!":"提取成功"}),setTimeout(function(){e.$store.dispatch("getHashPowerPoolsList"),e.$router.push({path:"/hashpower/list"})},1e3)):e.$message.error(n.msg);case 5:case"end":return t.stop()}},t,e)}));return function(e){return t.apply(this,arguments)}}());case 8:case"end":return t.stop()}},t,e)}))()},clickAllBtn:function(){this.isConnected&&this.tokenBalance&&(this.depositNum=Object(u.h)(this.tokenBalance,4))},getTokenBalanceApprove:function(){var e=this;return p(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Object(s.p)(e.hashId);case 2:n=t.sent,e.tokenBalance=n.number;case 4:case"end":return t.stop()}},t,e)}))()},getTokenBalance:function(){var e=this;return p(regeneratorRuntime.mark(function t(){var n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=0,t.next=3,Object(s.q)(e.hashId);case 3:n=t.sent,e.tokenBalance=n.number;case 5:case"end":return t.stop()}},t,e)}))()},goBack:function(){this.$router.go(-1)}}}},iXYn:function(e,t){},rfJH:function(e,t,n){var a=n("Qqud");"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n("rjj0")("28bd26ce",a,!0,{})},zxtz:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("a0Bu"),r=n("7AMX");var o=function(e){n("rfJH")},i=n("VU/8")(a.a,r.a,!1,o,"data-v-04cbf8c0",null);t.default=i.exports}});