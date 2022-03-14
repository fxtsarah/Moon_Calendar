from flask import Flask, render_template, url_for, request
from datetime import datetime
from moonphase import position, phase
from math import ceil
import calendar, math, decimal
import sqlite3
import numpy
import skyfield
from skyfield import api
from skyfield import almanac

ts = api.load.timescale()
eph = api.load('de421.bsp')

dec = decimal.Decimal

app = Flask(__name__)

# start sql query functions

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

def mod_query(query_text, *args):
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    cur.execute(query_text, args)
    conn.commit()
    conn.close()

def get_all_events():
    return query("SELECT * FROM events")

def get_all_seasons():
    return query("SELECT * FROM seasons")

def get_static_day_events(mon, day):
    return query("SELECT NAME FROM events where month = " + str(mon) + " and day = " + str(day))

def get_varied_day_events(mon, day, year):
    cur_numweekday = datetime(year, mon, day).weekday()
    cur_weekday_of_mon = ceil(day / 7)
    return query("SELECT NAME FROM events where month = " + str(mon) 
    + " and weekday = " + str(cur_numweekday) 
    + " and weekdayofmonth = " + str(cur_weekday_of_mon))

def get_day_seasons(mon, day, year):
    return query("SELECT NAME FROM seasons where year = " + str(year) + " and month = " + str(mon) + " and day = " + str(day))

def get_day_events(mon, day, year):
    static_days = get_static_day_events(mon, day)
    varied_days = get_varied_day_events(mon, day, year)
    seasons = get_day_seasons(mon, day, year)
    return static_days + varied_days + seasons

def add_static_event(name, mon, day):
    return mod_query("INSERT INTO events (name, month, day) VALUES (?,?,?)", name, mon, day)

def add_varied_day_event(name, mon, weekday, weekdayofmonth):
    return mod_query("INSERT INTO events (name, month, weekday, weekdayofmonth) VALUES (?,?,?,?)", name, mon, weekday, weekdayofmonth)

# end sql query functions
# start calendar calculation functions

@app.template_filter('find_moon_image')
def find_moon_image(pos):
    index = (pos * dec(8)) + dec("0.5")
    index = math.floor(index)
    filename = {
      0: "new moon.png", 
      1: "Waxing Crescent.png", 
      2: "first quarter.png", 
      3: "Waxing Gibbous.png", 
      4: "full moon.png", 
      5: "Waning Gibbous.png", 
      6: "third quarter.png", 
      7: "Waning Crescent.png" } [int(index) & 7]
    return url_for('static', filename = filename)

now = datetime.now()

# end calendar calculation functions
# start render html funtions

@app.route("/")
def start():
    year = request.args.get('year', type = int) or now.year
    month = request.args.get('month', type = int) or now.month
    selected_day = request.args.get('day', type = int) or now.day
    wk_start_day = request.args.get('wk_start_day', type = int)

    if month == 12:
        nextmonth = 1
        prevmonth = 11
        nextyear = year + 1
        prevyear = year
    
    elif month == 1:
        nextmonth = 2
        prevmonth = 12
        nextyear = year
        prevyear = year - 1
        
    else:
        nextmonth = month + 1
        prevmonth = month - 1
        nextyear = year
        prevyear = year
    
    week_sunstart = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    week_monstart = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    monthname = datetime(year, month, 1).strftime("%B")
    numweekday = datetime(year, month, 1).weekday()

    if wk_start_day == 0:
        placeholders = list(range(0, numweekday))
        week = week_monstart
    else:
        placeholders = list(range(0, (numweekday + 1) % 7))
        week = week_sunstart

    selected_day_datetime = datetime(year, month, selected_day, 0, 0)

    dates = []
    lastofmonth = calendar.monthrange(year, month)[1]

    event_list = get_day_events(month, selected_day, year)

    for i in range(1, (lastofmonth + 1)):
        day = datetime(year, month, i, 0, 0)
        dates.append((day, phase(position(day)), (position(day))))

    return render_template('calendar.html', 
    selected_day = selected_day, 
    selected_phase = phase(position(selected_day_datetime)),
    monthname = monthname, 
    month = month,
    year = year, 
    dates = dates, 
    week = week, 
    placeholders = placeholders,
    nextmonth = nextmonth,
    prevmonth = prevmonth,
    nextyear = nextyear,
    prevyear = prevyear,
    event_list = event_list,
    wk_start_day = wk_start_day)

@app.route("/add", methods=["GET","POST"])
def start_add():
    if request.method == "POST":
        d = request.form.to_dict()
        if d["event_type"] == "static_day":
            add_static_event(d["new_event_name"], d["new_event_month"], d["new_event_day"])
        elif d["event_type"] == "varied_day":
            add_varied_day_event(d["new_event_name"], d["new_event_month"], d["new_event_weekday"], d["new_event_weekdayofmonth"])
    return render_template('add-event-page.html')

# end render html funtions

