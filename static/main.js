const week_sunstart = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const week_monstart = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// testing git 
// new branch addition
function calendarPage(month, year, day) {
    var fullDate = (
        new Date(year, month, day)
    )
    var firstDayInMonthIndex = (
        new Date(year, month - 1).getDay()
    )
    var lastDayInMonth = (
        new Date(year, month, 0).getDate()
    )

    var nextmonth;
    var prevmonth;
    var nextyear;
    var prevyear;

    if (month == 11) {
    nextmonth = 1;
    prevmonth = 11;
    nextyear = year + 1;
    prevyear = year;
    }

    else if (month == 0) {
    nextmonth = 1;
    prevmonth = 10;
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
        <div class=menuitem onclick ='calendarPage(${prevmonth}, ${prevyear}, ${day})' ><a>previous</a></div>
        <div class=menuitem><h1>${fullDate.toLocaleString('default', {month: 'long'})}, ${year}</h1></div>
        <div class=menuitem onclick ='calendarPage(${nextmonth}, ${nextyear}, ${day})' ><a>next</a></div>
        <div class=menuitem style = "float: right; margin-top: 30px;"><a>Add New Event</a></div>
        <div id = "pref-toggle" class = menuitem style = "float: right; margin-top: 30px;"><a>Preferences</a></div>
    </div>`)

    $('#main_container').append(`<div id = "preference_options" class = "preference_options">
            <form style = "display: block;"> 
                <b style = "display: block;"><p>First Day of the Week:</p></b>
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

    $('#main_container').append(`<form> 
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
        <input class= "submit-button" type="submit" value="Go To Date">
    </form>`)
    
    $('#main_container').append(`<div id='day_info'></div>`);
    

    $.ajax({
        url: `/api/day_events/${parseInt(month) + 1}/${day}/${year}`
    }).done(function(data) {
        events = data["key"];

        events.forEach(element => {
            $('#day_info').append(`<p>${element["Name"]}</p>`);
        });

        console.log(events);
    });

    week_sunstart.forEach((weekday_name) => {
        $('#main_container').append(`<div class="weekday">
            <div class="weekdaytxt">${weekday_name}</div>
            </div>`);
    });

    for (let i = 0; i < firstDayInMonthIndex; i += 1){
        $('#main_container').append(`<a class="day"></a>`);
    }



    var moon_img;

    for (let i = 1; i < lastDayInMonth + 1; i += 1){

        $.ajax({
            url: `/api/moon_img/${month}/${i}/${year}`

        }).done(function(data) {
            moon_img = data;
            if(i == day){
                $('#main_container').append(`<div class="selectedday" onclick ='calendarPage(${month}, ${year}, ${i})'> 
                                                <img src= "${moon_img}"> 
                                                <span id = "${i}">${i}</span>
                                            </div>`);
           } else {
           $('#main_container').append(`<div class="day" onclick ='calendarPage(${month}, ${year}, ${i})'> 
                                            <img src= "${moon_img}"> 
                                            <span id = "${i}" >${i}</span>
                                        </div>`);
           }
        })

    }



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

    }
    
    
    
    
    
    



    // var selected_year;
    // var selected_month;
    // var selected_day = "{{ day }}";

    // function changeDay(new_day) {  
    //     var prev_day_element = document.getElementById(selected_day);
    //     if (prev_day_element != null) {
    //         prev_day_element.className = "day";
    //     }

    //     selected_day = new_day;
    //     var new_day_element = document.getElementById(selected_day);
    //     new_day_element.className = "selectedday";
    // }

    // function clickDay(date) {
    //     var new_day = date.substring(8, 10);
    //     changeDay(new_day);
    // }

    function clickDayAjax(date){
        //var new_day = $(this).attr(id);
        var new_day = date.substring(8,10);
        alert(new_day);
        $.ajax({
            url: "/?month=" + "{{ month }}" + "&day=" + new_day + "&year=" + "{{ year }}" + "&wk_start_day=" + "{{ wk_start_day }}"
            //url: "{{ url_for('start', year = year, month = month, day = new_day, wk_start_day = wk_start_day)}}"
        }).done(function() {
            alert("done");
        })
    }

