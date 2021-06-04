const moment = require("moment");

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },

  stripTags: function (input) {
    input = input.replace(/(<([^>]+)>)/gi, "");
    return input;
  },

  truncate: function (str, len) {
    if (str.length > len) {
      newStr = str.slice(0, len);
      newStr = str.slice(0, newStr.lastIndexOf(" "));
      return newStr + "...";
    }
    return str;
  },

  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() === loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return;
    }
  },

  select: function (selected, options) {
    return options.fn(this).replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"');
  },

  getUserId: function (user) {
    return user._id;
  },
};
