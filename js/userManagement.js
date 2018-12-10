  //表单,global
$(window).bind("load",function(){
//form
 $(".poin-form").each(function(){
  var _$form = $(this);
  //获取form的id
  var formId=_$form.attr("id");
  if(_$form.attr("data-init") != undefined){
  //FORM初始化
  var messageData = processMessageData(_$form.attr("data-init"));
  //创建 MessageObject
  var messageObj = new MessageObject(messageData);
  //添加参数
  messageObj.addRequestParam({});
  //发送请求拼装数据
  messageObj.ajax(function(responseData){
  //报文格式加工
  _$form.unSerializeJson(responseData);
  });
  }
  //如果设置防重复提交，则发送通讯初始化token令牌
  if(_$form.attr("data-isToken")=="true"){
  	messageManage({'id':'inittoken','responseFields':{},'requestFields':{}},afterToken,beforeToken);
  	function beforeToken(messageObj){
	messageObj.addRequestParam({
		"formId": formId
		});
	}
	function afterToken(responseData,messageObj,status){
		if(status == "success"){
			$("#com_ec_common_web_TOKEN_"+formId).val(responseData.token);
		}else{
			top.window.Dialog.alert("token令牌生成失败");
		}	
	}
  }
 });
});
//表单,global
//输入框,global
$(window).bind("load",function(){
//初始化工具提示
	$("[data-toggle='tooltip']").popover();
});
//输入框,global
//表格,global
$(window).bind("load",function(){
 // grid初始化
 $("table[data-init]").each(function(){
  var _$table = $(this);
  var sidePagination = _$table.attr("data-side-pagination");
  if(_$table.attr("data-init") != undefined && "server"!=sidePagination){
	  // 初始化
	  var messageData = processMessageData(_$table.attr("data-init"));
	  // 创建 MessageObject
	  var messageObj = new MessageObject(messageData);
	  // 添加参数
	  messageObj.addRequestParam({});
	   //先执行before方法
	  if(_$table.attr("event-beforeLoad") != undefined){
	     window[_$table.attr("event-beforeLoad")](_$table,messageObj);
	  }
	  // 发送请求拼装数据
	  messageObj.ajax(function(responseData){
	   // 报文格式加工
	   var data = processGridData(responseData,messageObj);
	   _$table.bootstrapTable('load',data);
	   //加载成功后事件
		if(_$table.attr("event-loadsuccess") != undefined){
	     window[_$table.attr("event-loadsuccess")](_$table,data);
	  }
    });
   }
 });
});
//表格,global

//光大ukey验证
//需要向后台传递的变量
var IssuerDN;
var SerialNumber;
var SubjectDN;
var CryptoAgent = "";
// Create ActiveX object according to the platform
function OnLoad(messageObj) {
    try {
        var eDiv = document.createElement("div");
        if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
            if (window.navigator.cpuClass == "x86") {
                eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.Ultimate.x86.cab\" classid=\"clsid:4C588282-7792-4E16-93CB-9744402E4E98\" ></object>";
            }
            else {
                eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"CryptoKit.Ultimate.x64.cab\" classid=\"clsid:B2F2D4D4-D808-43B3-B355-B671C0DE15D4\" ></object>";
            }
        }
        else {
            eDiv.innerHTML = "<embed id=\"CryptoAgent\" type=\"application/npCryptoKit.Ultimate.x86\" style=\"height: 0px; width: 0px\">";
        }
        document.body.appendChild(eDiv);
    }
    catch (e) {
        alert(e);
        return;
    }
    CryptoAgent = document.getElementById("CryptoAgent");
    
	// Select certificate
     try {                  
            var subjectDNFilter = "";
            var issuerDNFilter = "";
            var serialNumFilter = "";
            var bSelectCertResult = "";
            bSelectCertResult = CryptoAgent.SelectCertificate(subjectDNFilter, issuerDNFilter, serialNumFilter);                        
            if (!bSelectCertResult) 
            {
                var errorDesc = CryptoAgent.GetLastErrorDesc();
                alert(errorDesc);
                return;
            }
         }                  
    catch (e) {
        var errorDesc = CryptoAgent.GetLastErrorDesc();
        alert(errorDesc);
        return;
    }
    // Get certificate information
    try {     
        // certificate information identifier
        IssuerDN = CryptoAgent.GetSignCertInfo("IssuerDN");
		SerialNumber = CryptoAgent.GetSignCertInfo("SerialNumber");
        SubjectDN = CryptoAgent.GetSignCertInfo("SubjectDN");
        var errorDesc;
        if (!IssuerDN) {
            errorDesc = CryptoAgent.GetLastErrorDesc();
            alert(errorDesc);
            return;
        }else if (!SerialNumber) {
            errorDesc = CryptoAgent.GetLastErrorDesc();
            alert(errorDesc);
            return;
        }else if(!SubjectDN){
        	errorDesc = CryptoAgent.GetLastErrorDesc();
            alert(errorDesc);
            return;
        }
    } catch (e) {
        var errorDesc = CryptoAgent.GetLastErrorDesc();
        alert(errorDesc);
        return;
    } 
    
    
    messageObj.setData({
    	"SubjectDN":SubjectDN
    }); 
}

