from flask import Flask, render_template, redirect, url_for, request
from datetime import datetime
from moonphase import position, phase
import calendar




app = Flask(__name__)

@app.route("/")
def start():
    return redirect(url_for("start3", year=2021, month=11))
    # dates = []
    # week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    # for i in range(1,32):
    #     day = datetime(2021, 10, i, 0, 0)
    #     dates.append((day, phase(position(day))))
    # return render_template('calendar.html', dates = dates, week = week, placeholders = list(range(1,6)))

@app.route("/month/<int:year>/<int:month>")
def start3(year, month):
    if month == 13:
        year += 1
        month = 1
    if month == 0:
        year -= 1
        month = 12
    
    week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    monthname = datetime(year, month, 1).strftime("%B")
    numweekday = datetime(year, month, 1).weekday()
    selected_day = request.args.get('day', type= int)
    print (selected_day)
    placeholders = list(range(0, numweekday))

    dates = []
    lastofmonth = calendar.monthrange(year, month)[1]
    
    for i in range(1, (lastofmonth + 1)):
        day = datetime(year, month, i, 0, 0)
        dates.append((day, phase(position(day))))
    return render_template('calendar.html', selected_day= selected_day, monthname = monthname, month = month, year = year, dates = dates, week = week, placeholders = placeholders)
