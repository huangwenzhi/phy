//�����,global
$(window).bind("load",function(){
//��ʼ��������ʾ
	$("[data-toggle='tooltip']").popover();
});
//�����,global
//��,global
$(window).bind("load",function(){
//form
 $(".poin-form").each(function(){
  var _$form = $(this);
  //��ȡform��id
  var formId=_$form.attr("id");
  if(_$form.attr("data-init") != undefined){
  //FORM��ʼ��
  var messageData = processMessageData(_$form.attr("data-init"));
  //���� MessageObject
  var messageObj = new MessageObject(messageData);
  //��Ӳ���
  messageObj.addRequestParam({});
  //��������ƴװ����
  messageObj.ajax(function(responseData){
  //���ĸ�ʽ�ӹ�
  _$form.unSerializeJson(responseData);
  });
  }
  //������÷��ظ��ύ������ͨѶ��ʼ��token����
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
			top.window.Dialog.alert("token��������ʧ��");
		}	
	}
  }
 });
});



//��,global
window.onload = function() {
	messageManage({
		'id' : 'searchUserMsg',
		'requestFields' : {},
		'responseFields' : {
			
		}
	}, afterGetDepartDetail, null);
}
//�õ�base64encode��Ϣ
var SecEditAgent;
var base64Encode;
//��ʼ�����ذ�ȫ�ؼ�
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
			if(status == "success"){//ϵͳ��̨��ͨ
				 base64Encode=responseData.base64Encode;
				 SecEditAgent.init("SM2_Norma1", "FakeSecEditBox1", "pass_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma2", "FakeSecEditBox2", "repass_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma3", "FakeSecEditBox3", "old_encode", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
				 SecEditAgent.init("SM2_Norma4", "FakeSecEditBox4", "old_pwd", 220, 36, 8, 16, 1, 0, "#FF80FF", "#00F","(^[!-~]*[A-Za-z]+[!-~]*[0-9]+[!-~]*$)|(^[!-~]*[0-9]+[!-~]*[A-Za-z]+[!-~]*$)", base64Encode, "8977f7dde478430bab076858accb13f3ffa9d9c0ebb637bc4cd22334e2688d76a62797fd875605cd0e3a94d3efba3139945c94e58e73c9e1a90085aa46846a62");
			}else{
				alert("��ó�ʼ�����ݴ���");
		}
	};
});
	
//�õ���Ϣ����Ⱦ������
function afterGetDepartDetail (responseData, messageObj, status) {
	if(status=='success'){
		if (responseData) {
			$('#userMsg').val(responseData.username);//�û��˺�
			$('#UserName').val(responseData.name);//������Ϣҳ�û�����
			$('#userName').val(responseData.name);//�޸�����ҳ���û�����
			$('#YLXX').val(responseData.ylxx);//Ԥ����Ϣ
			$('#yuliu').val(responseData.ylxx);//�޸�Ԥ����Ϣ����
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
//��ҵ��֤��ת	
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


//��ȫ�ؼ�
var value11;
var	clientRandom1;
var value22;
var	clientRandom2;
var value33;
var	clientRandom3;
var pwdCodeInput;
function updpwdYes() {
	//�Ƿ���ذ�ȫ�ؼ�
	var isInstalled1=secedit.prototype.checkIsInstalled("pass_encode").val;
	var isInstalled2=secedit.prototype.checkIsInstalled("repass_encode").val;
	var isInstalled3=secedit.prototype.checkIsInstalled("old_encode").val;
	if(!isInstalled1){
		alert("���ذ�ȫ�ؼ�2ʧ��");
		return;
	};
	if(!isInstalled2){
		alert("���ذ�ȫ�ؼ�3ʧ��");
		return;
	};
	if(!isInstalled3){
		alert("���ذ�ȫ�ؼ�1ʧ��");
		return;
	}
	//У�鳤��
	var passlength1= secedit.prototype.getLengthIntensity("pass_encode").val;
	var passlength2= secedit.prototype.getLengthIntensity("repass_encode").val;
	var passlength3= secedit.prototype.getLengthIntensity("old_encode").val;
	
	if(!passlength1){
		alert("���볤�Ȳ����Ϲ������볤��Ϊ8-16λ");
		return;
	}
	
	if(!passlength2){
		alert("ȷ�����볤�Ȳ����Ϲ������볤��Ϊ8-16λ");
		return;
	};
	if(!passlength3){
		alert("�����볤�Ȳ����Ϲ������볤��Ϊ8-16λ");
		return;
	};
	//������
	var passIsGood1= secedit.prototype.getComplexIntensity("pass_encode").val;
	var passIsGood2= secedit.prototype.getComplexIntensity("repass_encode").val;
	var passIsGood3= secedit.prototype.getComplexIntensity("old_encode").val;
	if(!passIsGood1){
		alert("���벻���Ϲ���,������ĸ���Ϊ������,����ѡ��")
		return;
	};
	if(!passIsGood2){
		alert("ȷ�����벻���Ϲ���,������ĸ���Ϊ������,����ѡ��")
		return;
	};
	if(!passIsGood3){
		alert("�����벻���Ϲ���,������ĸ���Ϊ������,����ѡ��")
		return;
	};
	
	value11 = secedit.prototype.getValue("pass_encode").val;
	value22 = secedit.prototype.getValue("repass_encode").val;
	value33 = secedit.prototype.getValue("old_encode").val;
	clientRandom1=secedit.prototype.getClientRandom("pass_encode").val;
	// ��ȡ�����ܵĿͻ���ȷ�����������Ҫ�ύ����̨
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
	 // ���ý���Ч����������Ӧ����¼�
		$("#keep").attr({"disabled":"disabled"});
		// ������ʽ
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
			//�޸ĳɹ�ִ��
			function updpwdafter(responseData, messageObj, status) {
				if(status == "success") {
					var resp_status = responseData.resp_status;
					//�޸ĳɹ�ִ��
					if(resp_status == "AAAAAAA") { 
						$("#updPwdmol").modal("show")
						$("#keep").attr("disabled", false); //���ð�ť  
						$("#keep").removeClass("btn_disable");//��class�Ƴ�
						//top.window.Dialog.alert("�޸ĳɹ��������µ�¼");
						//top.window.location.href=("../../../login.html");
						//window.open("https://114.255.114.194:12443/login.html");
					} else {
					//�޸�ʧ��ִ��
						var resp_msg = responseData.resp_msg;
						top.window.Dialog.alert(resp_msg);
						$("#keep").attr("disabled", false); //���ð�ť  
						$("#keep").removeClass("btn_disable");//��class�Ƴ�
					}
				}else{
					top.window.Dialog.alert("ͨѶ����");
					$("#keep").attr("disabled", false); //���ð�ť  
					$("#keep").removeClass("btn_disable");//��class�Ƴ�
				}
			}
function updPwdYes(){
	top.window.location.href = ("../../../login.html");
}
		