var cebUserOrNot;
function binding(value){
	var ids = getIdSelections();
	if(ids && ids.length > 1) {
		top.window.Dialog.alert("只能选择一条数据");
		return;
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("请选择一条数据");
		return;
	} else {
	cebUserOrNot=value;
   	messageManage({
	   'id' : 'cebUkeyCheck',
	    'requestFields' : {
		 },
	   'responseFields' : {
		 "cebUkeyMessage":"cebUkeyMessage"
	     }
      },afterCeb,OnLoad);		
    }  
}
//校验检查结果
function afterCeb(responseData, messageObj, status){
	//得到系统后台返回状态值
	if(status == "success"){//系统后台联通
		var cebUkeyMessage=responseData.cebUkeyMessage;
		if(cebUkeyMessage=="0"){
			//证明用户插入的Ukey与选择的相同,Ukey认证
			bindingInfo();
		}else{
			//证明用户插入的Ukey与选择的不相同
			alert("非光大ukey");
		}
	}else{
		alert("未与后台建立连接");
	}
}
//=========================================================================================
//调用CFCA接口去验证
//function UkeyVer(){
//	messageManage({
//	   'id' : 'UkeyVer',
//	    'requestFields' : {
//		 },
//	   'responseFields' : {
//		 "checkUkeyMessage":"checkUkeyMessage"
//	     }
//      },afterUkey);		
//}


//function beforeUkey(messageObj){
//	 messageObj.setData({
//    	"enterpriseId":EnterpriseId,
//    	"enterpriseName":EnterpriseName,
//    	"issuerDN":IssuerDN,
//    	"serialNumber":SerialNumber
//    }); 
//}

//校验检查结果
//function afterUkey(responseData, messageObj, status){
//	//得到系统后台返回状态值
//	if(status == "success"){//系统后台联通
//		var checkUkeyMessage=responseData.checkUkeyMessage;
//		if(checkUkeyMessage=="0"){
//			//认证成功，最后一次进行客户注册校验
//			bindingInfo();
//		};
//		if(checkUkeyMessage=="1"){
//			alert("证书已过期");
//		};
//		if(checkUkeyMessage=="2"){
//			alert("证书已吊销");
//		};
//		if(checkUkeyMessage=="6"){
//			alert("前台获取数据不全");
//		};
//		if(checkUkeyMessage=="7"){
//			alert("ukey证书对应统一社会信用代码与企业名称和用户输入的不符合");
//		};
//		if(checkUkeyMessage=="8"){
//			alert("Ukey非企业Ukey");
//		};
//		if(checkUkeyMessage=="9"){
//			alert("Ukey认证不通过");
//		};
//	}else{
//		alert("未与后台建立连接");
//	}
//}

