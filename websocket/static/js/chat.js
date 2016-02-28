// Copyright 2009 FriendFeed
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

$(document).ready(function() {
    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function() {};

    $("#messageform").bind("submit", function() {
        newMessage($(this));
        return false;
    });
    $("#messageform").bind("keypress", function(e) {
        if (e.keyCode == 13) {
            newMessage($(this));
            return false;
        }
    });
    updater.start();
    document.getElementById('inbox').scrollTop=document.getElementById('inbox').scrollHeight;
});

function newMessage(form) {
    var message = form.formToDict();
    message['channel'] = "pubroom";
    updater.socket.send(JSON.stringify(message));
    $("#message").val("");
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {}
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};

var updater = {
    socket: null,

    start: function() {
        var username = getUrlParam('name');
        if(!username){
            alert("username error!");
            return false;
        }
        var url = "ws://" + location.host + "/chatsocket?name="+username;
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data));
        }
        updater.socket.onclose = function(){
            $("#inbox").append('<div class="sys-msg-error"><div>[System message] Connection lose, please refresh this page.</div></div>');
        };
        updater.socket.onerror = function(){
            $("#inbox").append('<div class="sys-msg-error"><div>[System message] System error, please refresh this page.</div></div>');
        };
    },

    showMessage: function(message) {
        var existing = $("#m" + message.id);
        if (existing.length > 0) return;
        var node = $(message.html);
        // node.hide(); //取消渐变效果，因为刷新滚动条时无法确定消息框长度
        $("#inbox").append(node);
        // node.slideDown();
        document.getElementById ( 'inbox').scrollTop=document.getElementById ( 'inbox').scrollHeight;
    }
};
