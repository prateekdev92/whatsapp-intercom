export class CommController {
  constructor(commService, $scope) {
    'ngInject';

    var vm = this;
    vm.showFullViewData = null;
    vm.showFullView = showFullView;
    vm.chat_push_message = chat_push_message;
    vm.chat_user_submitted = chat_user_submitted
    var webSocketUrl = "wss://echo.websocket.org/";
    vm.websocket = null;

    function ConnectWebSocket() {
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
        throw new Error("Out of Trajectory")
      };
    }

    function pingBack(evt) {
      chat_push_message("Reply: " + evt.data, vm.showFullViewData, vm.showFullViewData.id, function() {
        vm.showFullView(vm.showFullViewData);
      });
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
    }

    function chat_user_submitted(msg, data, by) {
      chat_push_message(msg, data, by, function() {
        vm.websocket.send(msg);
      });
    }

    function chat_push_message(msg, data, by, cb) {

      var id = data.id;
      if (localStorage.getItem(id)) {
        var msgs = localStorage.getItem(id);
        msgs = JSON.parse(msgs);
        msgs.push({ "message": msg, "time": Date.now(), "by": by });
        localStorage.setItem(id, JSON.stringify(msgs));
      } else {
        localStorage.setItem(id, JSON.stringify([{ "message": msg, "time": Date.now(), "by": "me" }]))
      }
      vm.reply_msg = null;

      cb();

    }

    vm.friend_list = commService.fetch_data();
    ConnectWebSocket();

  }

}
