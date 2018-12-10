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
//�����,global
$(window).bind("load",function(){
//��ʼ��������ʾ
	$("[data-toggle='tooltip']").popover();
});
//�����,global
//���,global
$(window).bind("load",function(){
 // grid��ʼ��
 $("table[data-init]").each(function(){
  var _$table = $(this);
  var sidePagination = _$table.attr("data-side-pagination");
  if(_$table.attr("data-init") != undefined && "server"!=sidePagination){
	  // ��ʼ��
	  var messageData = processMessageData(_$table.attr("data-init"));
	  // ���� MessageObject
	  var messageObj = new MessageObject(messageData);
	  // ��Ӳ���
	  messageObj.addRequestParam({});
	   //��ִ��before����
	  if(_$table.attr("event-beforeLoad") != undefined){
	     window[_$table.attr("event-beforeLoad")](_$table,messageObj);
	  }
	  // ��������ƴװ����
	  messageObj.ajax(function(responseData){
	   // ���ĸ�ʽ�ӹ�
	   var data = processGridData(responseData,messageObj);
	   _$table.bootstrapTable('load',data);
	   //���سɹ����¼�
		if(_$table.attr("event-loadsuccess") != undefined){
	     window[_$table.attr("event-loadsuccess")](_$table,data);
	  }
    });
   }
 });
});
//���,global

//���ukey��֤
//��Ҫ���̨���ݵı���
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
		top.window.Dialog.alert("ֻ��ѡ��һ������");
		return;
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("��ѡ��һ������");
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
//У������
function afterCeb(responseData, messageObj, status){
	//�õ�ϵͳ��̨����״ֵ̬
	if(status == "success"){//ϵͳ��̨��ͨ
		var cebUkeyMessage=responseData.cebUkeyMessage;
		if(cebUkeyMessage=="0"){
			//֤���û������Ukey��ѡ�����ͬ,Ukey��֤
			bindingInfo();
		}else{
			//֤���û������Ukey��ѡ��Ĳ���ͬ
			alert("�ǹ��ukey");
		}
	}else{
		alert("δ���̨��������");
	}
}
//=========================================================================================
//����CFCA�ӿ�ȥ��֤
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

//У������
//function afterUkey(responseData, messageObj, status){
//	//�õ�ϵͳ��̨����״ֵ̬
//	if(status == "success"){//ϵͳ��̨��ͨ
//		var checkUkeyMessage=responseData.checkUkeyMessage;
//		if(checkUkeyMessage=="0"){
//			//��֤�ɹ������һ�ν��пͻ�ע��У��
//			bindingInfo();
//		};
//		if(checkUkeyMessage=="1"){
//			alert("֤���ѹ���");
//		};
//		if(checkUkeyMessage=="2"){
//			alert("֤���ѵ���");
//		};
//		if(checkUkeyMessage=="6"){
//			alert("ǰ̨��ȡ���ݲ�ȫ");
//		};
//		if(checkUkeyMessage=="7"){
//			alert("ukey֤���Ӧͳһ������ô�������ҵ���ƺ��û�����Ĳ�����");
//		};
//		if(checkUkeyMessage=="8"){
//			alert("Ukey����ҵUkey");
//		};
//		if(checkUkeyMessage=="9"){
//			alert("Ukey��֤��ͨ��");
//		};
//	}else{
//		alert("δ���̨��������");
//	}
//}

//----------------------- �󶨰�ť��ʼ ----------------------->
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
		
      	// ���ý���Ч����������Ӧ����¼�
		$("#BDAN").attr({"disabled":"disabled"});
		// ������ʽ
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
		if(status == "success"){//ϵͳ��̨��ͨ
			var resp_status = responseData.resp_status;
			if(resp_status == "AAAAAAA") {
				top.window.Dialog.alert("�󶨳ɹ���");
				$("#tab").bootstrapTable('refresh');
				$("#BDAN").attr("disabled", false); //���ð�ť  
				$("#BDAN").removeClass("btn_disable");//��class�Ƴ�
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#BDAN").attr("disabled", false); //���ð�ť  
				$("#BDAN").removeClass("btn_disable");//��class�Ƴ�
			}
		}else{
			top.window.Dialog.alert("ͨѶʧ�ܣ�");
			$("#BDAN").attr("disabled", false); //���ð�ť  
			$("#BDAN").removeClass("btn_disable");//��class�Ƴ�
		}	
	}
