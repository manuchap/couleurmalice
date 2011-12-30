(function(a){a.extend(a.fn,{validate:function(d){if(this.length){var c=a.data(this[0],"validator");if(c){return c}c=new a.validator(d,this[0]);a.data(this[0],"validator",c);if(c.settings.onsubmit){this.find("input, button").filter(".cancel").click(function(){c.cancelSubmit=true});c.settings.submitHandler&&this.find("input, button").filter(":submit").click(function(){c.submitButton=this});this.submit(function(f){function b(){if(c.settings.submitHandler){if(c.submitButton){var e=a("<input type='hidden'/>").attr("name",c.submitButton.name).val(c.submitButton.value).appendTo(c.currentForm)}c.settings.submitHandler.call(c,c.currentForm);c.submitButton&&e.remove();return false}return true}c.settings.debug&&f.preventDefault();if(c.cancelSubmit){c.cancelSubmit=false;return b()}if(c.form()){if(c.pendingRequest){c.formSubmitted=true;return false}return b()}else{c.focusInvalid();return false}})}return c}else{d&&d.debug&&window.console&&console.warn("nothing selected, can't validate, returning nothing")}},valid:function(){if(a(this[0]).is("form")){return this.validate().form()}else{var d=true,c=a(this[0].form).validate();this.each(function(){d&=c.element(this)});return d}},removeAttrs:function(e){var c={},f=this;a.each(e.split(/\s/),function(d,b){c[b]=f.attr(b);f.removeAttr(b)});return c},rules:function(i,c){var n=this[0];if(i){var m=a.data(n.form,"validator").settings,l=m.rules,k=a.validator.staticRules(n);switch(i){case"add":a.extend(k,a.validator.normalizeRule(c));l[n.name]=k;if(c.messages){m.messages[n.name]=a.extend(m.messages[n.name],c.messages)}break;case"remove":if(!c){delete l[n.name];return k}var j={};a.each(c.split(/\s/),function(b,d){j[d]=k[d];delete k[d]});return j}}n=a.validator.normalizeRules(a.extend({},a.validator.metadataRules(n),a.validator.classRules(n),a.validator.attributeRules(n),a.validator.staticRules(n)),n);if(n.required){m=n.required;delete n.required;n=a.extend({required:m},n)}return n}});a.extend(a.expr[":"],{blank:function(b){return !a.trim(""+b.value)},filled:function(b){return !!a.trim(""+b.value)},unchecked:function(b){return !b.checked}});a.validator=function(d,c){this.settings=a.extend(true,{},a.validator.defaults,d);this.currentForm=c;this.init()};a.validator.format=function(d,c){if(arguments.length==1){return function(){var b=a.makeArray(arguments);b.unshift(d);return a.validator.format.apply(this,b)}}if(arguments.length>2&&c.constructor!=Array){c=a.makeArray(arguments).slice(1)}if(c.constructor!=Array){c=[c]}a.each(c,function(f,b){d=d.replace(RegExp("\\{"+f+"\\}","g"),b)});return d};a.extend(a.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:true,errorContainer:a([]),errorLabelContainer:a([]),onsubmit:true,ignore:[],ignoreTitle:false,onfocusin:function(b){this.lastActive=b;if(this.settings.focusCleanup&&!this.blockFocusCleanup){this.settings.unhighlight&&this.settings.unhighlight.call(this,b,this.settings.errorClass,this.settings.validClass);this.addWrapper(this.errorsFor(b)).hide()}},onfocusout:function(b){if(!this.checkable(b)&&(b.name in this.submitted||!this.optional(b))){this.element(b)}},onkeyup:function(b){if(b.name in this.submitted||b==this.lastElement){this.element(b)}},onclick:function(b){if(b.name in this.submitted){this.element(b)}else{b.parentNode.name in this.submitted&&this.element(b.parentNode)}},highlight:function(e,c,f){e.type==="radio"?this.findByName(e.name).addClass(c).removeClass(f):a(e).addClass(c).removeClass(f)},unhighlight:function(e,c,f){e.type==="radio"?this.findByName(e.name).removeClass(c).addClass(f):a(e).removeClass(c).addClass(f)}},setDefaults:function(b){a.extend(a.validator.defaults,b)},messages:{required:"Ce champ est obligatoire.",remote:"Vérifiez ce champ.",email:"Adresse email invalide.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",accept:"Please enter a value with a valid extension.",maxlength:a.validator.format("Please enter no more than {0} characters."),minlength:a.validator.format("Please enter at least {0} characters."),rangelength:a.validator.format("Please enter a value between {0} and {1} characters long."),range:a.validator.format("Please enter a value between {0} and {1}."),max:a.validator.format("Please enter a value less than or equal to {0}."),min:a.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:false,prototype:{init:function(){function e(d){var b=a.data(this[0].form,"validator");d="on"+d.type.replace(/^validate/,"");b.settings[d]&&b.settings[d].call(b,this[0])}this.labelContainer=a(this.settings.errorLabelContainer);this.errorContext=this.labelContainer.length&&this.labelContainer||a(this.currentForm);this.containers=a(this.settings.errorContainer).add(this.settings.errorLabelContainer);
this.submitted={};this.valueCache={};this.pendingRequest=0;this.pending={};this.invalid={};this.reset();var c=this.groups={};a.each(this.settings.groups,function(d,b){a.each(b.split(/\s/),function(j,i){c[i]=d})});var f=this.settings.rules;a.each(f,function(d,b){f[d]=a.validator.normalizeRule(b)});a(this.currentForm).validateDelegate(":text, :password, :file, select, textarea","focusin focusout keyup",e).validateDelegate(":radio, :checkbox, select, option","click",e);this.settings.invalidHandler&&a(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){this.checkForm();a.extend(this.submitted,this.errorMap);this.invalid=a.extend({},this.errorMap);this.valid()||a(this.currentForm).triggerHandler("invalid-form",[this]);this.showErrors();return this.valid()},checkForm:function(){this.prepareForm();for(var d=0,c=this.currentElements=this.elements();c[d];d++){this.check(c[d])}return this.valid()},element:function(d){this.lastElement=d=this.clean(d);this.prepareElement(d);this.currentElements=a(d);var c=this.check(d);if(c){delete this.invalid[d.name]}else{this.invalid[d.name]=true}if(!this.numberOfInvalids()){this.toHide=this.toHide.add(this.containers)}this.showErrors();return c},showErrors:function(d){if(d){a.extend(this.errorMap,d);this.errorList=[];for(var c in d){this.errorList.push({message:d[c],element:this.findByName(c)[0]})}this.successList=a.grep(this.successList,function(b){return !(b.name in d)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){a.fn.resetForm&&a(this.currentForm).resetForm();this.submitted={};this.prepareForm();this.hideErrors();this.elements().removeClass(this.settings.errorClass)},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(e){var c=0,f;for(f in e){c++}return c},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()==0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid){try{a(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(b){}}},findLastActive:function(){var b=this.lastActive;return b&&a.grep(this.errorList,function(c){return c.element.name==b.name}).length==1&&b},elements:function(){var d=this,c={};return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){!this.name&&d.settings.debug&&window.console&&console.error("%o has no name assigned",this);if(this.name in c||!d.objectLength(a(this).rules())){return false}return c[this.name]=true})},clean:function(b){return a(b)[0]},errors:function(){return a(this.settings.errorElement+"."+this.settings.errorClass,this.errorContext)},reset:function(){this.successList=[];this.errorList=[];this.errorMap={};this.toShow=a([]);this.toHide=a([]);this.currentElements=a([])},prepareForm:function(){this.reset();this.toHide=this.errors().add(this.containers)},prepareElement:function(b){this.reset();this.toHide=this.errorsFor(b)},check:function(i){i=this.clean(i);if(this.checkable(i)){i=this.findByName(i.name).not(this.settings.ignore)[0]}var c=a(i).rules(),n=false,m;for(m in c){var l={method:m,parameters:c[m]};try{var k=a.validator.methods[m].call(this,i.value.replace(/\r/g,""),i,l.parameters);if(k=="dependency-mismatch"){n=true}else{n=false;if(k=="pending"){this.toHide=this.toHide.not(this.errorsFor(i));return}if(!k){this.formatAndAdd(i,l);return false}}}catch(j){this.settings.debug&&window.console&&console.log("exception occured when checking element "+i.id+", check the '"+l.method+"' method",j);throw j}}if(!n){this.objectLength(c)&&this.successList.push(i);return true}},customMetaMessage:function(e,c){if(a.metadata){var f=this.settings.meta?a(e).metadata()[this.settings.meta]:a(e).metadata();return f&&f.messages&&f.messages[c]}},customMessage:function(e,c){var f=this.settings.messages[e];return f&&(f.constructor==String?f:f[c])},findDefined:function(){for(var b=0;b<arguments.length;b++){if(arguments[b]!==undefined){return arguments[b]}}},defaultMessage:function(d,c){return this.findDefined(this.customMessage(d.name,c),this.customMetaMessage(d,c),!this.settings.ignoreTitle&&d.title||undefined,a.validator.messages[c],"<strong>Warning: No message defined for "+d.name+"</strong>")},formatAndAdd:function(f,c){var h=this.defaultMessage(f,c.method),g=/\$?\{(\d+)\}/g;if(typeof h=="function"){h=h.call(this,c.parameters,f)}else{if(g.test(h)){h=jQuery.format(h.replace(g,"{$1}"),c.parameters)}}this.errorList.push({message:h,element:f});this.errorMap[f.name]=h;this.submitted[f.name]=h},addWrapper:function(b){if(this.settings.wrapper){b=b.add(b.parent(this.settings.wrapper))}return b},defaultShowErrors:function(){for(var d=0;this.errorList[d];d++){var c=this.errorList[d];this.settings.highlight&&this.settings.highlight.call(this,c.element,this.settings.errorClass,this.settings.validClass);
this.showLabel(c.element,c.message)}if(this.errorList.length){this.toShow=this.toShow.add(this.containers)}if(this.settings.success){for(d=0;this.successList[d];d++){this.showLabel(this.successList[d])}}if(this.settings.unhighlight){d=0;for(c=this.validElements();c[d];d++){this.settings.unhighlight.call(this,c[d],this.settings.errorClass,this.settings.validClass)}}this.toHide=this.toHide.not(this.toShow);this.hideErrors();this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return a(this.errorList).map(function(){return this.element})},showLabel:function(e,c){var f=this.errorsFor(e);if(f.length){f.removeClass().addClass(this.settings.errorClass);f.attr("generated")&&f.html(c)}else{f=a("<"+this.settings.errorElement+"/>").attr({"for":this.idOrName(e),generated:true}).addClass(this.settings.errorClass).html(c||"");if(this.settings.wrapper){f=f.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()}this.labelContainer.append(f).length||(this.settings.errorPlacement?this.settings.errorPlacement(f,a(e)):f.insertAfter(e))}if(!c&&this.settings.success){f.text("");typeof this.settings.success=="string"?f.addClass(this.settings.success):this.settings.success(f)}this.toShow=this.toShow.add(f)},errorsFor:function(d){var c=this.idOrName(d);return this.errors().filter(function(){return a(this).attr("for")==c})},idOrName:function(b){return this.groups[b.name]||(this.checkable(b)?b.name:b.id||b.name)},checkable:function(b){return/radio|checkbox/i.test(b.type)},findByName:function(d){var c=this.currentForm;return a(document.getElementsByName(d)).map(function(f,b){return b.form==c&&b.name==d&&b||null})},getLength:function(d,c){switch(c.nodeName.toLowerCase()){case"select":return a("option:selected",c).length;case"input":if(this.checkable(c)){return this.findByName(c.name).filter(":checked").length}}return d.length},depend:function(d,c){return this.dependTypes[typeof d]?this.dependTypes[typeof d](d,c):true},dependTypes:{"boolean":function(b){return b},string:function(d,c){return !!a(d,c.form).length},"function":function(d,c){return d(c)}},optional:function(b){return !a.validator.methods.required.call(this,a.trim(b.value),b)&&"dependency-mismatch"},startRequest:function(b){if(!this.pending[b.name]){this.pendingRequest++;this.pending[b.name]=true}},stopRequest:function(d,c){this.pendingRequest--;if(this.pendingRequest<0){this.pendingRequest=0}delete this.pending[d.name];if(c&&this.pendingRequest==0&&this.formSubmitted&&this.form()){a(this.currentForm).submit();this.formSubmitted=false}else{if(!c&&this.pendingRequest==0&&this.formSubmitted){a(this.currentForm).triggerHandler("invalid-form",[this]);this.formSubmitted=false}}},previousValue:function(b){return a.data(b,"previousValue")||a.data(b,"previousValue",{old:null,valid:true,message:this.defaultMessage(b,"remote")})}},classRuleSettings:{required:{required:true},email:{email:true},url:{url:true},date:{date:true},dateISO:{dateISO:true},dateDE:{dateDE:true},number:{number:true},numberDE:{numberDE:true},digits:{digits:true},creditcard:{creditcard:true}},addClassRules:function(d,c){d.constructor==String?this.classRuleSettings[d]=c:a.extend(this.classRuleSettings,d)},classRules:function(d){var c={};(d=a(d).attr("class"))&&a.each(d.split(" "),function(){this in a.validator.classRuleSettings&&a.extend(c,a.validator.classRuleSettings[this])});return c},attributeRules:function(f){var c={};f=a(f);for(var h in a.validator.methods){var g=f.attr(h);if(g){c[h]=g}}c.maxlength&&/-1|2147483647|524288/.test(c.maxlength)&&delete c.maxlength;return c},metadataRules:function(d){if(!a.metadata){return{}}var c=a.data(d.form,"validator").settings.meta;return c?a(d).metadata()[c]:a(d).metadata()},staticRules:function(e){var c={},f=a.data(e.form,"validator");if(f.settings.rules){c=a.validator.normalizeRule(f.settings.rules[e.name])||{}}return c},normalizeRules:function(d,c){a.each(d,function(h,g){if(g===false){delete d[h]}else{if(g.param||g.depends){var b=true;switch(typeof g.depends){case"string":b=!!a(g.depends,c.form).length;break;case"function":b=g.depends.call(c,c)}if(b){d[h]=g.param!==undefined?g.param:true}else{delete d[h]}}}});a.each(d,function(f,b){d[f]=a.isFunction(b)?b(c):b});a.each(["minlength","maxlength","min","max"],function(){if(d[this]){d[this]=Number(d[this])}});a.each(["rangelength","range"],function(){if(d[this]){d[this]=[Number(d[this][0]),Number(d[this][1])]}});if(a.validator.autoCreateRanges){if(d.min&&d.max){d.range=[d.min,d.max];delete d.min;delete d.max}if(d.minlength&&d.maxlength){d.rangelength=[d.minlength,d.maxlength];delete d.minlength;delete d.maxlength}}d.messages&&delete d.messages;return d},normalizeRule:function(d){if(typeof d=="string"){var c={};a.each(d.split(/\s/),function(){c[this]=true});d=c}return d},addMethod:function(e,c,f){a.validator.methods[e]=c;a.validator.messages[e]=f!=undefined?f:a.validator.messages[e];c.length<3&&a.validator.addClassRules(e,a.validator.normalizeRule(e))
},methods:{required:function(e,c,f){if(!this.depend(f,c)){return"dependency-mismatch"}switch(c.nodeName.toLowerCase()){case"select":return(e=a(c).val())&&e.length>0;case"input":if(this.checkable(c)){return this.getLength(e,c)>0}default:return a.trim(e).length>0}},remote:function(h,c,l){if(this.optional(c)){return"dependency-mismatch"}var k=this.previousValue(c);this.settings.messages[c.name]||(this.settings.messages[c.name]={});k.originalMessage=this.settings.messages[c.name].remote;this.settings.messages[c.name].remote=k.message;l=typeof l=="string"&&{url:l}||l;if(this.pending[c.name]){return"pending"}if(k.old===h){return k.valid}k.old=h;var j=this;this.startRequest(c);var i={};i[c.name]=h;a.ajax(a.extend(true,{url:l,mode:"abort",port:"validate"+c.name,dataType:"json",data:i,success:function(e){j.settings.messages[c.name].remote=k.originalMessage;var b=e===true;if(b){var d=j.formSubmitted;j.prepareElement(c);j.formSubmitted=d;j.successList.push(c);j.showErrors()}else{d={};e=e||j.defaultMessage(c,"remote");d[c.name]=k.message=a.isFunction(e)?e(h):e;j.showErrors(d)}k.valid=b;j.stopRequest(c,b)}},l));return"pending"},minlength:function(e,c,f){return this.optional(c)||this.getLength(a.trim(e),c)>=f},maxlength:function(e,c,f){return this.optional(c)||this.getLength(a.trim(e),c)<=f},rangelength:function(e,c,f){e=this.getLength(a.trim(e),c);return this.optional(c)||e>=f[0]&&e<=f[1]},min:function(e,c,f){return this.optional(c)||e>=f},max:function(e,c,f){return this.optional(c)||e<=f},range:function(e,c,f){return this.optional(c)||e>=f[0]&&e<=f[1]},email:function(d,c){return this.optional(c)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(d)},url:function(d,c){return this.optional(c)||/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(d)},date:function(d,c){return this.optional(c)||!/Invalid|NaN/.test(new Date(d))},dateISO:function(d,c){return this.optional(c)||/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(d)},number:function(d,c){return this.optional(c)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(d)},digits:function(d,c){return this.optional(c)||/^\d+$/.test(d)},creditcard:function(h,c){if(this.optional(c)){return"dependency-mismatch"}if(/[^0-9-]+/.test(h)){return false}var l=0,k=0,j=false;h=h.replace(/\D/g,"");for(var i=h.length-1;i>=0;i--){k=h.charAt(i);k=parseInt(k,10);if(j){if((k*=2)>9){k-=9}}l+=k;j=!j}return l%10==0},accept:function(e,c,f){f=typeof f=="string"?f.replace(/,/g,"|"):"png|jpe?g|gif";return this.optional(c)||e.match(RegExp(".("+f+")$","i"))},equalTo:function(e,c,f){f=a(f).unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){a(c).valid()});return e==f.val()}}});a.format=a.validator.format})(jQuery);(function(f){var e={};if(f.ajaxPrefilter){f.ajaxPrefilter(function(c,b,a){b=c.port;if(c.mode=="abort"){e[b]&&e[b].abort();e[b]=a}})}else{var d=f.ajax;f.ajax=function(b){var a=("port" in b?b:f.ajaxSettings).port;if(("mode" in b?b:f.ajaxSettings).mode=="abort"){e[a]&&e[a].abort();return e[a]=d.apply(this,arguments)}return d.apply(this,arguments)
}}})(jQuery);(function(a){!jQuery.event.special.focusin&&!jQuery.event.special.focusout&&document.addEventListener&&a.each({focus:"focusin",blur:"focusout"},function(e,c){function f(b){b=a.event.fix(b);b.type=c;return a.event.handle.call(this,b)}a.event.special[c]={setup:function(){this.addEventListener(e,f,true)},teardown:function(){this.removeEventListener(e,f,true)},handler:function(b){arguments[0]=a.event.fix(b);arguments[0].type=c;return a.event.handle.apply(this,arguments)}}});a.extend(a.fn,{validateDelegate:function(e,c,f){return this.bind(c,function(d){var b=a(d.target);if(b.is(e)){return f.apply(b,arguments)}})}})})(jQuery);