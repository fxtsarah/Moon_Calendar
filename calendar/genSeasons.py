import numpy
import skyfield
from skyfield import api
from skyfield import almanac
import sqlite3

ts = api.load.timescale()
eph = api.load('de421.bsp')

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

def generateSeasons():
    t0 = ts.utc(1900, 1, 1)
    t1 = ts.utc(2052, 12, 31)
    t, y = almanac.find_discrete(t0, t1, almanac.seasons(eph))
    for yi, ti in zip(y, t):

        y = 0
        year = ""
        while y < 4:
          year += (ti.utc_iso(' ')[y])
          y += 1

        month = ""
        m = 5
        while m < 7:
          month += (ti.utc_iso(' ')[m])
          m += 1
        
        day = ""
        d = 8
        while d < 10:
          day += (ti.utc_iso(' ')[d])
          d += 1
        mod_query("INSERT INTO seasons (name, year, month, day) VALUES (?,?,?,?)", almanac.SEASON_EVENTS[yi], year, month, day)