webpackJsonp([9],{"0EEj":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("ZdaY"),n=a("AbHl"),i=!1;var o=function(e){i||a("ea8h")},l=a("VU/8")(r.a,n.a,!1,o,"data-v-2516a4f1",null);l.options.__file="src/views/applyOwn/apply.vue",t.default=l.exports},"2M4V":function(e,t,a){(e.exports=a("FZ+f")(!1)).push([e.i,'\n.container[data-v-2516a4f1]{height:120vh\n}\n.container[data-v-2516a4f1] .token-application{color:#fff;line-height:1.5;margin-top:2rem;margin-bottom:2rem;font-size:26px;font-weight:900\n}\n.container[data-v-2516a4f1] .radio-nav{margin-bottom:10px;border:2px solid #454848;border-radius:50px\n}\n.container[data-v-2516a4f1] .radio-nav .el-radio-button:first-child .el-radio-button__inner,.container[data-v-2516a4f1] .radio-nav .el-radio-button:last-child .el-radio-button__inner{border-radius:50px\n}\n.container[data-v-2516a4f1] .radio-nav .el-radio-button__orig-radio:checked+.el-radio-button__inner{background-color:#e09320\n}\n.container[data-v-2516a4f1] .radio-nav .el-radio-button__inner{background:transparent;color:#fff;border:0\n}\n.container[data-v-2516a4f1] .marginTop{margin-bottom:30px;border:2px solid #454848;padding:20px;border-radius:20px\n}\n.container[data-v-2516a4f1] .marginTop .title{float:left\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm{text-align:center\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .el-form-item__content{margin-left:0 !important\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .el-input__inner{border:2px solid #454848;color:#fff;display:flex;width:100%;height:40px;padding:0px 16px;border-radius:20px;background-color:#21313b\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .el-textarea__inner{border:2px solid #454848;color:#fff;display:flex;width:100%;border-radius:20px;background-color:#21313b\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .el-input-group__prepend{border:0;color:#fff;background-color:#141a1f;padding:0 10px;font-size:10px\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .el-input-group__append{border:0;color:#fff;background-color:#141a1f;font-size:10px;padding:0 10px\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm input::-webkit-outer-spin-button,.container[data-v-2516a4f1] .marginTop .ruleForm input::-webkit-inner-spin-button{-webkit-appearance:none\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm input[type="number"]{-moz-appearance:textfield\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .apply-button{margin-top:20px;width:80%;padding:20px;color:#fff;font-size:1rem;font-weight:600;text-transform:uppercase;border:none;border-radius:0.8rem;background-color:#141a1f;background-repeat:no-repeat;transition:opacity 0.2s linear 0s\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .apply-button:hover{background-color:#21313b\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .apply-button.is-disabled{background:#c8c9cc63;color:#fff\n}\n.container[data-v-2516a4f1] .marginTop .ruleForm .apply-button.is-disabled:hover{background:#c8c9cc63;color:#fff\n}\n.container[data-v-2516a4f1] .marginTop .odds{padding-left:0 !important;margin:20px 0\n}\n.container[data-v-2516a4f1] .marginTop .profit{padding-right:0 !important;margin:20px 0\n}\n.container[data-v-2516a4f1] .marginTop .el-table{background-color:transparent !important\n}\n.container[data-v-2516a4f1] .marginTop .el-table tr{background-color:transparent !important;color:#fff;font-size:10px\n}\n.container[data-v-2516a4f1] .marginTop .el-table .el-table__cell{background-color:transparent !important\n}\n.container[data-v-2516a4f1] .marginTop .pagination .el-input__inner{height:30px;background-color:#21313b !important;color:#fff !important\n}\n.container[data-v-2516a4f1] .marginTop .pagination .el-pagination__total,.container[data-v-2516a4f1] .marginTop .pagination .el-pagination__jump{color:#fff !important\n}\n.container[data-v-2516a4f1] .marginTop .pagination .el-pagination button:disabled{background-color:#21313b\n}\n.container[data-v-2516a4f1] .marginTop .pagination .el-pager li{background-color:#21313b\n}\n.container[data-v-2516a4f1] .el-dialog{background-color:#212429\n}\n.container[data-v-2516a4f1] .el-dialog .el-dialog__body{padding:0\n}\n.container[data-v-2516a4f1] .el-dialog .el-dialog__title{color:#fff\n}\n.container[data-v-2516a4f1] .el-dialog .el-descriptions__body{background-color:#212429;padding:20px;color:#fff\n}\n.container[data-v-2516a4f1] .el-loading-mask{border-radius:5px;background-color:rgba(0,0,0,0.8);border:0\n}\n',""])},AO5d:function(e,t,a){"use strict";t.a={props:["total","pageSize","currPage"],data:function(){return{}},methods:{handleSizeChange:function(e){this.$emit("changeLimit",e)},handleCurrentChange:function(e){this.$emit("changeSkip",e)}}}},AbHl:function(e,t,a){"use strict";var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:24,align:"center"}},[a("div",{staticClass:"token-application"},[e._v(e._s(e.$t("apply:ApplyYourOwn")))])]),e._v(" "),a("el-col",{attrs:{span:24,align:"center"}},[a("el-radio-group",{staticClass:"radio-nav",attrs:{border:!0},on:{input:e.tokenClickFun},model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[a("el-radio-button",{attrs:{label:"1"}},[e._v(e._s(e.$t("apply:TokenApplication")))]),e._v(" "),a("el-radio-button",{attrs:{label:"2"}},[e._v(e._s(e.$t("apply:MyApply")))])],1),e._v(" "),1==e.activeName?a("div",{staticClass:"marginTop",style:{width:e.isMobel?"90%":"50%"}},[a("el-form",{ref:"ruleForm",staticClass:"ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{prop:"currency"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterName")},model:{value:e.ruleForm.currency,callback:function(t){e.$set(e.ruleForm,"currency",t)},expression:"ruleForm.currency"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"currency_zh"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterChineseName")},model:{value:e.ruleForm.currency_zh,callback:function(t){e.$set(e.ruleForm,"currency_zh",t)},expression:"ruleForm.currency_zh"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"public_chain"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterChain")},model:{value:e.ruleForm.public_chain,callback:function(t){e.$set(e.ruleForm,"public_chain",t)},expression:"ruleForm.public_chain"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"contract_address"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterContractAddress")},model:{value:e.ruleForm.contract_address,callback:function(t){e.$set(e.ruleForm,"contract_address",t)},expression:"ruleForm.contract_address"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"official_website"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterOweHref")},model:{value:e.ruleForm.official_website,callback:function(t){e.$set(e.ruleForm,"official_website",t)},expression:"ruleForm.official_website"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"white_paper_url"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterWhitePaperHref")},model:{value:e.ruleForm.white_paper_url,callback:function(t){e.$set(e.ruleForm,"white_paper_url",t)},expression:"ruleForm.white_paper_url"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"desc"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterDesc"),type:"textarea"},model:{value:e.ruleForm.desc,callback:function(t){e.$set(e.ruleForm,"desc",t)},expression:"ruleForm.desc"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"team_introduction"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterTeamIntroduction"),type:"textarea"},model:{value:e.ruleForm.team_introduction,callback:function(t){e.$set(e.ruleForm,"team_introduction",t)},expression:"ruleForm.team_introduction"}})],1),e._v(" "),a("el-form-item",{attrs:{prop:"trade_txid"}},[a("el-input",{attrs:{placeholder:e.$t("apply:PleaseEnterBusinessTxid")},model:{value:e.ruleForm.trade_txid,callback:function(t){e.$set(e.ruleForm,"trade_txid",t)},expression:"ruleForm.trade_txid"}})],1),e._v(" "),a("div",{staticStyle:{"text-align":"left"}},[a("div",[e._v(e._s(e.$t("apply:ListingFee")))]),e._v(" "),a("div",[e._v(e._s(e.$t("apply:doNotParticipate01")))]),e._v(" "),a("div",[e._v(e._s(e.$t("apply:doNotParticipate02")))]),e._v(" "),a("div",[e._v(e._s(e.$t("apply:feeMethodTxid")))]),e._v(" "),a("div",{},[e._v("\r\n                        "+e._s(e.$t("apply:BNBChainToken"))+": 0x2c037110C6894D8fa70a09B3024c13D1d0687b3e\r\n                        "),a("span",{directives:[{name:"clipboard",rawName:"v-clipboard:copy",value:"0x2c037110C6894D8fa70a09B3024c13D1d0687b3e",expression:"'0x2c037110C6894D8fa70a09B3024c13D1d0687b3e'",arg:"copy"},{name:"clipboard",rawName:"v-clipboard:success",value:e.copySuccess,expression:"copySuccess",arg:"success"}],staticStyle:{"margin-left":"10px",color:"#409eff","text-decoration":"underline",cursor:"pointer"}},[e._v(e._s(e.$t("apply:Copy")))])])]),e._v(" "),a("el-form-item",[a("el-button",{staticClass:"apply-button",attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v(e._s(e.$t("apply:Apply")))])],1)],1)],1):a("div",{staticClass:"marginTop",style:{width:e.isMobel?"90%":"80%"}},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.applyList,height:"650"}},[a("el-table-column",{attrs:{prop:"address",label:"User",align:"center","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.addressStr(t.row.address)))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("apply:tokenName"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.currency))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("apply:tokenNameZh"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.currency_zh))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("apply:chain"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.public_chain))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("apply:businessTxid"),align:"center","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.trade_txid))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("game:Time"),align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.time))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("game:State"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[0==t.row.state?a("span",[e._v(e._s(e.$t("apply:Failed")))]):a("span",[e._v(e._s(e.$t("apply:Passed")))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"",label:e.$t("public:Action"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",size:"small"},on:{click:function(a){return e.showTokenDetail(t.row)}}},[e._v(e._s(e.$t("apply:detail")))])]}}])})],1),e._v(" "),a("el-row",{staticClass:"pages"},[a("el-col",{attrs:{span:24}},[a("div",{staticStyle:{float:"right"}},[a("wbc-page",{attrs:{total:e.total,pageSize:e.pageSize,currPage:e.currPage},on:{changeLimit:e.limitPaging,changeSkip:e.skipPaging}})],1)])],1)],1)],1)],1),e._v(" "),a("el-dialog",{attrs:{title:e.$t("apply:detail"),visible:e.showApplyDialog,"show-close":!0,width:e.isMobel?"90%":"50%"},on:{"update:visible":function(t){e.showApplyDialog=t}}},[a("div",{},[a("el-descriptions",{attrs:{title:"",column:1}},[a("el-descriptions-item",{attrs:{label:e.$t("apply:tokenName")}},[e._v(e._s(e.applyDetail.currency))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:tokenNameZh")}},[e._v(e._s(e.applyDetail.currency_zh))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:chain")}},[e._v(e._s(e.applyDetail.public_chain))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:contractAddress")}},[e._v(e._s(e.applyDetail.contract_address))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:oweHref")}},[e._v(e._s(e.applyDetail.official_website))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:whitePaperHref")}},[e._v(e._s(e.applyDetail.white_paper_url))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:desc")}},[e._v(e._s(e.applyDetail.desc))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:teamIntroduction")}},[e._v(e._s(e.applyDetail.team_introduction))]),e._v(" "),a("el-descriptions-item",{attrs:{label:e.$t("apply:businessTxid")}},[e._v(e._s(e.applyDetail.trade_txid))])],1)],1)])],1)};r._withStripped=!0;var n={render:r,staticRenderFns:[]};t.a=n},CD9d:function(e,t,a){"use strict";var r=function(){var e=this.$createElement,t=this._self._c||e;return t("nav",[t("div",{staticClass:"grid-content"},[t("div",{staticClass:"pagination"},[t("el-pagination",{attrs:{"current-page":this.currPage,"page-sizes":[10,20,30,50,100],"page-size":this.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:this.total},on:{"size-change":this.handleSizeChange,"current-change":this.handleCurrentChange}})],1)])])};r._withStripped=!0;var n={render:r,staticRenderFns:[]};t.a=n},"Dd+f":function(e,t,a){(e.exports=a("FZ+f")(!1)).push([e.i,'\n.pagination[data-v-09512f3f]{float:right\n}\n.pagination[data-v-09512f3f] .el-pagination__total,.pagination[data-v-09512f3f] .el-pagination__jump{color:#1C1C1B\n}\n[data-theme="light"] .pagination[data-v-09512f3f] .el-pagination__total,[data-theme="light"] .pagination[data-v-09512f3f] .el-pagination__jump{color:#1C1C1B\n}\n[data-theme="dark"] .pagination[data-v-09512f3f] .el-pagination__total,[data-theme="dark"] .pagination[data-v-09512f3f] .el-pagination__jump{color:#fff\n}\n.pagination[data-v-09512f3f] .el-input__inner{background-color:#333;color:#1C1C1B\n}\n[data-theme="light"] .pagination[data-v-09512f3f] .el-input__inner{background-color:#fff\n}\n[data-theme="dark"] .pagination[data-v-09512f3f] .el-input__inner{background-color:#333\n}\n[data-theme="light"] .pagination[data-v-09512f3f] .el-input__inner{color:#1C1C1B\n}\n[data-theme="dark"] .pagination[data-v-09512f3f] .el-input__inner{color:#fff\n}\n',""])},ZdaY:function(e,t,a){"use strict";var r=a("NYxO"),n=a("+zHA"),i=a("pMNZ"),o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e};function l(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,a){return function r(n,i){try{var o=t[n](i),l=o.value}catch(e){return void a(e)}if(!o.done)return Promise.resolve(l).then(function(e){r("next",e)},function(e){r("throw",e)});e(l)}("next")})}}t.a={name:"",data:function(){return{activeName:"1",screenWidth:document.body.clientWidth,size:"",loading:!1,ruleForm:{currency:"",currency_zh:"",public_chain:"",contract_address:"",official_website:"",white_paper_url:"",desc:"",team_introduction:"",trade_txid:""},currPage:1,pageSize:30,total:0,applyList:[],showApplyDialog:!1,applyDetail:{}}},computed:o({},Object(r.c)({address:function(e){return e.base.address},isConnected:function(e){return e.base.isConnected},mainTheme:function(e){return e.comps.mainTheme},apiUrl:function(e){return e.base.apiUrl},isMobel:function(e){return e.comps.isMobel}}),{rules:function(){var e={currency:[{required:!0,message:this.$t("apply:PleaseEnterName"),trigger:"blur"}],currency_zh:[{required:!0,message:this.$t("apply:PleaseEnterChineseName"),trigger:"blur"}],public_chain:[{required:!0,message:this.$t("apply:PleaseEnterChain"),trigger:"blur"}],contract_address:[{required:!0,message:this.$t("apply:PleaseEnterContractAddress"),trigger:"blur"}],white_paper_url:[{required:!0,message:this.$t("apply:PleaseEnterWhitePaperHref"),trigger:"blur"}],official_website:[{required:!0,message:this.$t("apply:PleaseEnterOweHref"),trigger:"blur"}],desc:[{required:!0,message:this.$t("apply:PleaseEnterDesc"),trigger:"blur"}],team_introduction:[{required:!0,message:this.$t("apply:PleaseEnterTeamIntroduction"),trigger:"blur"}],trade_txid:[{required:!0,message:this.$t("apply:PleaseEnterBusinessTxid"),trigger:"blur"}]};return e}}),mounted:function(){var e=this;window.onresize=function(){e.screenWidth=document.body.clientWidth}},created:function(){},watch:{},components:{"wbc-page":i.a},methods:{getApplyList:function(e){var t=this;return l(regeneratorRuntime.mark(function a(){return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:(!e||void 0==e||e.length<=0)&&(e={address:t.address,page:t.currPage,limit:t.pageSize}),t.loading=!0,axios.get(t.apiUrl+"/Api/Apply/getApplyList",{params:e}).then(function(e){console.log(e),1e4==e.code?e.data.lists.length>0&&(t.applyList=e.data.lists,t.total=e.data.count):t.$message.error("加载数据失败"),t.loading=!1}).catch(function(e){t.loading=!1,t.$message.error(e)});case 3:case"end":return a.stop()}},a,t)}))()},showTokenDetail:function(e){console.log(e),this.applyDetail=e,this.showApplyDialog=!0},tokenClickFun:function(e){2==e&&this.getApplyList()},limitPaging:function(e){this.pageSize=e,this.getApplyList()},skipPaging:function(e){this.currPage=e,this.getApplyList()},submitForm:function(e){var t=this;this.$refs[e].validate(function(a){if(!a)return console.log("error submit!!"),!1;var r;t.ruleForm.address=t.address,Object(n.c)(t.apiUrl+"/Api/Apply/setApplyOwnData",t.ruleForm,(r=l(regeneratorRuntime.mark(function a(r){return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return console.log(r),r&&1e4==r.code?(t.$message({message:"Success!",type:"success"}),t.$refs[e].resetFields()):t.$message.error(r.msg),a.abrupt("return");case 3:case"end":return a.stop()}},a,t)})),function(e){return r.apply(this,arguments)}))})},resetForm:function(e){this.$refs[e].resetFields()},copySuccess:function(){this.$message({message:"Copy successfully!",type:"success"})},addressStr:function(e){return e.substring(0,4)+"***"+e.substring(e.length-3)}}}},ea8h:function(e,t,a){var r=a("2M4V");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a("rjj0")("23c5a2dc",r,!1,{})},ip7E:function(e,t,a){var r=a("Dd+f");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a("rjj0")("2ae6ff76",r,!1,{})},pMNZ:function(e,t,a){"use strict";var r=a("AO5d"),n=a("CD9d"),i=!1;var o=function(e){i||a("ip7E")},l=a("VU/8")(r.a,n.a,!1,o,"data-v-09512f3f",null);l.options.__file="src/components/Page.vue",t.a=l.exports}});