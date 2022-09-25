const week_sunstart = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const week_monstart = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var selected_day;

// loads the page for the monthly calendar
// day is the day that is currently selected, and wk_start_day
// is the day of the week the week starts on.
function calendarPage(month, year, day, wk_start_day) {
    selected_day = day;

    // fullDate is the date object that corresponds to the selected Day
    var fullDate = (
        new Date(year, month - 1, selected_day)
    )
    
    // lastDayInMonth is the day number the month ends on (28, 29, 30, or 31)
    var lastDayInMonth = (
        new Date(year, month, 0).getDate()
    )

    // firstDayInMonthIndex is the weekday the month starts on
    var firstDayInMonthIndex 

    if (wk_start_day == 0) {
        weekList = week_monstart
        firstDayInMonthIndex = (
            (new Date(year, month - 1).getDay() + 6) % 7
        )
    }
    else {
        weekList = week_sunstart 
        firstDayInMonthIndex = (
            new Date(year, month - 1).getDay() % 7
        )
    }


    // nextmonth and nextyear are the month and year that correspond to the following month on the calendar.
    // prevmonth and prevyear are the month and year that correspond to the previous month on the calendar.
    var nextmonth;
    var prevmonth;
    var nextyear;
    var prevyear;

    if (month == 12) {
    nextmonth = 1;
    prevmonth = 11;
    nextyear = year + 1;
    prevyear = year;
    }

    else if (month == 1) {
    nextmonth = 2;
    prevmonth = 12;
    nextyear = year;
    prevyear = year - 1;
    }
    
    else {
    nextmonth = parseInt(month) + 1;
    prevmonth = parseInt(month) - 1;
    nextyear = year;
    prevyear = year;
    }

    // empties the main container before building the html inside it.
    $('#main_container').html("");

    // adds the top menu to the calendar
    // the menu items are the button to go to the previous month,
    // the label for the current month,
    // the button to go to the next month,
    // the button to toggle the preferences menu,
    // and the button to toggle the addEvent menu.
    $('#main_container').append(`<div class = menu>
        <div class=menuitem onclick ='calendarPage(${prevmonth}, ${prevyear}, ${selected_day}, ${wk_start_day})' ><a>previous</a></div>
        <div class=menuitem><h1>${fullDate.toLocaleString('default', {month: 'long'})}, ${year}</h1></div>
        <div class=menuitem onclick ='calendarPage(${nextmonth}, ${nextyear}, ${selected_day}, ${wk_start_day})' ><a>next</a></div>
        <div id = "add-toggle" class=menuitem style = "float: right; margin-top: 30px;"><a>Add New Event</a></div>
        <div id = "pref-toggle" class = menuitem style = "float: right; margin-top: 30px;"><a>Preferences</a></div>
    </div>`)

    // appends the preference options that can be toggled with the preference options button.
    // the preference options allows the user to decide what day of the week they want their week to start on.
    $('#main_container').append(`<div id = "preference_options" class = "preference_options">
            <form method='POST' style = "display: block;"> 
                <b style = "display: block;"><p>First Day of the Week:</p></b>
                <input type="hidden" name="day" value=${selected_day}>
                <input type="hidden" name="month" value=${month}>
                <input type="hidden" name="year" value=${year}>
                <div>
                    <input type="radio" id="sun_start_radio" name="wk_start_day" value=1>
                    <label for="sun_start_radio">Sunday</label> <br>
              
                    <input type="radio" id="mon_start_radio" name="wk_start_day" value=0>
                    <label for="mon_start_radio">Monday</label>
                </div>
                <input class= "submit_wk_start" type="submit" value="Apply">
            </form>
        </div>`)

    // configures the preference options button to toggle the preference options menu
    $('#pref-toggle').click(
        () => {
        $(".preference_options").toggle(); 
        }
    )

    // adds a div for the add event menu
    $('#main_container').append(`<div id='add_event'></div>`);

    $('#add_event').append(`<div class = "add_event_options" style = "display: none;">
    <form method = "POST" style = "display: block;"> 
        <div style = "display: block;">
            <input type="text" name="new_event_name" placeholder="Event Name" class="name_input">
        </div>

        <b style = "display: block;"><p>Please select how the date of your event will be calculated:</p></b>
        <div>
            <input type="radio" id="static_radio" name="event_type" value="static_day">
            <label for="static_radio">By Month and Day (E.g. January 1st)</label> <br>
        
            <input type="radio" id="varied_radio" name="event_type" value="varied_day">
            <label for="varied_radio">By Weekday and Month (E.g. 3rd Thursday of November)</label>
        </div>

        <div class = "static_choices">
            <select name="new_event_month"> 
                <option value = 1>January</option>
                <option value = 2>February</option>
                <option value = 3>March</option>
                <option value = 4>April</option>
                <option value = 5>May</option>
                <option value = 6>June</option>
                <option value = 7>July</option>
                <option value = 8>August</option>
                <option value = 9>September</option>
                <option value = 10>October</option>
                <option value = 11>November</option>
                <option value = 12>December</option>
            </select>
            <input type="text" name="new_event_day" placeholder="day">
        </div>

    <div class = "varied_day_choices">
        <select name="new_event_weekdayofmonth"> 
            <option value = 1>First</option>
            <option value = 2>Second</option>
            <option value = 3>Third</option>
            <option value = 4>Fourth</option>
            <option value = 5>Fifth</option>
        </select>

        <select name="new_event_weekday"> 
            <option value = 0>Monday</option>
            <option value = 1>Tuesday</option>
            <option value = 2>Wednesday</option>
            <option value = 3>Thursday</option>
            <option value = 4>Friday</option>
            <option value = 5>Saturday</option>
            <option value = 6>Sunday</option>
        </select>
        <p style = "display: inline-flex; margin-inline-end: 5px; margin-inline-start: 5px;">of</p>
        <select name="new_event_month_varied"> 
            <option value = 1>January</option>
            <option value = 2>February</option>
            <option value = 3>March</option>
            <option value = 4>April</option>
            <option value = 5>May</option>
            <option value = 6>June</option>
            <option value = 7>July</option>
            <option value = 8>August</option>
            <option value = 9>September</option>
            <option value = 10>October</option>
            <option value = 11>November</option>
            <option value = 12>December</option>
        </select>

    </div>
    <input class= "submit_event" type="submit" value="Add Event">
    </form>
    </div>`);


    // configures theadd event button to toggle the add event menu
    $('#add-toggle').click(
        () => {
        $(".add_event_options").toggle(); 
        }
    )

    // adds the div for the day info
    $('#main_container').append(`<div id='day_info'></div>`);

    // Puts the events linked to the selected day into the day_info div
    reloadDayInfo(month, year, day);

    // adds the option to jump to a specific date to the calendar
    $('#main_container').append(`<form method='POST'> 
        <select name="month"> 
            <option value = 1>January</option>
            <option value = 2>February</option>
            <option value = 3>March</option>
            <option value = 4>April</option>
            <option value = 5>May</option>
            <option value = 6>June</option>
            <option value = 7>July</option>
            <option value = 8>August</option>
            <option value = 9>September</option>
            <option value = 10>October</option>
            <option value = 11>November</option>
            <option value = 12>December</option>
        </select>
        <input type="text" name="day" placeholder="day">
        <input type="text" name="year" placeholder="year">
        <input type="hidden" name="wk_start_day" value=${wk_start_day}>
        <input class= "submit-button" type="submit" value="Go To Date">
    </form>`)

    // adds the weekday labels above the calendar
    weekList.forEach((weekday_name) => {
        $('#main_container').append(`<div class="weekday">
            <div class="weekdaytxt">${weekday_name}</div>
            </div>`);
    });

    // adds a day cell to the calendar for each day in the month there is.
    for (let i = 0; i < firstDayInMonthIndex; i += 1){
        $('#main_container').append(`<a class="day"></a>`);
    }


    var moon_images; // the list of the images that correspond to the moon phase for each day of the month
    var moon_img; // the image that corresponds to the moon phase for the current day

    // adds the moon image to each day cell.
    // links every day cell to an onclick function so that is a day is clicked,
    // that day becomes the new selected day.
    // Also makes the current selected day highlighted in a yellow border.
    $.ajax({

        url: `/api/moon_imgs_month/${month}/${year}/${lastDayInMonth}`

        }).done(function(data) {
            moon_images = data;
            for (let i = 1; i < lastDayInMonth + 1; i += 1) {
 
                moon_img = moon_images[i];
                if(i == selected_day){
                    $('#main_container').append(`<div id = "${i}_div" class="selectedday" onclick ='changeDay(${month}, ${year}, ${i})'> 
                                                    <img src= "${moon_img}"> 
                                                    <span id = "${i}">${i}</span>
                                                </div>`);
               } else {
               $('#main_container').append(`<div id = "${i}_div" class="day" onclick ='changeDay(${month}, ${year}, ${i})'> 
                                                <img src= "${moon_img}"> 
                                                <span id = "${i}" >${i}</span>
                                            </div>`);
               }
    
        }
    })


    $('input[type=radio][name="event_type"][value="static_day"]').change(function() {
        $(".varied_day_choices").hide(); 
        $(".static_choices").show(); 
        $(".submit_event").show(); 
    }); 
    $('input[type=radio][name="event_type"][value="varied_day"]').change(function() {
        $(".varied_day_choices").show(); 
        $(".static_choices").hide(); 
        $(".submit_event").show(); 
    }); 

}

// switches the selected_day to a new day in the same month and year.
// the day cell of the current selected_day should retrun to a white border,
// and the new selected_day should have a yellow border.
function changeDay(month, year, new_day) {  
    var prev_day_element = document.getElementById(selected_day);
    var new_day_element = document.getElementById(new_day);
    var prev_day_element_div = document.getElementById(selected_day + "_div");
    var new_day_element_div = document.getElementById(new_day + "_div");
    prev_day_element.className = "day";
    new_day_element.className = "selectedday";
    prev_day_element_div.className = "day";
    new_day_element_div.className = "selectedday";
  
    selected_day = new_day;

    // shows the event information for the new current day
    reloadDayInfo(month, year, new_day)
}

// displays the list of all the events that occur on the seleced_day
function reloadDayInfo(month, year, day) {
    $('#day_info').html("");
    $.ajax({
        url: `/api/day_events/${parseInt(month)}/${day}/${year}`
    }).done(function(data) {
        events = data["key"];
        events.forEach(element => {
            $('#day_info').append(`<p>${element}</p>`);
        });
    });
}