//----------------------- 绑定按钮开始 ----------------------->
//var username;
var name;
var idcardno;
var jmPhoneNum;
function bindingInfo(){
		var datarow = getRowSelections();
		username = datarow[0].username;
		idcardno = datarow[0].idcardno;
		name = datarow[0].name;
		jmPhoneNum = $.md5(username);
		messageManage({
	   		'id' : 'useUk',
	    	'requestFields' : {
	    		
			 },
	   		'responseFields' : {
		 		"resp_status": "resp_status",
				"resp_msg": "resp_msg"
	     	}
      	},afterbinding,beforebinding);
		
      	// 设置禁用效果，不再响应点击事件
		$("#BDAN").attr({"disabled":"disabled"});
		// 设置样式
		$("#BDAN").addClass("btn_disable");
	
}
function beforebinding(messageObj) {
		messageObj.setData({
			'name':name,
	    	'idcardno':idcardno,
			'username': username,
			'ukserno': SerialNumber,
			'dnno' : SubjectDN,
			"vuname":jmPhoneNum,
		});
	}
	function afterbinding(responseData, messageObj, status){
		if(status == "success"){//系统后台联通
			var resp_status = responseData.resp_status;
			if(resp_status == "AAAAAAA") {
				top.window.Dialog.alert("绑定成功。");
				$("#tab").bootstrapTable('refresh');
				$("#BDAN").attr("disabled", false); //启用按钮  
				$("#BDAN").removeClass("btn_disable");//将class移除
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#BDAN").attr("disabled", false); //启用按钮  
				$("#BDAN").removeClass("btn_disable");//将class移除
			}
		}else{
			top.window.Dialog.alert("通讯失败！");
			$("#BDAN").attr("disabled", false); //启用按钮  
			$("#BDAN").removeClass("btn_disable");//将class移除
		}	
	}
//----------------------- 绑定按钮结束 ----------------------->

//----------------------- 解绑按钮开始 ----------------------->
//var cebUserOrNot;
function Untie(){
	var ids = getIdSelections();
	if(ids && ids.length > 1) {
		top.window.Dialog.alert("只能选择一条数据");
		return;
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("请选择一条数据");
		return;
	} else {
	//cebUserOrNot=value;
		var datarow = getRowSelections();
		username = datarow[0].username;
		idcardno = datarow[0].idcardno;
		name = datarow[0].name;
		jmPhoneNum = $.md5(username);
		messageManage({
	   		'id' : 'canceUk',
	    	'requestFields' : {
	    		
			 },
	   		'responseFields' : {
		 		"resp_status": "resp_status",
				"resp_msg": "resp_msg"
	     	}
      	},afterUntie,beforeUntie);
		
      	// 设置禁用效果，不再响应点击事件
		$("#JBAN").attr({"disabled":"disabled"});
		// 设置样式
		$("#JBAN").addClass("btn_disable");
//   	messageManage({
//	   'id' : 'cebUkeyCheck',
//	    'requestFields' : {
//		 },
//	   'responseFields' : {
//		 "cebUkeyMessage":"cebUkeyMessage"
//	     }
//      },afterCebUser,OnLoad);		
    }  
}
//校验检查结果
//function afterCebUser(responseData, messageObj, status){
//	//得到系统后台返回状态值
//	if(status == "success"){//系统后台联通
//		var cebUkeyMessage=responseData.cebUkeyMessage;
//		if(cebUkeyMessage=="0"){
//			//证明用户插入的Ukey与选择的相同,Ukey认证
//			UntieInfo();
//		}else{
//			//证明用户插入的Ukey与选择的不相同
//			alert("非光大ukey");
//		}
//	}else{
//		alert("未与后台建立连接");
//	}
//}
//=========================================================================================
//调用CFCA接口去验证
//function UkeyVer(){
//	messageManage({
//	   'id' : 'UkeyVer',
//	    'requestFields' : {
//		 },
//	   'responseFields' : {
//		 "checkUkeyMessage":"checkUkeyMessage"
//	     }
//      },afterUkeyVer);		
//}


//function beforeUkeyVer(messageObj){
//	 messageObj.setData({
//    	"enterpriseId":EnterpriseId,
//    	"enterpriseName":EnterpriseName,
//    	"issuerDN":IssuerDN,
//    	"serialNumber":SerialNumber
//    }); 
//}

