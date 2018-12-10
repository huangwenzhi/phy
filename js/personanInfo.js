//输入框,global
$(window).bind("load",function(){
//初始化工具提示
	$("[data-toggle='tooltip']").popover();
});
//输入框,global
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
window.onload = function() {
	messageManage({
		'id' : 'searchUserMsg',
		'requestFields' : {},
		'responseFields' : {
			
		}
	}, afterGetDepartDetail, null);
}
//得到base64encode信息
var SecEditAgent;
var base64Encode;
//初始化加载安全控件
$(window).bind("load",function(){
	SecEditAgent = new secedit();
	messageManage({
			'id' : 'getBase64CodeAndPkey',
			'responseFields':{},
			'responseFields':{
			"base64Encode":"base64Encode"
			}
		}, afterGetBase64Code, null); 
			
	function afterGetBase64Code(responseData,messageObj,status){
			if(status == "success"){//系统后台联通
				 base64Encode=responseData.base64Encode;
				 SecEditAgent.init("SM2_Norma1", "FakeSecEditBox1", "pass_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma2", "FakeSecEditBox2", "repass_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma3", "FakeSecEditBox3", "old_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma4", "FakeSecEditBox4", "old_pwd", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
			}else{
				alert("获得初始化数据错误");
		}
	};
});
	
//得到信息后渲染到表单中
function afterGetDepartDetail (responseData, messageObj, status) {
	if(status=='success'){
		if (responseData) {
			$('#userMsg').val(responseData.username);//用户账号
			$('#UserName').val(responseData.name);//个人信息页用户姓名
			$('#userName').val(responseData.name);//修改密码页面用户姓名
			$('#YLXX').val(responseData.ylxx);//预留信息
			$('#yuliu').val(responseData.ylxx);//修改预留信息反显
			if(responseData.enterpriseId==null){
				$("#Qyrz").removeClass("qyrz")
			}else{
				$("#Qyrz").addClass("qyrz")
			}
		} else {
			$('#UserForm')[0].reset();
		}
	}
}
//企业认证跳转	
function enterCerti(){
	messageManage({
		'id' : 'searchUserMsg',
		'requestFields' : {},
		'responseFields' : {}
	},afterenter, null);
}

function afterenter(responseData, messageObj, status) {
	if(status=='success'){
		if (responseData) {
			var username = responseData.username;
			var mdname = $.md5(username);
  			sessionStorage.setItem("username",username);
  			sessionStorage.setItem("mdname",mdname);
  			top.window.location.href=("../enterCerti.html");
		}
	}
}


//安全控件
var value11;
var	clientRandom1;
var value22;
var	clientRandom2;
var value33;
var	clientRandom3;
var pwdCodeInput;
function updpwdYes() {
	//是否加载安全控件
	var isInstalled1=secedit.prototype.checkIsInstalled("pass_encode").val;
	var isInstalled2=secedit.prototype.checkIsInstalled("repass_encode").val;
	var isInstalled3=secedit.prototype.checkIsInstalled("old_encode").val;
	if(!isInstalled1){
		alert("加载安全控件2失败");
		return;
	};
	if(!isInstalled2){
		alert("加载安全控件3失败");
		return;
	};
	if(!isInstalled3){
		alert("加载安全控件1失败");
		return;
	}
	//校验长度
	var passlength1= secedit.prototype.getLengthIntensity("pass_encode").val;
	var passlength2= secedit.prototype.getLengthIntensity("repass_encode").val;
	var passlength3= secedit.prototype.getLengthIntensity("old_encode").val;
	
	if(!passlength1){
		alert("密码长度不符合规则，密码长度为8-16位");
		return;
	}
	
	if(!passlength2){
		alert("确认密码长度不符合规则，密码长度为8-16位");
		return;
	};
	if(!passlength3){
		alert("旧密码长度不符合规则，密码长度为8-16位");
		return;
	};
	//密码检测
	var passIsGood1= secedit.prototype.getComplexIntensity("pass_encode").val;
	var passIsGood2= secedit.prototype.getComplexIntensity("repass_encode").val;
	var passIsGood3= secedit.prototype.getComplexIntensity("old_encode").val;
	if(!passIsGood1){
		alert("密码不符合规则,数字字母组合为必填项,符号选填")
		return;
	};
	if(!passIsGood2){
		alert("确认密码不符合规则,数字字母组合为必填项,符号选填")
		return;
	};
	if(!passIsGood3){
		alert("旧密码不符合规则,数字字母组合为必填项,符号选填")
		return;
	};
	
	value11 = secedit.prototype.getValue("pass_encode").val;
	value22 = secedit.prototype.getValue("repass_encode").val;
	value33 = secedit.prototype.getValue("old_encode").val;
	clientRandom1=secedit.prototype.getClientRandom("pass_encode").val;
	// 获取被加密的客户端确认随机数，需要提交给后台
	clientRandom2=secedit.prototype.getClientRandom("repass_encode").val;
	clientRandom3=secedit.prototype.getClientRandom("old_encode").val;				
	pwdCodeInput = $("#pwdCodeInput").val();
	messageManage({
		'id': 'updpwd',
		'requestFields': {
		},
		'responseFields': {
			"resp_status": "resp_status",
			"resp_msg": "resp_msg"
		}
	}, updpwdafter, updpwdbefore);
	 // 设置禁用效果，不再响应点击事件
		$("#keep").attr({"disabled":"disabled"});
		// 设置样式
		$("#keep").addClass("btn_disable");
	
}
			function updpwdbefore(messageObj) {
					messageObj.setData({
						"newpw":value11,
						"newpw2":value22,
						"password":value33,
				    	"crnewpw":clientRandom1,
				    	"crnewpw2":clientRandom2,
				    	"crpassword":clientRandom3,
				    	"base64Encode":base64Encode,
				    	"dx":pwdCodeInput
   			 	}); 	
			}
			//修改成功执行
			function updpwdafter(responseData, messageObj, status) {
				if(status == "success") {
					var resp_status = responseData.resp_status;
					//修改成功执行
					if(resp_status == "AAAAAAA") { 
						$("#updPwdmol").modal("show")
						$("#keep").attr("disabled", false); //启用按钮  
						$("#keep").removeClass("btn_disable");//将class移除
						//top.window.Dialog.alert("修改成功，请重新登录");
						//top.window.location.href=("../../../login.html");
						//window.open("https://114.255.114.194:12443/login.html");
					} else {
					//修改失败执行
						var resp_msg = responseData.resp_msg;
						top.window.Dialog.alert(resp_msg);
						$("#keep").attr("disabled", false); //启用按钮  
						$("#keep").removeClass("btn_disable");//将class移除
					}
				}else{
					top.window.Dialog.alert("通讯错误。");
					$("#keep").attr("disabled", false); //启用按钮  
					$("#keep").removeClass("btn_disable");//将class移除
				}
			}
function updPwdYes(){
	top.window.location.href = ("../../../login.html");
}
		