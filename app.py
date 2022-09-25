import json
from flask import Flask, render_template, url_for, request
from datetime import datetime
from moonphase import position, phase
from math import ceil
import calendar, math, decimal
import sqlite3

dec = decimal.Decimal

app = Flask(__name__)

# start sql query functions

# send a sql query to the database
def query(query_text):
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute(query_text)

    column_names = []
    for column in cur.description:
        column_names.append(column[0])

    rows = cur.fetchall()
    dicts = []

    for row in rows:
        d = dict(zip(column_names, row))
        dicts.append(d)

    conn.close()
    return dicts
# send a sql query with additional arguments to the database
def mod_query(query_text, *args):
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute(query_text, args)
    conn.commit()
    conn.close()

# get a list of all the events saved in the database
def get_all_events():
    return query("SELECT * FROM events")

# get a list of all the equinoxes and solstices saved in the database
def get_all_seasons():
    return query("SELECT * FROM seasons")

# get a list of all the static day events that corresplond to a particular month and day in the database
# static day events are holidays that always fall on the same day every year
def get_static_day_events(mon, day):
    return query("SELECT NAME FROM events where month = " + str(mon) + " and day = " + str(day))

# get a list of all the varied day events that corresplond to a particular month, day, and year
# varied day events are holidays that fall on the nth particular weekday of a month every year.
def get_varied_day_events(mon, day, year):
    cur_numweekday = datetime(year, mon, day).weekday()
    cur_weekday_of_mon = ceil(day / 7)
    return query("SELECT NAME FROM events where month = " + str(mon) 
    + " and weekday = " + str(cur_numweekday) 
    + " and weekdayofmonth = " + str(cur_weekday_of_mon))

# get a list of all the equinoxes and solstices that correspond to a particular month, day, and year.
def get_day_seasons(mon, day, year):
    return query("SELECT NAME FROM seasons where year = " + str(year) + " and month = " + str(mon) + " and day = " + str(day))

# get all of the events, equinoxes, and solstices that correspond to a particular month, day, and year.
def get_day_events(mon, day, year):
    static_days = get_static_day_events(mon, day)
    varied_days = get_varied_day_events(mon, day, year)
    seasons = get_day_seasons(mon, day, year)
    return static_days + varied_days + seasons

# add a static event to the database
# static day events are holidays that always fall on the same day every year
def add_static_event(name, mon, day):
    # make sure there is not already an event of this name:
    if len(query("SELECT * FROM events where name = \"" + name + "\"")) == 0:
        return mod_query("INSERT INTO events (name, month, day) VALUES (?,?,?)", name, mon, day)

#add a varied day event to the database. 
# varied day events are holidays that fall on the nth particular weekday of a month every year.
def add_varied_day_event(name, mon, weekday, weekdayofmonth):
    # make sure there is not already an event of this name:
    if len(query("SELECT * FROM events where name = \"" + name + "\"")) == 0:
        return mod_query("INSERT INTO events (name, month, weekday, weekdayofmonth) VALUES (?,?,?,?)", name, mon, weekday, weekdayofmonth)

# end sql query functions
# start calendar calculation functions

# finds the image that shows the right moon phase for a particular lunar position.
@app.template_filter('find_moon_image')
def find_moon_image(pos):
    index = (pos * dec(8)) + dec("0.5")
    index = math.floor(index)
    filename = {
      0: "newMoon.png", 
      1: "waxingCrescent.png", 
      2: "firstQuarter.png", 
      3: "waxingGibbous.png", 
      4: "fullMoon.png", 
      5: "waningGibbous.png", 
      6: "thirdQuarter.png", 
      7: "waningCrescent.png" } [int(index) & 7]
    return url_for('static', filename = filename)

# finds the current date.
now = datetime.now()

# end calendar calculation functions
# start render html funtions

@app.route("/", methods=["GET", "POST"])
def start():
    # for event in get_all_events():
    #     print(json.dumps(event) + "\n")
    wk_start_day = 1

    year = now.year
    month = now.month
    selected_day = now.day

    if request.method == "POST":
        
        d = request.form.to_dict()
        print(d)

        if len(d) != 4:
                    if d["event_type"] == "static_day":
                        add_static_event(d["new_event_name"], d["new_event_month"], d["new_event_day"])
                    elif d["event_type"] == "varied_day":
                        add_varied_day_event(d["new_event_name"], d["new_event_month_varied"], d["new_event_weekday"], d["new_event_weekdayofmonth"])            
        else:
            year = int(d["year"])
            month = int(d["month"])
            selected_day = int(d["day"])
            wk_start_day = int(d["wk_start_day"])

    dates = []
    lastofmonth = calendar.monthrange(year, month)[1]

    for i in range(1, (lastofmonth + 1)):
        day = datetime(year, month, i, 0, 0)
        dates.append((day, phase(position(day)), (position(day))))

    return render_template('calendar.html', 
    selected_day = selected_day, 
    month = month,
    year = year,
    dates = dates, 
    wk_start_day = wk_start_day)

@app.route('/api/moon_img/<int:month>/<int:day>/<int:year>') 
def moon_img_api(month, day, year):
    pos = position(datetime(year, month, day))
    moon_image = find_moon_image(pos)
    return moon_image

@app.route('/api/day_events/<int:month>/<int:day>/<int:year>') 
def day_events_api(month, day, year):
    events = get_day_events(month, day, year)
    eventNames = []
    for event in events:
        eventNames.append(event['Name'])
    returnDict = {
        "key" : eventNames
    }
    return returnDict

@app.route('/api/moon_imgs_month/<int:month>/<int:year>/<int:lastOfMonth>') 
def moon_imgs_month_api(month, year, lastOfMonth):
    moon_images = {}
    for i in range (1, lastOfMonth + 1):
        moon_images[i] = moon_img_api(month, i, year)
    return moon_images

# end render html funtions



