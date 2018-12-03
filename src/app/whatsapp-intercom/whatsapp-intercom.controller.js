export class CommController {
  constructor(commService) {
    'ngInject';

    var vm = this;

    vm.friend_list = commService.fetch_data();

    vm.showFullViewData = null;
    vm.showFullView = showFullView;
    vm.chat_push_message = chat_push_message;

    function showFullView(data) {
      vm.showFullViewData = data;
      vm.messages_list = JSON.parse(localStorage.getItem(data.id));
    }

    function chat_push_message(msg, data) {
      var id = data.id;
      if (localStorage.getItem(id)) {
        var msgs = localStorage.getItem(id);
        msgs = JSON.parse(msgs);
        msgs.push({ "message": msg, "time": Date.now(), "by": "me" });
        localStorage.setItem(id, JSON.stringify(msgs));
        showFullView(data);
      } else {
        localStorage.setItem(id, JSON.stringify([{ "message": msg, "time": Date.now(), "by": "me" }]))
      }
      vm.reply_msg = null;
    }

  }

}
