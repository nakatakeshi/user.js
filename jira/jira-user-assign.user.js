// ==UserScript==
// @name           add incremental search feature to jira assign form.
// @namespace      takeshi.nakata.jira.user.assign
// @match        http://$jira_url/*
// @match        http://$jira_url/*
// ==/UserScript==
 
(function() {
    if (location.href.match(new RegExp('/secure/CreateIssue\.jspa.pid', "i")) ) {
        createMode();
    } else if (location.href.match(new RegExp('/browse/.+', "i"))) {
        assignMode();
    } else {
        return;
    }
 
    function createMode () {
        var fieldGroup = document.querySelectorAll('.field-group');
        addInput(fieldGroup[5]);
    }
    function assignMode () {
        // DOMNodeInserted is deprecated
        // http://www.w3.org/TR/DOM-Level-3-Events/#event-type-DOMNodeInserted
        document.querySelector('#jira').addEventListener ("DOMNodeInserted", handler, false);
        function handler (e) {
            if (!e.target.className || e.target.className != 'aui-dialog-content') return;
            var fieldGroup = document.querySelectorAll('.field-group');
            addInput(fieldGroup[1]);
        }
    }
    function addInput (parent) {
        var assigneeSelector = document.querySelector('#assignee');
        if (!assigneeSelector) return;
        var assigneeListDefault = document.querySelectorAll('#assignee option');
 
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        var filter = function(text) {
            var assigneeList = document.querySelectorAll('#assignee option');
            var result = [];
            assigneeSelector.innerHTML = '';
            for (var i = 0; i < assigneeListDefault.length; i++) {
                var assignee = assigneeListDefault[i];
                var pattern = new RegExp(text, 'i');
                if (pattern.test(assignee.innerHTML)) {
                    assigneeSelector.appendChild(assignee.cloneNode(true));
                }
            }
            if (!assigneeSelector.firstChild) {
                assigneeSelector.innerHTML = '<option disabled="disabled">not found</option>';
            }
        };
        input.addEventListener('keyup', function() {
            var value = input.value;
            filter(value);
        });
        var ret = parent.insertBefore(input);
    }
})();
