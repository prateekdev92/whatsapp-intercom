export class CommController {
  constructor(commService, $scope) {
    'ngInject';

    var vm = this;
    var webSocketUrl = "wss://echo.websocket.org/";
    vm.showFullViewData = null;
    vm.websocket = null;

    vm.showFullView = showFullView;
    vm.chat_user_submitted = chat_user_submitted;
    vm.delayed_search = delayed_search;

    var pingBack = (evt) => {
      setTimeout(function(){
        chat_push_message("Reply: " + evt.data, vm.showFullViewData, vm.showFullViewData.id, function() {
        vm.showFullView(vm.showFullViewData);
      });
      },500)
    }

    var ConnectWebSocket = () => {
      vm.websocket = new WebSocket(webSocketUrl);
      vm.websocket.onopen = function(evt) {
        console.log("liftOff");
      };
      vm.websocket.onclose = function(evt) {
        "Return to base"
      };
      vm.websocket.onmessage = function(evt) {
        pingBack(evt)
      };
      vm.websocket.onerror = function(evt) {
        throw new Error("Out of Trajectory");
        vm.AppOnline = !vm.AppOnline;
      };
    }


    function showFullView(data) {
      vm.showFullViewData = data;
      vm.messages_list = JSON.parse(localStorage.getItem(data.id));
      var objDiv = document.getElementById("messageBox");
      objDiv.scrollTop = objDiv.scrollHeight;
      if (!$scope.$$phase) {
        $scope.$apply();
        objDiv.scrollTop = objDiv.scrollHeight;
      }
      vm.search = null;
      init();
    }


    var chat_push_message = (msg, data, by, cb) => {

      var id = data.id;
      if (localStorage.getItem(id)) {
        var msgs = localStorage.getItem(id);
        msgs = JSON.parse(msgs);
        msgs.push({ "message": msg, "time": Date.now(), "by": by });
        localStorage.setItem(id, JSON.stringify(msgs));
        vm.showFullView(vm.showFullViewData);
      } else {
        localStorage.setItem(id, JSON.stringify([{ "message": msg, "time": Date.now(), "by": "me" }]))
      }
      vm.reply_msg = null;

      cb();

    }

    function chat_user_submitted(msg, data, by) {
      chat_push_message(msg, data, by, function() {
        vm.websocket.send(msg);
      });
    }

    function debounce(fn, delay) {

      let setTimeOutRes = null;

      return function() {

        let context = this;
        let args = arguments;

        clearTimeout(setTimeOutRes);
        setTimeOutRes = setTimeout(function() {
          fn.apply(context, args);
        }, delay);

      }

    }

    var search_friends = (name) => {

      var arr = [];

      vm.friend_list.forEach(function(i) {
        let fname = (i.fname);
        fname = fname.toLowerCase();
        if (fname.indexOf(name) != -1) {
          arr.push(i);
        }
      });

      if (vm.friend_list.length != arr.length) {
        vm.friend_list = arr;
      }

    }

    function delayed_search(name, event) {

      if (name == '' || event.which === 8) {
        init();
      } else if (name.length > 1) {
        (debounce(search_friends, 300)(name));
      }

    }

    var init = () => {
      vm.AppOnline = navigator.onLine;
      vm.friend_list = commService.fetch_data();
    }

    init();
    ConnectWebSocket();

  }

}
