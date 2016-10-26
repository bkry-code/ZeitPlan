command: "'zeitplan.widget/icalBuddy' -ea -sc -ic 'Zeitplan' eventsToday+1 2> /dev/null",

refreshFrequency: 10000,

style: "                              \n\
  bottom: 0px                         \n\
  left: 0px                           \n\
  top: 0px                            \n\
  font-family: -apple-system, Roboto, sans-serif \n\
  font-size: 14px                     \n\
  color: white                        \n\
  width: 200px                        \n\
  background: url(zeitplan.widget/gradient.png)       \n\
                                      \n\
  div.hours                           \n\
    position: relative                \n\
    z-index: 10                       \n\
                                      \n\
  span.hour                           \n\
    display: block                    \n\
    height:  20vh                     \n\
    text-align: center                \n\
    position: relative                \n\
    box-sizing: border-box            \n\
    width: 6px                        \n\
    left: 8px                         \n\
    border-bottom: 2px solid rgba(255,255,255,.25)     \n\
    &:last-child                      \n\
      border: none                    \n\
    .title                            \n\
      position: absolute              \n\
      left: 20px                      \n\
      top: 50%                        \n\
      color: rgba(255,255,255,.25)    \n\
      transform-origin: center        \n\
      height: 100%                    \n\
      transform: translateY(-15px) translateX(-50%) \n\
      .inner                          \n\
        transform: rotate(-90deg)    \n\
    &.now .title                      \n\
      color: white                    \n\
                                      \n\
  span.hour div.pointer               \n\
    background: white                 \n\
    position: absolute                \n\
    height: 3px                       \n\
    width: 3px                        \n\
    border-radius: 3px                \n\
    z-index: 10                       \n\
    top: 0                            \n\
    left: 2px                         \n\
                                      \n\
  div.event                           \n\
    position: absolute                \n\
    width: 20px                       \n\
    padding-left: 10px                \n\
    left: 0                           \n\
    .eTitle                           \n\
      transform-origin: top left      \n\
      display: block                  \n\
      white-space: nowrap             \n\
      position: absolute              \n\
      bottom: 10px                    \n\
      left: 19px                      \n\
      color: rgba(255,255,255,.25)     \n\
    &.now .eTitle                     \n\
      color: white                    \n\
    .eLine                            \n\
      width: 2px                      \n\
      height: 100%                    \n\
      position: absolute              \n\
      top: 0                          \n\
      background: rgba(255,255,255,.25) \n\
      left: 0px                       \n\
    &.now .eLine                       \n\
      background: white               \n\
    .eEnd                             \n\
      width: 100%                     \n\
      height: 2px                     \n\
      position: absolute              \n\
      bottom: 0                       \n\
      background: rgba(255,255,255,.25) \n\
      left: 20px                      \n\
      &:after                         \n\
        content: ''                   \n\
        position: absolute            \n\
        bottom: -10px                 \n\
        height: 10px                  \n\
        width: 2px                    \n\
        left: -20px                   \n\
        // background: linear-gradient(top, rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 100%) \n\
        z-index: 10                   \n\
    &.now .eEnd                       \n\
      background: white               \n\
      left: 0                         \n\
      padding-left: 20px              \n\
",

