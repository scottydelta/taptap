#from flask import Flask
#from flask_sockets import Sockets
from flask import Flask, request, render_template
import json, time, threading, random
app = Flask(__name__)
conns = {}
users = {'trial':'temp', 'hello':'test'}
tokenmap = {}
#FrontEndCallStarts
@app.route('/users')
def userslist():
    print conns
    return json.dumps(conns)
@app.route('/payfront/<username>')
def userspay(username):
    userdata = username.split(",")
    conns[userdata[0]][1] = 103
    print "\a\a\a\a"
    print len(conns[userdata[0]])
    if len(conns[userdata[0]]) <4:
      conns[userdata[0]].append(int(userdata[1]))
    else:
      conns[userdata[0]][3] = int(userdata[1])
    print conns
    return json.dumps(conns)

@app.route('/delfront/<user>')
def usersdel(user):
    del conns[user]
    return json.dumps(conns)
#FrontEndCallsEnd
#BackEndCallStarts
@app.route('/auth', methods = ['POST'])
def authentication():
  userid = str(request.form['username'])
  passwd = str(request.form['password'])
  if userid in tokenmap:
    del tokenmap[userid]
    conns[userid][1]=101
  if userid in users and users[userid]==passwd:
    if userid not in tokenmap:
      token = ''.join(random.choice('0123456789abcdef') for i in range(10))
      tokenmap[userid] = token
      return json.dumps({"code": 0, "token": token})
    return json.dumps({"code": 0, "token": tokenmap[userid]})
  return json.dumps({"code": 1})
@app.route('/poll', methods= ['POST'])
def poller():
    token = str(request.form['token'])
    print token
    if token in tokenmap.values():
      userid = dict(zip(tokenmap.values(),tokenmap.keys()))[token]
      print userid
      if userid not in conns.keys():
        conns[userid] = [int(time.time()), 101, 'active']
      else:
        conns[userid][0] = int(time.time()) 
        conns[userid][2] = 'active'
      if conns[userid][1]==101:
        print conns[userid][1]
        return json.dumps({'code':conns[userid][1]}) 
      elif conns[userid][1]==103:
        return json.dumps({"code": conns[userid][1], "amount": conns[userid][3]})
    return json.dumps({"code":100})
@app.route('/confirm', methods = ['POST'])
def payconfirm():
    token = str(request.form['token'])
    confirm = str(request.form['confirm'])
    userid = dict(zip(tokenmap.values(),tokenmap.keys()))[token]
    if confirm=="true":
      conns[userid][1] = 105
    else:
      conns[userid][1] = 102
      
    return json.dumps({"code": conns[userid][1]})
#BackendCallEnds

def falseRem():
    for elem in conns:
        if conns[elem][0]<(int(time.time())-15):
            print "checking"
            print conns[elem][1]
            if conns[elem][1]==105 or conns[elem][1]==102:
              conns[elem][2] = "active"
            else:
              conns[elem][2] = "inactive"
    threading.Timer(3, falseRem).start()
@app.route('/')
def index():
    return render_template('index.html')
falseRem()
if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8000,debug=True)