//----------------------- �󶨰�ť���� ----------------------->

//----------------------- ���ť��ʼ ----------------------->
//var cebUserOrNot;
function Untie(){
	var ids = getIdSelections();
	if(ids && ids.length > 1) {
		top.window.Dialog.alert("ֻ��ѡ��һ������");
		return;
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("��ѡ��һ������");
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
		
      	// ���ý���Ч����������Ӧ����¼�
		$("#JBAN").attr({"disabled":"disabled"});
		// ������ʽ
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
//У������
//function afterCebUser(responseData, messageObj, status){
//	//�õ�ϵͳ��̨����״ֵ̬
//	if(status == "success"){//ϵͳ��̨��ͨ
//		var cebUkeyMessage=responseData.cebUkeyMessage;
//		if(cebUkeyMessage=="0"){
//			//֤���û������Ukey��ѡ�����ͬ,Ukey��֤
//			UntieInfo();
//		}else{
//			//֤���û������Ukey��ѡ��Ĳ���ͬ
//			alert("�ǹ��ukey");
//		}
//	}else{
//		alert("δ���̨��������");
//	}
//}
//=========================================================================================
//����CFCA�ӿ�ȥ��֤
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

//У������
//function afterUkeyVer(responseData, messageObj, status){
//	//�õ�ϵͳ��̨����״ֵ̬
//	if(status == "success"){//ϵͳ��̨��ͨ
//		var checkUkeyMessage=responseData.checkUkeyMessage;
//		if(checkUkeyMessage=="0"){
//			//��֤�ɹ������һ�ν��пͻ�ע��У��
//			UntieInfo();
//			
//		};
//		if(checkUkeyMessage=="1"){
//			alert("֤���ѹ���");
//		};
//		if(checkUkeyMessage=="2"){
//			alert("֤���ѵ���");
//		};
//		if(checkUkeyMessage=="6"){
//			alert("ǰ̨��ȡ���ݲ�ȫ");
//		};
//		if(checkUkeyMessage=="7"){
//			alert("ukey֤���Ӧͳһ������ô�������ҵ���ƺ��û�����Ĳ�����");
//		};
//		if(checkUkeyMessage=="8"){
//			alert("Ukey����ҵUkey");
//		};
//		if(checkUkeyMessage=="9"){
//			alert("Ukey��֤��ͨ��");
//		};
//	}else{
//		alert("δ���̨��������");
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
//      	// ���ý���Ч����������Ӧ����¼�
//		$("#JBAN").attr({"disabled":"disabled"});
//		// ������ʽ
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
		if(status == "success"){//ϵͳ��̨��ͨ
			var resp_status = responseData.resp_status;
			if(resp_status == "AAAAAAA") {
				top.window.Dialog.alert("���ɹ���");
				$("#tab").bootstrapTable('refresh');
				$("#JBAN").attr("disabled", false); //���ð�ť  
				$("#JBAN").removeClass("btn_disable");//��class�Ƴ�
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#JBAN").attr("disabled", false); //���ð�ť  
				$("#JBAN").removeClass("btn_disable");//��class�Ƴ�
			}
		}else{
			top.window.Dialog.alert("ͨѶʧ�ܣ�");
			$("#JBAN").attr("disabled", false); //���ð�ť  
			$("#JBAN").removeClass("btn_disable");//��class�Ƴ�
		}	
	}
//----------------------- ���ť���� ----------------------->	


//----------------------- �����״ε�¼���뿪ʼ ----------------------->
//�����״ε�¼����
function SendPwd(){
	var ids = getIdSelections();
	if(ids && ids.length > 1) {
		top.window.Dialog.alert("ֻ��ѡ��һ������");
	} else if(ids && ids.length < 1) {
		top.window.Dialog.alert("��ѡ��һ������");
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
		// ���ý���Ч����������Ӧ����¼�
		$("#sedpwd").attr({"disabled":"disabled"});
		// ������ʽ
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
				top.window.Dialog.alert("���ͳɹ��������");
				$("#tab").bootstrapTable('refresh');
				$("#sedpwd").attr("disabled", false); //���ð�ť  
				$("#sedpwd").removeClass("btn_disable");//��class�Ƴ�
			} else {
				var resp_msg = responseData.resp_msg;
				top.window.Dialog.alert(resp_msg);
				$("#tab").bootstrapTable('refresh');
				$("#sedpwd").attr("disabled", false); //���ð�ť  
				$("#sedpwd").removeClass("btn_disable");//��class�Ƴ�
			}
		}else{
			top.window.Dialog.alert("ͨѶʧ�ܣ�");
			$("#sedpwd").attr("disabled", false); //���ð�ť  
			$("#sedpwd").removeClass("btn_disable");//��class�Ƴ�
		}
	}