//校验检查结果
//function afterUkeyVer(responseData, messageObj, status){
//	//得到系统后台返回状态值
//	if(status == "success"){//系统后台联通
//		var checkUkeyMessage=responseData.checkUkeyMessage;
//		if(checkUkeyMessage=="0"){
//			//认证成功，最后一次进行客户注册校验
//			UntieInfo();
//			
//		};
//		if(checkUkeyMessage=="1"){
//			alert("证书已过期");
//		};
//		if(checkUkeyMessage=="2"){
//			alert("证书已吊销");
//		};
//		if(checkUkeyMessage=="6"){
//			alert("前台获取数据不全");
//		};
//		if(checkUkeyMessage=="7"){
//			alert("ukey证书对应统一社会信用代码与企业名称和用户输入的不符合");
//		};
//		if(checkUkeyMessage=="8"){
//			alert("Ukey非企业Ukey");
//		};
//		if(checkUkeyMessage=="9"){
//			alert("Ukey认证不通过");
//		};
//	}else{
//		alert("未与后台建立连接");
//	}
//}
//function UntieInfo(){
//		var datarow = getRowSelections();
//		username = datarow[0].username;
//		idcardno = datarow[0].idcardno;
//		name = datarow[0].name;
//		messageManage({
//	   		'id' : 'canceUk',
//	    	'requestFields' : {
//	    		
//			 },
//	   		'responseFields' : {
//		 		"resp_status": "resp_status",
//				"resp_msg": "resp_msg"
//	     	}
//      	},afterUntie,beforeUntie);
//		
//      	// 设置禁用效果，不再响应点击事件
//		$("#JBAN").attr({"disabled":"disabled"});
//		// 设置样式
//		$("#JBAN").addClass("btn_disable");
//	}
function beforeUntie(messageObj) {
		messageObj.setData({
			'name':name,
	    	'idcardno':idcardno,
			"username": username,
			'ukserno': SerialNumber,
			'dnno' : SubjectDN,
			"vuname":jmPhoneNum,
		});
	}
	function afterUntie(responseData, messageObj, status){
		if(status == "success"){//系统后台联通
			var resp_status = responseData.resp_status;
			if(resp_status == "AAAAAAA") {
				top.window.Dialog.alert("解绑成功。");
				$("#tab").bootstrapTable('refresh');
				$("#JBAN").attr("disabled", false); //启用按钮  
				$("#JBAN").removeClass("btn_disable");//将class移除
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#JBAN").attr("disabled", false); //启用按钮  
				$("#JBAN").removeClass("btn_disable");//将class移除
			}
		}else{
			top.window.Dialog.alert("通讯失败！");
			$("#JBAN").attr("disabled", false); //启用按钮  
			$("#JBAN").removeClass("btn_disable");//将class移除
		}	
	}
//----------------------- 解绑按钮结束 ----------------------->	


//----------------------- 发送首次登录密码开始 ----------------------->
//发送首次登录密码
function SendPwd(){
	var ids = getIdSelections();
	if(ids && ids.length > 1) {
		top.window.Dialog.alert("只能选择一条数据");
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("请选择一条数据");
	} else {
		
		var datarow = getRowSelections();
		username = datarow[0].username;
		jmPhoneNum = $.md5(username);
		messageManage({
			'id': 'sendPassword',
			'requestFields': {
			},
			'responseFields': {
				"resp_status": "resp_status",
				"resp_msg": "resp_msg"
			}
		}, SendaAfter, Sendbefore);
		// 设置禁用效果，不再响应点击事件
		$("#sedpwd").attr({"disabled":"disabled"});
		// 设置样式
		$("#sedpwd").addClass("btn_disable");
	}
}
function Sendbefore(messageObj) {
		messageObj.setData({
			"username": username,
			"vuname":jmPhoneNum,
		});
	}
function SendaAfter(responseData, messageObj, status) {			
		if(status == "success") {
			var resp_status = responseData.resp_status;
			if(resp_status == "AAAAAAA") {
				top.window.Dialog.alert("发送成功，请查收");
				$("#tab").bootstrapTable('refresh');
				$("#sedpwd").attr("disabled", false); //启用按钮  
				$("#sedpwd").removeClass("btn_disable");//将class移除
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#tab").bootstrapTable('refresh');
				$("#sedpwd").attr("disabled", false); //启用按钮  
				$("#sedpwd").removeClass("btn_disable");//将class移除
			}
		}else{
			top.window.Dialog.alert("通讯失败！");
			$("#sedpwd").attr("disabled", false); //启用按钮  
			$("#sedpwd").removeClass("btn_disable");//将class移除
		}
	}