update: function (output, domEl) {

  var weekdays = "", midlines = "", dates = "";

  var d = new Date();
  var n = d.getHours();
  var m = d.getMinutes() / 60 * 100;

  if(d.getMinutes() < 10) {
      var tm =  '0' + d.getMinutes();
  } else {
      var tm = d.getMinutes();
  }

  var b = n-1;
  var a = n+3;

  var h = '<div class="hours">';

  for (var i = b; i <= a; i++) {

    if(i >= 24) {
      x = i-24;
    }
    else {
      x = i;
    }

    if (i <= -1) {
      x = 23;
    }

    if (x == n) {
      var c = "hour now";
      var p = '<div class="pointer" style="top: ' + m + '%"></div>';
      var title = '<div class="title"><div class="inner">' + n + ':' + tm + '</div></div>';
    }
    else {
      var c = "hour ";
      var p = "";
      var title = '<div class="title"><div class="inner">' + x + ':00</div></div>';
    }

    h += '<span class="' + c + '">'  + p + title + '</span>';

  };

  h += '</div>';

  var o = output.split('\n');

  var events = [];

  for (var i = 0, len = o.length; i < len; i++) {

    if (o[i].includes("•")) {

      var eTitle = o[i].replace("• ", "");

      if (o[i+1].includes("today")) {
        var eStart = o[i+1].replace("today at ", "");
        var eStart = eStart.split(' - ')[0].trim();
        var eTomorrow = false;
      }
      else {
        var eStart = o[i+1].replace("tomorrow at ", "");
        var eStart = eStart.split(' - ')[0].trim();
        var eTomorrow = true;
      }

      if (o[i+1].includes("tomorrow")) {
        var eEnd = o[i+1].replace("tomorrow at ", "");
        var eEnd = eEnd.split(' - ')[1].trim();
      }
      else {
        var eEnd = o[i+1].split(' - ')[1].trim();
      }

      var eStartHour = eStart.split(':')[0].trim();
      var eEndHour = eEnd.split(':')[0].trim();

      var eStartMinute = eStart.split(':')[1].trim();
      var eEndMinute = eEnd.split(':')[1].trim();

      var dStart = new Date(2012, 5, 31, eStartHour, eStartMinute, 0, 0);
      var dEnd = new Date(2012, 5, 31, eEndHour, eEndMinute, 0, 0);

      var nStart = new Date(2012, 5, 31, n, 00, 0, 0);
      var nEnd = new Date(2012, 5, 31, n + 1, 00, 0, 0);

      if (dStart >= nStart && dStart < nEnd) {
        var eNow = "now";
      }
      else if (dEnd < nEnd && dEnd > nStart) {
        var eNow = "now";
      }
      else if (dStart <= nStart && dEnd >= nEnd) {
        var eNow = "now";
      }
      else {
        var eNow = "";
      }

      var event = [
        eTitle,
        eStart,
        eEnd,
        eNow,
        eTomorrow
      ];

      events.push(event);

    }

  }

  var e = '<div class="events">';

  for (var i = 0, len = events.length; i < len; i++) {

    var eTitle = events[i][0];
    var eTomorrow = events[i][4];
    var eNow = events[i][3];

    if(eTomorrow == true) {
      var eStartHour = parseFloat(events[i][1].split(":")[0]) + 24;
      var eEndHour = parseFloat(events[i][2].split(":")[0]) + 24;
    }
    else {
      var eStartHour = parseFloat(events[i][1].split(":")[0]);
      var eEndHour = parseFloat(events[i][2].split(":")[0]);
    }

    var eStartMinute = parseFloat(events[i][1].split(":")[1]) / 60 * 100;
    var eEndMinute = parseFloat(events[i][2].split(":")[1]) / 60 * 100;

    var top = ( (eStartHour - b) * 20 ) + ( eStartMinute / 10 ) + "vh";

    if (eEndHour > eStartHour || eTomorrow == true) {
      var height = ( ( ( (eEndHour - b) * 20 ) + ( eEndMinute / 10 ) ) - ( ( (eStartHour - b) * 20 ) + ( eStartMinute / 10 ) ) ) + "vh";
    }
    else {
      eEndHour = eEndHour + 24;
      var height = ( ( ( (eEndHour - b) * 20 ) + ( eEndMinute / 10 ) ) - ( ( (eStartHour - b) * 20 ) + ( eStartMinute / 10 ) ) ) + "vh";
    }

    if (eEndHour >= b) {
      e += '<div class="event ' + eNow + '" style="top: ' + top + '; height: ' + height + '">' +
      '<span class="eTitle">' + eTitle + '</span>' +
      '<div class="eLine"></div>' +
      '<div class="eEnd"></div>' +
      '</div>';
    }


  }

  e += '</div>';

  $(domEl).html(h + e);

}
