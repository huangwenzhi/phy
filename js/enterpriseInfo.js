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

//ҳ���ʼ����������
window.onload = function() {
	messageManage({
			'id' : 'FirmMsg',
			'requestFields' : {},
			'responseFields' : {}
		}, afterGetDepartDetail, null);
}		
//�õ���Ϣ����Ⱦ������
function afterGetDepartDetail (responseData, messageObj, status) {
	if(status=="success"){
		if (responseData) {
			$('#qiName').val(responseData.enterpriseName);//��ҵ����
			$('#xinyong').val(responseData.enterpriseId);//ͳһ������ô���
			$('#kaihu').val(responseData.base_account_bank);//����֧��
			$('#zhuce').val(responseData.address);//��ҵע���ַ
			$('#Name').val(responseData.jurpername);//��������
			$('#faPhone').val(responseData.jurpertel);//�����ֻ���
			$('#lianName').val(responseData.linkman);//��ϵ������
			$('#lianPhone').val(responseData.linktel);//��ϵ���ֻ���
			var idtype = responseData.idtype
			$('#idtype').html(idtype=="1" ? "��ҵӪҵִ�գ�":idtype=="2" ? "��֯�������룺" : "ͳһ������ô��룺");
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
	if(status == "success"){//ϵͳ��̨��ͨ
	  if(responseData==null){
	  	top.window.Dialog.alert("��ǰ��ҵ���ܸ���Ϊ�����ҵ�ͻ�");
	  }else{
	  	$("#btn").addClass("btn");
	  	$('#qiName').val(responseData.enterpriseName);//��ҵ����
		$('#xinyong').val(responseData.enterpriseId);//ͳһ������ô���
		$('#kaihu').val(responseData.base_account_bank);//����֧��
		$('#zhuce').val(responseData.address);//��ҵע���ַ
		$('#Name').val(responseData.jurpername);//��������
		$('#faPhone').val(responseData.jurpertel);//�����ֻ���
		$('#lianName').val(responseData.linkman);//��ϵ������
		$('#lianPhone').val(responseData.linktel);//��ϵ���ֻ���
		$('#div').removeClass('div')
	  }
	}else{
		top.window.Dialog.alert("ͨѶʧ�ܣ�");
	}	
}	
//���ȷ�ϰ�ť����Ϊ�����ҵ�ͻ�
function Yes(){
	messageManage({
		'id' : 'firmMsgchange',
		'requestFields' : {},
		'responseFields' : {}
	}, afterchange, null);
}

function afterchange(responseData, messageObj, status){
	if(status == "success"){//ϵͳ��̨��ͨ
		var resp_status = responseData.resp_status;
		if(resp_status == "AAAAAAA") {
			top.window.Dialog.alert("�ɹ�����Ϊ�����ҵ�ͻ�");
			$('#div').addClass('div')
		} else {
			var resp_msg = responseData.resp_msg;
			top.window.Dialog.alert(resp_msg);
		}
	}else{
		top.window.Dialog.alert("ͨѶʧ�ܣ�");
	}	

}