//----------------------- �����״ε�¼������� ----------------------->

//-------------------------ɾ����ʼ------------------------->
		//ɾ��  
		var delId = null;
		var username;
		function delTable() {
			delId = getIdSelections();
//			var datarow = getRowSelections();
			if(delId && delId.length > 1) {
				top.window.Dialog.alert("ֻ��ѡ��һ������");
			} else if(delId && delId.length < 1) {
				top.window.Dialog.alert("��ѡ��һ������");
			} else {
				top.window.Dialog.confirm("ȷ��ɾ����", null, null, null, function() {
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
				//ɾ���ɹ�ִ��
				if(resp_status == "AAAAAAA") { //���û��δ�����Ľ��׾�ɾ����֮����ɾ��
					top.window.Dialog.alert("ɾ���ɹ���");
					$("#tab").bootstrapTable('refresh');
				} else {
					//ɾ��ʧ��ִ��
					var resp_msg = responseData.resp_msg;
					top.window.Dialog.alert(resp_msg);
				}

			}else{
				top.window.Dialog.alert("ͨѶʧ�ܣ�");
			}
		}
//------------------------- ɾ������ ------------------------->

//------------------------- ��ӿ�ʼ ------------------------->
		//���ҳ���֤�����ʧȥ�����¼�У��
		function IDnumberBlur() {
			var IDInput = $("#idcardno");
			//    ��ȡ���������
			var IDnumber = $("#idcardno").val();
			//  ��֤���֤��ʽ
			����
			function isID(IDInput) {����
				var myreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;����
				if(IDnumber == "") {
					$("#addIdText").html("���֤�Ų���Ϊ��");
				} else if(!myreg.test(IDnumber)) {����
					$("#addIdText").html("��������ȷ�����֤��ʽ");����
					return false;����
				}����
			}����
			isID();
		}

		//���ҳ�ֻ��������ʧȥ�����¼�У��
		function phone() {
			var phoneInput = $("#username");
			//    ��ȡ���������
			var phonenumber = $("#username").val();
			//    ��֤�ֻ������ʽ����֤���ʽ
			����
			function isPone(phoneInput) {����
				var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;����
				if(phonenumber == "") {
					$("#addPhoneText").html("�ֻ��Ų���Ϊ��");
				} else if(!myreg.test(phonenumber)) {����
					$("#addPhoneText").html("��������ȷ���ֻ��Ÿ�ʽ");����
					return false;����
				}����
			}����
			isPone();
		}
		//���������ʧȥ����У��
		function addName(){
			var NameInput = $("#name");
			//    ��ȡ���������
			var Namenumber = $("#name").val();
			//    ��֤�ֻ������ʽ����֤���ʽ
			����
			function isPone(NameInput) {
				var myreg = /^[\u4e00-\u9fa5\A-Za-z\��]+$/;
				//�������ĺ���ת���������ַ�
				var len = Namenumber.replace(/[\u4E00-\u9FA5]/g,'aa').length;
				if(Namenumber == "") {
					$("#addName").html("�û���������Ϊ��");
				} else if(!myreg.test(Namenumber)) {����
					$("#addName").html("�û����������ʽ����ȷ");����
					return false;����
				}else if(len>50){
					$("#addName").html("�û���������ĳ��Ȳ��ܳ���50���ַ�");
				}
			}����
			isPone();
		}
		//�ֻ�������ý��㣬��ʾ��Ϣ����
		function phoneFocus() {
			$("#addPhoneText").html("");
			$("#tishi").html("");
		}
		//�û�����������ý��㣬��ʾ��Ϣ����
		function addUserName() {
			$("#addName").html("");
			$("#tishi").html("");
		}
		//���֤������ý��㣬��ʾ��Ϣ����
		function IdFocus() {
			$("#addIdText").html("");
			$("#tishi").html("");
		}
		//��Ӱ�ť�¼������ ģ̬����ʾ
		function add() {
			$("#addApiIframe").modal("show")
		}
		//�������  ��У�������Ȼ����
		var Name;
		var IDnumber;
		var phonenumber;
		function submitForm() {
			Name = $("#name").val();
			IDnumber = $("#idcardno").val();
			phonenumber = $("#username").val();
			jmPhoneNum=$.md5(phonenumber);//md5�ֻ��ż���
			var myreg = /^[\u4e00-\u9fa5\A-Za-z\��]+$/;
			var len = Name.replace(/[\u4E00-\u9FA5]/g,'aa').length;
			var myphone = /^[1][3,4,5,7,8][0-9]{9}$/;
			var myID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if(Name == ""||IDnumber==""||phonenumber=="") {
				top.window.Dialog.alert("�������Ӧ��������Ϣ");
				//$("#tishi").html("�������Ӧ��������Ϣ")
			}else if(!myreg.test(Name)){
				top.window.Dialog.alert("�û�������ʽ����ȷ");
				//$("#tishi").html("�û�������ʽ����ȷ")
			}else if(len>50){
				top.window.Dialog.alert("�û���������ĳ��Ȳ��ܳ���50���ַ�");
				//$("#tishi").html("�û���������ĳ��Ȳ��ܳ���50���ַ�")
			}else if(!myID.test(IDnumber)){
				top.window.Dialog.alert("���֤�Ÿ�ʽ����ȷ");
				//$("#tishi").html("���֤�Ÿ�ʽ����ȷ")
			}else if(!myphone.test(phonenumber)){
				top.window.Dialog.alert("�ֻ������ʽ����ȷ");
				//$("#tishi").html("�ֻ������ʽ����ȷ")
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
				// ���ý���Ч����������Ӧ����¼�
				$("#addTab").attr({"disabled":"disabled"});
				// ������ʽ
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
					//��ӳɹ�ִ��
					if(resp_status == "AAAAAAA") {
						top.window.Dialog.alert("��ӳɹ���");
						$("#messageAlertObj").modal("hide");
						$("#addApiIframe").modal("hide");
						$(".addInput").val("")
						$("#tab").bootstrapTable('refresh');
						$("#addTab").attr("disabled", false); //���ð�ť  
						$("#addTab").removeClass("btn_disable");//��class�Ƴ�
					} else {
						var resp_msg = responseData.resp_msg;
						top.window.Dialog.alert(resp_msg);
						$("#tab").bootstrapTable('refresh');
						$("#addTab").attr("disabled", false); //���ð�ť
						$("#addTab").removeClass("btn_disable");//��class�Ƴ�  
					}
				}else{
					top.window.Dialog.alert("ͨѶʧ�ܣ�");
					$("#addTab").attr("disabled", false); //���ð�ť  
					$("#addTab").removeClass("btn_disable");//��class�Ƴ�
				}
			}
			
		//ȡ����ť�¼��������������������ʾ��Ϣ
		function closeBox() {
			$("#addApiIframe").modal("hide");
			$("#boxFormApi")[0].reset();
			$(".warn").html("");
			$(".addInput").val("")

		}
//------------------------- ��ӽ��� ------------------------->
		
//------------------------- �޸Ŀ�ʼ ------------------------->
		
		//�޸İ�ť�¼�����ʾ�û�ֻ��ѡ��һ����Ϣ
		var username1;
		
		function updateTab() {
			var ids = getIdSelections();
			if(ids && ids.length > 1) {
				top.window.Dialog.alert("ֻ��ѡ��һ������");
			} else if(ids && ids.length < 1) {
				top.window.Dialog.alert("��ѡ��һ������");
			} else {
				$("#updataApiIframe").modal("show");
				var datarow = getRowSelections();
				$("#name").val(datarow[0].name);
				$("#idcardno").val(datarow[0].idcardno);
				$("#Username").val(datarow[0].username);
				$("#UKSTATUS").val(datarow[0].UKSTATUS);
				$("#passwordstatus").val(datarow[0].passwordstatus);
				username1 = datarow[0].username;
				jmPhoneNum=$.md5(username1);//md5�����ֻ���
			}
		}
		//�޸�ҳ��У��
		//�޸�ҳ���֤�����ʧȥ�����¼�У��
		function updataID() {
			var IDInput = $("#updataIDnumber");
			//    ��ȡ���������
			var IDnumber = $("#updataIDnumber").val();
			//  ��֤���֤��ʽ
			����
			function isID(IDInput) {����
				var myreg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;����
				if(IDnumber == "") {
					$("#IDtext").html("���֤�Ų���Ϊ��");
				} else if(!myreg.test(IDnumber)) {
					$("#IDtext").html("��������ȷ�����֤��ʽ");����
					return false;����
				}����
			}����
			isID();
		}
		//�޸�ҳ���û����������ʧȥ����У��
		function updataNameBulr(){
			var NameInput = $("#updataName");
			//    ��ȡ���������
			var Namenumber = $("#updataName").val();
			//  ��֤�û�����ʽ
			function isID(NameInput) {
				var myreg = /^[\u4e00-\u9fa5\A-Za-z\��]+$/;
				var len = Namenumber.replace(/[\u4E00-\u9FA5]/g,'aa').length;
				if(Namenumber == "") {
					$("#updatauserName").html("�û���������Ϊ��");
				} else if(!myreg.test(Namenumber)) {����
					$("#updatauserName").html("�û����������ʽ����ȷ");����
					return false;����
				}else if(len>50){
					$("#updatauserName").html("�û���������ĳ��Ȳ��ܳ���50���ַ�");
				}
			}����
			isID();
		}
		//�޸�ҳ�ֻ��������ʧȥ�����¼�
		//function updataphone(){
		//var phoneInput = $("#updataPhone");
		//    ��ȡ���������
		//var phonenumber = $("#updataPhone").val();
		//    ��֤�ֻ������ʽ����֤���ʽ
		���� //function isPone(phoneInput){
		���� //var myreg=/^[1][3,4,5,7,8][0-9]{9}$/; 
		���� //if(phonenumber==""){
		//$("#phoneText").html("�ֻ����벻��Ϊ��");
		//}else if (!myreg.test(phonenumber)) {
		//$("#phoneText").html("��������ȷ���ֻ��Ÿ�ʽ");
		���� //return false; 
		���� //}
		���� //}
		���� //isPone();
		//}

		//�޸�ҳȷ����ť�¼�������֤������ڵ�ֵ�Ƿ�ϸ�
		var updataName;
		var updataIdNumber;
		var updataPhone
		function updataYes() {
			updataName = $("#updataName").val()
			updataIdNumber = $("#updataIDnumber").val();
			updataPhone = $("#updataPhone").val();
			
			var myreg = /^[\u4e00-\u9fa5\A-Za-z\��]+$/;
			var len = updataName.replace(/[\u4E00-\u9FA5]/g,'aa').length;
			var myphone = /^[1][3,4,5,7,8][0-9]{9}$/;
			var myID = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if(updataName == "" || updataIdNumber == "") {
				//$("#updataTishi").html("�������Ӧ����Ϣ")
				top.window.Dialog.alert("�������Ӧ����Ϣ");
			}else if(!myID.test(updataIdNumber)){
				//$("#IDtext").html("���֤�Ÿ�ʽ����ȷ")
				top.window.Dialog.alert("���֤�Ÿ�ʽ����ȷ");
			}else if(!myreg.test(updataName)){
				//$("#IDtext").html("�û�������ʽ����ȷ")
				top.window.Dialog.alert("�û�������ʽ����ȷ");
			}else if(len>50){
				//$("#IDtext").html("�û���������ĳ��Ȳ��ܳ���50���ַ�")
				top.window.Dialog.alert("�û���������ĳ��Ȳ��ܳ���50���ַ�");
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
				// ���ý���Ч����������Ӧ����¼�
				$("#updataTab").attr({"disabled":"disabled"});
				// ������ʽ
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
							top.window.Dialog.alert("�޸ĳɹ���");
							$("#updataApiIframe").modal("hide");
							$(".updataInput").val("")
							$("#tab").bootstrapTable('refresh');
							$("#updataTab").attr("disabled", false); //���ð�ť
							$("#updataTab").removeClass("btn_disable");//��class�Ƴ�  
						} else {
							var resp_msg = responseData.resp_msg;
							top.window.Dialog.alert(resp_msg);
							$("#tab").bootstrapTable('refresh');
							$("#updataTab").attr("disabled", false); //���ð�ť  
							$("#updataTab").removeClass("btn_disable");//��class�Ƴ�  
						}
					}else{
						top.window.Dialog.alert("ͨѶʧ�ܣ�");
						$("#updataTab").attr("disabled", false); //���ð�ť  
						$("#updataTab").removeClass("btn_disable");//��class�Ƴ�  
					}
				}
			
			//�޸ĳɹ�ִ�е��߼�
			
		//�û���������ý�����ʾ��Ϣ����
		function updataNameFocus() {
			$("#updatauserName").html("");
			$("#updataTishi").html("")
		}
		//�ֻ���������ý�����ʾ��Ϣ��ʧ
		function updataFocus() {
			$("#phoneText").html("");
			$("#updataTishi").html("")
		}
		//���֤��������ý�����ʾ��Ϣ��ʧ
		function updataIDFocus() {
			$("#IDtext").html("");
			$("#updataTishi").html("")
		}
		//�޸�ҳȡ����ť�¼���ģ̬�����أ���ʾ��Ϣ��������ֵ���
		function updataNo() {
			$("#updataApiIframe").modal("hide")
			$(".warn").html("");
			$(".updataInput").val("");
			$("#boxForm")[0].reset();
		}

//------------------------- �޸Ľ��� ------------------------->

	//�ر�ģ̬��ʱ�����������ʾ��Ϣ
	$(".guan").on('click',function(){
			$(".addInput").val("");
			$(".updataInput").val("");
			$(".warn").html("");
	})
//ģ̬�����ش���
function hideModal(){
	$("#boxFormApi")[0].reset();
	$("#boxForm")[0].reset();
}

		//��ȡѡ��id
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
		//��ȡ����
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
//��̬������
//$(function(){
    //var len = $('#tab tr').length;
    //for(var i = 1;i<len;i++){
        //$('#tab tr:eq('+i+') td:nth-child(2)').text(i);
    //}   
//});
//uk��״̬
function ukeyTrans(value,row,index){
	return [ '<div>', (value == "1" ? "��" : "��"), '</div>' ].join('');
}
//����״̬
function statusTrans(value,row,index){
	return [ '<div>', (value == "0" ? "δ����" : value == "1" ? "�ѷ��Ͷ��ţ���δ�޸��״�����" : "�ѷ���"), '</div>' ].join('');
}

//ҳ���ʼ�������֤������
//function idstatus(value,row,index){
	//return ['<div>',(value.substr(0,3) + '******' + value.substr(value.length - 4)),'</div>'].join('');
//}
//ҳ���ʼ�����ֻ�������
//function Phonestatus(value,row,index){
	//return ['<div>',(value.substr(0,3) + '******' + value.substr(value.length - 4)),'</div>'].join('');
//}

