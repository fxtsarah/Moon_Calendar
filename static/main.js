const week_sunstart = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const week_monstart = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var selected_day;
function calendarPage(month, year, day, wk_start_day) {
    selected_day = day;
    var fullDate = (
        new Date(year, month - 1, selected_day)
    )
    var firstDayInMonthIndex 
    var lastDayInMonth = (
        new Date(year, month, 0).getDate()
    )

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


    $('#main_container').html("");

    $('#main_container').append(`<div class = menu>
        <div class=menuitem onclick ='calendarPage(${prevmonth}, ${prevyear}, ${selected_day}, ${wk_start_day})' ><a>previous</a></div>
        <div class=menuitem><h1>${fullDate.toLocaleString('default', {month: 'long'})}, ${year}</h1></div>
        <div class=menuitem onclick ='calendarPage(${nextmonth}, ${nextyear}, ${selected_day}, ${wk_start_day})' ><a>next</a></div>
        <div id = "add-toggle" class=menuitem style = "float: right; margin-top: 30px;"><a>Add New Event</a></div>
        <div id = "pref-toggle" class = menuitem style = "float: right; margin-top: 30px;"><a>Preferences</a></div>
    </div>`)

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

    $('#pref-toggle').click(
        () => {
        $(".preference_options").toggle(); 
        }
    )

    $('#main_container').append(`<div id='add_event'></div>`);
    reloadAddEvent();

    $('#add-toggle').click(
        () => {
        $(".add_event_options").toggle(); 
        }
    )

    $('#main_container').append(`<div id='day_info'></div>`);
    reloadDayInfo(month, year, day);

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

 

    weekList.forEach((weekday_name) => {
        $('#main_container').append(`<div class="weekday">
            <div class="weekdaytxt">${weekday_name}</div>
            </div>`);
    });


    for (let i = 0; i < firstDayInMonthIndex; i += 1){
        $('#main_container').append(`<a class="day"></a>`);
    }





    var moon_images;
    var moon_img;

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










        // console.log(day);
        // $(`#${day}`).className = 'selectedday';
        //$(`#${day}`).classList.add('selectedday');



        // $.ajax({
        //     url: "/api/
        //   }).done(function(data) {
        //      // do something
        //   });

        // for i in range(1, (lastofmonth + 1)):
        // day = datetime(year, month, i, 0, 0)
        // dates.append((day, phase(position(day)), (position(day))))

    



    //     selected_day = new_day;
    //     var new_day_element = document.getElementById(selected_day);
    //     new_day_element.className = "selectedday";
    // }

    // function clickDay(date) {
    //     var new_day = date.substring(8, 10);
    //     changeDay(new_day);
    // }

    // function clickDayAjax(date){
    //     //var new_day = $(this).attr(id);
    //     var new_day = date.substring(8,10);
    //     alert(new_day);
    //     $.ajax({
    //         url: "/?month=" + "{{ month }}" + "&day=" + new_day + "&year=" + "{{ year }}" + "&wk_start_day=" + "{{ wk_start_day }}"
    //         //url: "{{ url_for('start', year = year, month = month, day = new_day, wk_start_day = wk_start_day)}}"
    //     }).done(function() {
    //         alert("done");
    //     })
    //}

}
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
    reloadDayInfo(month, year, new_day)
}

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

function reloadAddEvent() {
    $('#add_event').html("");
    $('#add_event').append(`<div class = "add_event_options" style = "display: inline-flex;">
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
</div>
<input class= "submit_event" type="submit" value="Add Event">
</form>
</div>`);

}

$(document).ready(function() {

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
}); 