//----------------------- 发送首次登录密码结束 ----------------------->

//-------------------------删除开始------------------------->
		//删除  
		var delId = null;
		var username;
		function delTable() {
			delId = getIdSelections();
//			var datarow = getRowSelections();
			if(delId && delId.length > 1) {
				top.window.Dialog.alert("只能选择一条数据");
			} else if(delId && delId.length < 1) {
				top.window.Dialog.alert("请选择一条数据");
			} else {
				top.window.Dialog.confirm("确认删除？", null, null, null, function() {
					var datarow = getRowSelections();
					username = datarow[0].username;
					jmPhoneNum = $.md5(username)
					messageManage({
						'id': 'delManage',
						'requestFields': {
						},
						'responseFields': {
							"resp_status": "resp_status",
							"resp_msg": "resp_msg"
						}
					}, afterDelete, beforeDelete);
				});
			}
		}

		function beforeDelete(messageObj) {
			messageObj.setUriParam({
				"inboundToOutboundManagerId": delId,
				
			});
			messageObj.setData({
				"username": username,
				"vuname":jmPhoneNum,
			});
		}

		function afterDelete(responseData, messageObj, status) {
			
			if(status == "success") {
				var resp_status = responseData.resp_status;
				//删除成功执行
				if(resp_status == "AAAAAAA") { //如果没有未结束的交易就删除反之不能删除
					top.window.Dialog.alert("删除成功。");
					$("#tab").bootstrapTable('refresh');
				} else {
					//删除失败执行
					var resp_msg = responseData.resp_msg;
					top.window.Dialog.alert(resp_msg);
				}

			}else{
				top.window.Dialog.alert("通讯失败！");
			}
		}
//------------------------- 删除结束 ------------------------->

