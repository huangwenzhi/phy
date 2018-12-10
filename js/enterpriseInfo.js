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

//页面初始化加载数据
window.onload = function() {
	messageManage({
			'id' : 'FirmMsg',
			'requestFields' : {},
			'responseFields' : {}
		}, afterGetDepartDetail, null);
}		
//得到信息后渲染到表单中
function afterGetDepartDetail (responseData, messageObj, status) {
	if(status=="success"){
		if (responseData) {
			$('#qiName').val(responseData.enterpriseName);//企业名称
			$('#xinyong').val(responseData.enterpriseId);//统一社会信用代码
			$('#kaihu').val(responseData.base_account_bank);//开户支行
			$('#zhuce').val(responseData.address);//企业注册地址
			$('#Name').val(responseData.jurpername);//法人姓名
			$('#faPhone').val(responseData.jurpertel);//法人手机号
			$('#lianName').val(responseData.linkman);//联系人姓名
			$('#lianPhone').val(responseData.linktel);//联系人手机号
			var idtype = responseData.idtype
			$('#idtype').html(idtype=="1" ? "企业营业执照：":idtype=="2" ? "组织机构代码：" : "统一社会信用代码：");
			var isgd = responseData.isgd
			if(isgd=="0"){
				$("#btn").removeClass("btn");
			}else{
				$("#btn").addClass("btn");
			}
		} else {
			$('#departInfoForm')[0].reset();
		}
	}
}
function btn1(){
	messageManage({
		'id' : 'firmMsgtols',
		'requestFields' : {},
		'responseFields' : {}
	}, aftertols, null);
}	
function aftertols(responseData, messageObj, status){
	if(status == "success"){//系统后台联通
	  if(responseData==null){
	  	top.window.Dialog.alert("当前企业不能更新为光大企业客户");
	  }else{
	  	$("#btn").addClass("btn");
	  	$('#qiName').val(responseData.enterpriseName);//企业名称
		$('#xinyong').val(responseData.enterpriseId);//统一社会信用代码
		$('#kaihu').val(responseData.base_account_bank);//开户支行
		$('#zhuce').val(responseData.address);//企业注册地址
		$('#Name').val(responseData.jurpername);//法人姓名
		$('#faPhone').val(responseData.jurpertel);//法人手机号
		$('#lianName').val(responseData.linkman);//联系人姓名
		$('#lianPhone').val(responseData.linktel);//联系人手机号
		$('#div').removeClass('div')
	  }
	}else{
		top.window.Dialog.alert("通讯失败！");
	}	
}	
//点击确认按钮更新为光大企业客户
function Yes(){
	messageManage({
		'id' : 'firmMsgchange',
		'requestFields' : {},
		'responseFields' : {}
	}, afterchange, null);
}

function afterchange(responseData, messageObj, status){
	if(status == "success"){//系统后台联通
		var resp_status = responseData.resp_status;
		if(resp_status == "AAAAAAA") {
			top.window.Dialog.alert("成功更新为光大企业客户");
			$('#div').addClass('div')
		} else {
			var resp_msg = responseData.resp_msg;
			top.window.Dialog.alert(resp_msg);
		}
	}else{
		top.window.Dialog.alert("通讯失败！");
	}	

}
