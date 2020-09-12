(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[21],{213:function(e,t,n){e.exports=n.p+"static/media/logo.4762334b.webp"},437:function(e,t,n){"use strict";n.r(t);var a=n(19),l=n(0),o=n.n(l),r=n(443),c=n(184),i=n(442),m=n(48),s=n(40),d=n.n(s),u=n(226),h=n.n(u),E=n(418),f=n(97),g=n(77),b=Object(l.lazy)((function(){return n.e(1).then(n.bind(null,211))})),y=r.a.Text;t.default=Object(l.memo)((function(e){var t=Object(l.useState)({}),r=Object(a.a)(t,2),s=r[0],u=r[1],p=Object(l.useState)(!1),_=Object(a.a)(p,2),W=_[0],v=_[1],w=Object(m.b)().vendorData;g.a.useWindowDimensions().width,Object(l.useEffect)((function(){w?u(w):d.a.get("/vendors/get-vendor/".concat(e.match.params.id)).then((function(e){u(e.data.vendor)})).catch((function(e){e.response?"Could not find vendor."===e.response.data.message&&c.b.error("Invalid Vendor Id"):c.b.error("Please check your internet connection")}))}),[w]);var S={view:{display:"flex",flexDirection:"column",color:"white",minHeight:"70vh",paddingLeft:20,paddinRight:20,fontSize:12},title:{fontWeight:"bold",marginBottom:4},select:{width:"80%"},image:{height:60,width:109.8,marginTop:10},mainHeading:{color:"#5cb85c"},heading:{fontSize:18,fontWeight:"bold",marginBottom:10}};return o.a.createElement(o.a.Fragment,null,o.a.createElement(i.a,{className:"site-page-header",onBack:W?function(){e.history.goBack()}:null,title:"Vendor Summary",extra:[o.a.createElement("img",{style:S.image,src:n(213),alt:"dollar"})]}),o.a.createElement("div",{style:S.view},o.a.createElement(y,{style:S.mainHeading},"Vendor KYC submitted successfully!"),o.a.createElement(y,null,h()(s.updatedAt).format("DD-MM-YYYY hh:mm A")),o.a.createElement(E.QRCode,{level:"Q",width:120,className:"qr-code",value:"".concat(f.apiUrl,"/summary-form/").concat(e.match.params.id)}),o.a.createElement("br",null),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold",whiteSpace:"nowrap"}},"Name")," - ",s.name),o.a.createElement("div",{style:{display:"flex",flexDirection:"row"}},o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Company Code")," - ",s.company_code),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold",marginLeft:20}},"Vendor Code")," - ",s.vendor_code)),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"PAN Number")," - ",s.pan_no),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"GST Number")," - ",s.gst_no),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Phone Number")," - ",s.phone_number),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Email")," - ",s.email),o.a.createElement("br",null),o.a.createElement(y,{style:S.heading},"Organization Details"),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Type Of Organization")," - ",s.type_of_organization),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"MSME")," - ","Y"===s.is_msme?"Yes":"No"),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Turnover ",">"," 500 cr.")," - ",s.turnover?"Yes":"No"),"Y"===s.is_msme?o.a.createElement(o.a.Fragment,null,o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"MSME Reg. No.")," - ",s.msme_reg_no),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"MSME Valid From")," - ",h()(s.msme_valid_from).format("DD-MM-YYYY"))):null,o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Address Line 1")," - ",s.address_line1),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Address Line 2")," - ",s.address_line2),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Address Line 3")," - ",s.address_line3),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"City")," - ",s.city),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"State")," - ",s.state),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Pin Code")," - ",s.pin_code),o.a.createElement("br",null),o.a.createElement(y,{style:S.heading},"Account and Bank Details"),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Account Head Name")," - ",s.accounts_head_name),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Account Head Phone")," - ",s.accounts_head_mobile),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Account Head Email")," - ",s.accounts_head_email),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Bank Name")," - ",s.bank_name),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Bank Account Number")," - ",s.bank_account_no),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Account Type")," - ",s.bank_account_type),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Bank IFSC")," - ",s.bank_ifsc),o.a.createElement("br",null),o.a.createElement(y,{style:S.heading},"Documents Provided"),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"PAN")," - ",s.pan_attachment&&s.pan_attachment.substr(7)),o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"GST")," - ",s.gst_attachment&&s.gst_attachment.substr(7)),"Y"===s.is_msme?o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"MSME")," - ",s.msme_attachment&&s.msme_attachment.substr(7)):null,o.a.createElement(y,null,o.a.createElement(y,{style:{fontWeight:"bold"}},"Bank")," - ",s.bank_cancelled_cheque&&s.bank_cancelled_cheque.substr(7)),o.a.createElement("div",{style:{display:"flex",flexDirection:"row",justifyContent:"space-around"}},o.a.createElement(l.Suspense,null,o.a.createElement(b,{type:"primary",title:"Print",width:"30%",print:W,onClick:function(){setTimeout((function(){v(!0),window.print(),v(!1),e.history.push("/gst-listing/".concat(s.pan_no))}),1e3)}})),o.a.createElement(l.Suspense,null,o.a.createElement(b,{type:"primary",title:"Share",width:"30%",print:W,onClick:function(){navigator.share&&navigator.share({title:"Dollar Vendor ".concat(s._id),text:"Get the information of your account with us",url:"https://www.dollarvendorapp.com/summary-form/".concat(e.match.params.id)}).then((function(){return console.log("Successful Share")})).catch((function(e){return console.log("Error sharing application",e)}))}})))))}))}}]);
//# sourceMappingURL=21.8ffcb768.chunk.js.map