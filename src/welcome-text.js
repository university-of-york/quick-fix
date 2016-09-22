$(function() {

  var $welcomeElement = $(".js-welcome-text");

  if ($welcomeElement.length > 0) {

    // 2016/17
    var termDates = [
      { "date":"2016/06/18", "week":false },
      { "date":"2016/09/26", "week":1 },
      { "date":"2016/10/03", "week":2 },
      { "date":"2016/10/10", "week":3 },
      { "date":"2016/10/17", "week":4 },
      { "date":"2016/10/24", "week":5 },
      { "date":"2016/10/31", "week":6 },
      { "date":"2016/11/07", "week":7 },
      { "date":"2016/11/14", "week":8 },
      { "date":"2016/11/21", "week":9 },
      { "date":"2016/11/28", "week":10 },
      { "date":"2016/12/03", "week":false },
      { "date":"2017/01/09", "week":1 },
      { "date":"2017/02/16", "week":2 },
      { "date":"2017/02/23", "week":3 },
      { "date":"2017/02/30", "week":4 },
      { "date":"2017/02/06", "week":5 },
      { "date":"2017/02/13", "week":6 },
      { "date":"2017/02/20", "week":7 },
      { "date":"2017/02/27", "week":8 },
      { "date":"2017/03/06", "week":9 },
      { "date":"2017/03/13", "week":10 },
      { "date":"2017/03/18", "week":false },
      { "date":"2017/04/18", "week":1 },
      { "date":"2017/04/24", "week":2 },
      { "date":"2017/05/01", "week":3 },
      { "date":"2017/05/08", "week":4 },
      { "date":"2017/05/15", "week":5 },
      { "date":"2017/05/22", "week":6 },
      { "date":"2017/05/29", "week":7 },
      { "date":"2017/06/05", "week":8 },
      { "date":"2017/06/12", "week":9 },
      { "date":"2017/06/19", "week":10 },
      { "date":"2017/06/24", "week":false }
    ];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // For live
    var now = new Date();
    // For testing
    // var now = new Date("2016/10/26 01:00:00");
    var nowHour = now.getHours();
    var nowDay = now.getDay();
    var nowDate = now.getDate();
    var nowMonth = now.getMonth();
    var nowTime = now.getTime();

    // Get time of day
    var timeOfDay;
    if (nowHour < 12) {
      timeOfDay = "morning";
    } else if (nowHour < 18) {
      timeOfDay = "afternoon";
    } else {
      timeOfDay = "evening";
    }

    // Get day and date
    var date = days[nowDay]+" "+nowDate+" "+months[nowMonth];

    // Get week number
    var weekNo = false;
    $.each(termDates, function(i, v) {
      var weekDate = new Date(v.date);
      var weekTime = weekDate.getTime();
      if (weekTime > nowTime) {
        weekNo = termDates[i-1].week;
        return false;
      }
    });

    var welcomeText = "Good "+timeOfDay+"!<br />Today is "+date;

    if (weekNo !== false) {
      welcomeText+= ", week "+weekNo;
    }

    $welcomeElement.html(welcomeText);

  }

});