//------------------------- 添加开始 ------------------------->
		//添加页身份证输入框失去焦点事件校验
		function IDnumberBlur() {
			var IDInput = $("#idcardno");
			//    获取输入框内容
			var IDnumber = $("#idcardno").val();
			//  验证身份证格式
			　　
			function isID(IDInput) {　　
				var myreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;　　
				if(IDnumber == "") {
					$("#addIdText").html("身份证号不能为空");
				} else if(!myreg.test(IDnumber)) {　　
					$("#addIdText").html("请输入正确的身份证格式");　　
					return false;　　
				}　　
			}　　
			isID();
		}

		//添加页手机号输入框失去焦点事件校验
		function phone() {
			var phoneInput = $("#username");
			//    获取输入框内容
			var phonenumber = $("#username").val();
			//    验证手机号码格式和验证码格式
			　　
			function isPone(phoneInput) {　　
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;　　
				if(phonenumber == "") {
					$("#addPhoneText").html("手机号不能为空");
				} else if(!myreg.test(phonenumber)) {　　
					$("#addPhoneText").html("请输入正确的手机号格式");　　
					return false;　　
				}　　
			}　　
			isPone();
		}
		//姓名输入框失去焦点校验
		function addName(){
			var NameInput = $("#name");
			//    获取输入框内容
			var Namenumber = $("#name").val();
			//    验证手机号码格式和验证码格式
			　　
			function isPone(NameInput) {
				var myreg = /^[\u4e00-\u9fa5\A-Za-z\·]+$/;
				//将输入框的汉字转换成两个字符
				var len = Namenumber.replace(/[\u4E00-\u9FA5]/g,'aa').length;
				if(Namenumber == "") {
					$("#addName").html("用户姓名不能为空");
				} else if(!myreg.test(Namenumber)) {　　
					$("#addName").html("用户姓名输入格式不正确");　　
					return false;　　
				}else if(len>50){
					$("#addName").html("用户姓名输入的长度不能超过50个字符");
				}
			}　　
			isPone();
		}
		//手机号码框获得焦点，提示信息隐藏
		function phoneFocus() {
			$("#addPhoneText").html("");
			$("#tishi").html("");
		}
		//用户姓名输入框获得焦点，提示信息隐藏
		function addUserName() {
			$("#addName").html("");
			$("#tishi").html("");
		}
		//身份证号码框获得焦点，提示信息隐藏
		function IdFocus() {
			$("#addIdText").html("");
			$("#tishi").html("");
		}
		//添加按钮事件，点击 模态框显示
		function add() {
			$("#addApiIframe").modal("show")
		}
		//添加数据  先校验输入框然后发送
		var Name;
		var IDnumber;
		var phonenumber;
		function submitForm() {
			Name = $("#name").val();
			IDnumber = $("#idcardno").val();
			phonenumber = $("#username").val();
			jmPhoneNum=$.md5(phonenumber);//md5手机号加密
			var myreg = /^[\u4e00-\u9fa5\A-Za-z\·]+$/;
			var len = Name.replace(/[\u4E00-\u9FA5]/g,'aa').length;
			var myphone = /^[1][3,4,5,7,8][0-9]{9}$/;
			var myID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if(Name == ""||IDnumber==""||phonenumber=="") {
				top.window.Dialog.alert("请输入对应的内容信息");
				//$("#tishi").html("请输入对应的内容信息")
			}else if(!myreg.test(Name)){
				top.window.Dialog.alert("用户姓名格式不正确");
				//$("#tishi").html("用户姓名格式不正确")
			}else if(len>50){
				top.window.Dialog.alert("用户姓名输入的长度不能超过50个字符");
				//$("#tishi").html("用户姓名输入的长度不能超过50个字符")
			}else if(!myID.test(IDnumber)){
				top.window.Dialog.alert("身份证号格式不正确");
				//$("#tishi").html("身份证号格式不正确")
			}else if(!myphone.test(phonenumber)){
				top.window.Dialog.alert("手机号码格式不正确");
				//$("#tishi").html("手机号码格式不正确")
			}else if(myphone.test(phonenumber) && myID.test(IDnumber) && len<51 && myreg.test(Name)) {
				messageManage({
					'id': 'addManage',
					'requestFields': {
	    				
					},
					'responseFields': {
						"resp_status": "resp_status",
						"resp_msg": "resp_msg"
					}
				}, addafter, addbefore);
				// 设置禁用效果，不再响应点击事件
				$("#addTab").attr({"disabled":"disabled"});
				// 设置样式
				$("#addTab").addClass("btn_disable");
			}
		}
		function addbefore(messageObj) {
				messageObj.formSerializeAndSetData($("#boxFormApi"));
				messageObj.setData({
					'name':Name,
					'idcardno':IDnumber,
					'username':phonenumber,
					"vuname":jmPhoneNum
				});
			}
		function addafter(responseData, messageObj, status) {
			
				if(status == "success") {
					var resp_status = responseData.resp_status;
					//添加成功执行
					if(resp_status == "AAAAAAA") {
						top.window.Dialog.alert("添加成功。");
						$("#messageAlertObj").modal("hide");
						$("#addApiIframe").modal("hide");
						$(".addInput").val("")
						$("#tab").bootstrapTable('refresh');
						$("#addTab").attr("disabled", false); //启用按钮  
						$("#addTab").removeClass("btn_disable");//将class移除
					} else {
						var resp_msg = responseData.resp_msg;
						top.window.Dialog.alert(resp_msg);
						$("#tab").bootstrapTable('refresh');
						$("#addTab").attr("disabled", false); //启用按钮
						$("#addTab").removeClass("btn_disable");//将class移除  
					}
				}else{
					top.window.Dialog.alert("通讯失败！");
					$("#addTab").attr("disabled", false); //启用按钮  
					$("#addTab").removeClass("btn_disable");//将class移除
				}
			}
			
		//取消按钮事件，点击后隐藏输入框和提示信息
		function closeBox() {
			$("#addApiIframe").modal("hide");
			$("#boxFormApi")[0].reset();
			$(".warn").html("");
			$(".addInput").val("")

		}
//------------------------- 添加结束 ------------------------->
		
//------------------------- 修改开始 ------------------------->
		
		//修改按钮事件，提示用户只能选择一条信息
		var username1;
		
		function updateTab() {
			var ids = getIdSelections();
			if(ids && ids.length > 1) {
				top.window.Dialog.alert("只能选择一条数据");
			} else if(ids && ids.length < 1) {
				top.window.Dialog.alert("请选择一条数据");
			} else {
				$("#updataApiIframe").modal("show");
				var datarow = getRowSelections();
				$("#name").val(datarow[0].name);
				$("#idcardno").val(datarow[0].idcardno);
				$("#Username").val(datarow[0].username);
				$("#UKSTATUS").val(datarow[0].UKSTATUS);
				$("#passwordstatus").val(datarow[0].passwordstatus);
				username1 = datarow[0].username;
				jmPhoneNum=$.md5(username1);//md5加密手机号
			}
		}
		//修改页面校验
		//修改页身份证输入框失去焦点事件校验
		function updataID() {
			var IDInput = $("#updataIDnumber");
			//    获取输入框内容
			var IDnumber = $("#updataIDnumber").val();
			//  验证身份证格式
			　　
			function isID(IDInput) {　　
				var myreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;　　
				if(IDnumber == "") {
					$("#IDtext").html("身份证号不能为空");
				} else if(!myreg.test(IDnumber)) {
					$("#IDtext").html("请输入正确的身份证格式");　　
					return false;　　
				}　　
			}　　
			isID();
		}
		//修改页面用户姓名输入框失去焦点校验
		function updataNameBulr(){
			var NameInput = $("#updataName");
			//    获取输入框内容
			var Namenumber = $("#updataName").val();
			//  验证用户名格式
			function isID(NameInput) {
				var myreg = /^[\u4e00-\u9fa5\A-Za-z\·]+$/;
				var len = Namenumber.replace(/[\u4E00-\u9FA5]/g,'aa').length;
				if(Namenumber == "") {
					$("#updatauserName").html("用户姓名不能为空");
				} else if(!myreg.test(Namenumber)) {　　
					$("#updatauserName").html("用户姓名输入格式不正确");　　
					return false;　　
				}else if(len>50){
					$("#updatauserName").html("用户姓名输入的长度不能超过50个字符");
				}
			}　　
			isID();
		}
		//修改页手机号输入框失去焦点事件
		//function updataphone(){
		//var phoneInput = $("#updataPhone");
		//    获取输入框内容
		//var phonenumber = $("#updataPhone").val();
		//    验证手机号码格式和验证码格式
		　　 //function isPone(phoneInput){
		　　 //var myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
		　　 //if(phonenumber==""){
		//$("#phoneText").html("手机号码不能为空");
		//}else if (!myreg.test(phonenumber)) {
		//$("#phoneText").html("请输入正确的手机号格式");
		　　 //return false; 
		　　 //}
		　　 //}
		　　 //isPone();
		//}

		//修改页确定按钮事件，先验证输入框内的值是否合格
		var updataName;
		var updataIdNumber;
		var updataPhone
		function updataYes() {
			updataName = $("#updataName").val()
			updataIdNumber = $("#updataIDnumber").val();
			updataPhone = $("#updataPhone").val();
			
			var myreg = /^[\u4e00-\u9fa5\A-Za-z\·]+$/;
			var len = updataName.replace(/[\u4E00-\u9FA5]/g,'aa').length;
			var myphone = /^[1][3,4,5,7,8][0-9]{9}$/;
			var myID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if(updataName == "" || updataIdNumber == "") {
				//$("#updataTishi").html("请输入对应的信息")
				top.window.Dialog.alert("请输入对应的信息");
			}else if(!myID.test(updataIdNumber)){
				//$("#IDtext").html("身份证号格式不正确")
				top.window.Dialog.alert("身份证号格式不正确");
			}else if(!myreg.test(updataName)){
				//$("#IDtext").html("用户姓名格式不正确")
				top.window.Dialog.alert("用户姓名格式不正确");
			}else if(len>50){
				//$("#IDtext").html("用户姓名输入的长度不能超过50个字符")
				top.window.Dialog.alert("用户姓名输入的长度不能超过50个字符");
			}else if(myID.test(updataIdNumber) && myreg.test(updataName) && len<51) {
				messageManage({
					'id': 'updataManage',
					'requestFields': {
	    				
					},
					'responseFields': {
						"resp_status": "resp_status",
						"resp_msg": "resp_msg"
					}
				}, updataAfter, updatabefore);
				// 设置禁用效果，不再响应点击事件
				$("#updataTab").attr({"disabled":"disabled"});
				// 设置样式
				$("#updataTab").addClass("btn_disable");
			}
		}
		function updatabefore(messageObj) {
				messageObj.formSerializeAndSetData($("#boxForm"));
				messageObj.setData({
					'name':updataName,
					'idcardno':updataIdNumber,
					'username':username1,
					//'UKSTATUS':'#UKSTATUS',
					//'passwordstatus':'#passwordstatus'
					"vuname":jmPhoneNum
				});
			}
			function updataAfter(responseData, messageObj, status) {
					
					if(status == "success") {
						var resp_status = responseData.resp_status;
						if(resp_status == "AAAAAAA") {
							top.window.Dialog.alert("修改成功。");
							$("#updataApiIframe").modal("hide");
							$(".updataInput").val("")
							$("#tab").bootstrapTable('refresh');
							$("#updataTab").attr("disabled", false); //启用按钮
							$("#updataTab").removeClass("btn_disable");//将class移除  
						} else {
							var resp_msg = responseData.resp_msg;
							top.window.Dialog.alert(resp_msg);
							$("#tab").bootstrapTable('refresh');
							$("#updataTab").attr("disabled", false); //启用按钮  
							$("#updataTab").removeClass("btn_disable");//将class移除  
						}
					}else{
						top.window.Dialog.alert("通讯失败！");
						$("#updataTab").attr("disabled", false); //启用按钮  
						$("#updataTab").removeClass("btn_disable");//将class移除  
					}
				}
			
			//修改成功执行的逻辑
			
		//用户名输入框获得焦点提示信息隐藏
		function updataNameFocus() {
			$("#updatauserName").html("");
			$("#updataTishi").html("")
		}
		//手机号输入框获得焦点提示信息消失
		function updataFocus() {
			$("#phoneText").html("");
			$("#updataTishi").html("")
		}
		//身份证号输入框获得焦点提示信息消失
		function updataIDFocus() {
			$("#IDtext").html("");
			$("#updataTishi").html("")
		}
		//修改页取消按钮事件，模态框隐藏，提示信息和输入框的值清空
		function updataNo() {
			$("#updataApiIframe").modal("hide")
			$(".warn").html("");
			$(".updataInput").val("");
			$("#boxForm")[0].reset();
		}

//------------------------- 修改结束 ------------------------->

	//关闭模态框时清空输入框和提示信息
	$(".guan").on('click',function(){
			$(".addInput").val("");
			$(".updataInput").val("");
			$(".warn").html("");
	})
//模态框隐藏触发
function hideModal(){
	$("#boxFormApi")[0].reset();
	$("#boxForm")[0].reset();
}

		//获取选择id
		function getIdSelections() {
			return $.map($("#tab").bootstrapTable('getSelections'),
				function(row) {
					return row.id
				});
		}

		function getRowSelections() {
			getIndexSelections();
			return $("#tab").bootstrapTable('getSelections');
		}
		//获取索引
		function getIndexSelections() {
			var ids = $.map($("#tab").bootstrapTable('getSelections'),
				function(row) {
					return row.id
				});
			var num = 0;
			if(ids.length == 1) {
				var allTableData = $("#tab").bootstrapTable('getData');
				for(var i in allTableData) {
					if(ids[0] == allTableData[i].id) {
						num = i;
						break;
					}
				}
			}
			return num;
		}
//动态添加序号
//$(function(){
    //var len = $('#tab tr').length;
    //for(var i = 1;i<len;i++){
        //$('#tab tr:eq('+i+') td:nth-child(2)').text(i);
    //}   
//});
//uk绑定状态
function ukeyTrans(value,row,index){
	return [ '<div>', (value == "1" ? "是" : "否"), '</div>' ].join('');
}
//发送状态
function statusTrans(value,row,index){
	return [ '<div>', (value == "0" ? "未发送" : value == "1" ? "已发送短信，但未修改首次密码" : "已发送"), '</div>' ].join('');
}

//页面初始化将身份证号脱敏
//function idstatus(value,row,index){
	//return ['<div>',(value.substr(0,3) + '******' + value.substr(value.length - 4)),'</div>'].join('');
//}
//页面初始化将手机号脱敏
//function Phonestatus(value,row,index){
	//return ['<div>',(value.substr(0,3) + '******' + value.substr(value.length - 4)),'</div>'].join('');
//}

