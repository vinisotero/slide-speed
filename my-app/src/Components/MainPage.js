import '../App.css'
import { useNavigate } from 'react-router-dom';
import {userInfo} from "./UserInfos";
import {useEffect} from 'react';
import $ from 'jquery';
import icon from '../imgs/icon-erro.png';

function MainPage() {

  const width = window.screen.availWidth;
  const height = window.screen.availHeight;
  const navigate = useNavigate();
  var xValue = null;

  useEffect(() => {
    if ($('.gesture-testing').length) {
      var log = function(label, value) {
        var id = label.replace(/\s/g, '-').toLowerCase();
        var el = $('#'+id);
        if (!el.length) {
          $('.info-wrapper').append('<div class="info"><span class="label">'+label+'</span><span class="value" id="'+id+'">'+value+'</span></div>');
        } else {
          el.html(value);
        }
      };
      var updateIndicies = {};
      var updateChar = ['-', '-', '-', '+', '+', '+', '*', '*', '*', '+', '+', '+'];
    
      var ticker = function(name, incrementBy) {
        updateIndicies[name] = updateIndicies[name] || 0;
        updateIndicies[name] += Math.max(incrementBy || 1, 1);
        if (updateIndicies[name] >= updateChar.length) {
          updateIndicies[name] = 0;
        }
        //log(name, updateChar[updateIndicies[name]]);
      };
    }
    
    var Speed = {};
    
    Speed.Event = function(e) {
      
      e = e.originalEvent || e;
      
      var position = e;
      if (e.touches && e.touches[0]) {
        position = e.touches[0];
      } else if (e.changedTouches && e.changedTouches[0]) {
        position = e.changedTouches[0];
      }
    
      return {
        target: function() {
          return document.elementFromPoint(this.pageX(), this.pageY());
        },
        
        pageX: function() {
          xValue = position.pageX;
          return xValue;
        },
        
        pageY: function() {
          return position.pageY
        },
        
        preventDefault: function() {
          return e.preventDefault();
        }
      };
    };
    
    Speed.Mouse = function(config) {
    
      var velocity = new Speed.Velocity();
      var mousedown = false;
      
      $(config.selector).on('mousedown', function(e) {
        e = new Speed.Event(e);
        
        mousedown = true;    
        velocity.setPoint();
        velocity.setPoint(new Speed.Point(e.pageX(), e.pageY()));
        
        config.start.call(this, e, velocity);
      });
      
      $(document).on('mouseup', function(e) {
        if (!mousedown) { return; }
        
        e = new Speed.Event(e);
        mousedown = false;
        velocity.setPoint();
        config.end.call(this, e, velocity);
      });
      
      $(config.selector).on('mousemove', function(e) {
        if (!mousedown) { return; }
        
        e = new Speed.Event(e);
        velocity.setPoint(new Speed.Point(e.pageX(), e.pageY()));
        
        config.update.call(this, e, velocity);
      });
    };
    
    Speed.Touch = function(config) {
      var velocity = new Speed.Velocity();
    
      $(config.selector).bind('touchstart', function(e) {
        e = new Speed.Event(e);
        
        e.preventDefault();
        velocity.setPoint();
        velocity.setPoint(new Speed.Point(e.pageX(), e.pageY()));
        config.start.call(this, e, velocity);
      });
    
      $(config.selector).bind('touchend', function(e) {
        e = new Speed.Event(e);
        velocity.setPoint();
        config.end.call(this, e, velocity);
      });
    
      $(config.selector).bind('touchmove', function(e) {
        e = new Speed.Event(e);
        velocity.setPoint(new Speed.Point(e.pageX(), e.pageY()));
        config.update.call(this, e, velocity);
      });
    };
    
    Speed.Updater = function(config) {
    
      var updateInterval = 120;
      var updateVelocity = new Speed.Velocity();
      var timerToken;
      var lastE;
    
      var update = function(e, velocity) {
        lastE = e;
        updateVelocity.setPoint(velocity.getPoint());
      };
    
      var start = function(e, velocity) {
        timerToken = setInterval(function() {
          updateVelocity.mark();
          config.update.call(this, lastE||e, updateVelocity); 
        }, updateInterval);
        
        updateVelocity.setPoint(velocity.getPoint());
        
        if (config.start) {
          config.start.call(this, e, updateVelocity);
        }
      };
    
      var end = function(e, velocity) {
        clearTimeout(timerToken);
        timerToken = null;
        
        updateVelocity.setPoint(velocity.getPoint());
        
        if (config.end) {
          config.end.call(this, e, updateVelocity);
        }
      };
      
      new Speed.Mouse({
        selector: config.selector,
        start: start,
        end: end,
        update: update
      });
    
      new Speed.Touch({
        selector: config.selector,
        start: start,
        end: end,
        update: update
      });
    };
    
    Speed.Gesture = function(config) {
      
      var currentGesture = null;
        
      var finishGesture = function(e) {
        if (currentGesture) { currentGesture.finish(e); }
        currentGesture = null;
      };
      
      this.setGesture = function(gesture, e, velocity, arg1, arg2) {
        
        if (currentGesture) {
          if (currentGesture.is(gesture)) {
            currentGesture.update(e, velocity, arg1, arg2);
          } else {
            var nextGesture = Speed.Gesture.Manager.create(gesture, [this, e, velocity, arg1, arg2]);
            currentGesture.finish(e, nextGesture);
            currentGesture = nextGesture;
          } 
        } else {
          currentGesture = Speed.Gesture.Manager.create(gesture, [this, e, velocity, arg1, arg2]);
        }
      };
      
      this.getGesture = function() {
        return currentGesture;
      };
        
      var update = function(e, velocity) {
        if (velocity.velocity() < 30) {
          this.setGesture('touch', e, velocity);
          return;
        }
        
        var vX = velocity.velocityX();
        var vY = velocity.velocityY();
        var v;
        var factor;
        var directions = {};
           
        if (Math.abs(vX) > Math.abs(vY)) {
          v = vX;
          directions[1] = 'right';
          directions[-1] = 'left';
        } else {
          v = vY;
          directions[1] = 'down';
          directions[-1] = 'up';
        }
        
        var absV = Math.abs(v);
        if (absV < 250) {
          factor = 1;
        } else if (absV < 600) { 
          factor = 2;
        } else if (absV < 1200) {
          factor = 3;
        } else {
          factor = 4;
        }
        
        this.setGesture('move', e, v, directions[v/absV], factor);  
      }; 
      
      this.touch = function() { 
        if (config.touch) {
          config.touch.apply(config, arguments);
        }
      };
    
      this.hold = function() {
        if (config.hold) { 
          config.hold.apply(config, arguments);
        }
      };
    
      this.move = function() {
        if (config.move) {
          config.move.apply(config, arguments);
        }
      };
       
      new Speed.Updater({
        selector: config.selector,
        start: $.proxy(function(e, velocity) {
          this.setGesture('touch', e, velocity);
        }, this),
        update: $.proxy(update, this),
        end: $.proxy(function() {
          finishGesture.apply(this, arguments) ;
        }, this)
      });
      
    };
    
    Speed.Gesture.Manager = {
      
      gestures: {},
        
      register: function(id, constructor) {
        this.gestures[id] = constructor;
      },
      
      create: function(id, args) {
        var instance = Object.create(this.gestures[id].prototype);
        return this.gestures[id].apply(instance, args);
      }
    };
    
    Speed.Gesture.Touch = function(owner, e) {
    
      var firstE = e;
      var timer = new Date().getTime();
    
      return {
    
        is: function(gesture) {
          return gesture === 'touch';
        },
    
        update: function(e, velocity) {
          var now = new Date().getTime();
    
          if (timer + 350 < now) {
            
            owner.setGesture('hold', e, velocity);
            owner.getGesture().update(e, velocity);
          }
        },
    
        finish: function(e, nextGesture) {
          // don't fire touch if another gesture is queued
          if (nextGesture) {
            return; 
          }
    
          var now = new Date().getTime();
          //if (timer + 10 < now && e.target() === firstE.target()) {
          //if (e.target() === firstE.target()) {
            owner.touch.call(this, e.target());
          //}
        }
      };
    };
      
    Speed.Gesture.Manager.register('touch', Speed.Gesture.Touch);
    
    Speed.Gesture.Hold = function(owner, e) {
    
      var firstE = e;
      var count = 0;
    
      return {
    
        is: function(gesture) { 
          return gesture === 'touch' || gesture === 'hold';
        },
    
        update: function(e, velocity) {
          if (e.target() === firstE.target()) {
            count++;
            owner.hold.call(this, e.target(), Math.min(4, parseInt(count / 3) + 1));
          }
        },
    
        finish: function(e, nextGesture) { }
      };
    };
    
    Speed.Gesture.Manager.register('hold', Speed.Gesture.Hold);
    
    Speed.Gesture.Move = function(owner, e, velocity, direction, factor) {
      
      return {
    
        is: function(gesture) {
          return gesture === 'move';
        },
    
        update: function(e, velocity, direction, factor) {
          owner.move.call(this, e.target(), direction, factor);
        },
    
        finish: function(e, nextGesture) { }
      };
    };
    
    Speed.Gesture.Manager.register('move', Speed.Gesture.Move);
    
    
    
    
    Speed.Point = function(x, y) { 
    
      var pointX = x;
      var pointY = y;
    
      return {
        get: function() {
          var point = [pointX, pointX];
          point.x = pointX;
          point.y = pointX;
          return point;
        },
    
        set: function(x, y) {
          pointX = x;
          pointY = y;
        },
    
        getX: function(x) {
          return pointX;
        },
    
        getY: function(y) {
          return pointY;
        },
    
        setX: function(x) {
          pointX = x;
        },
    
        setY: function(y) {
          pointY = y;
        }
      };
    };
    
    Speed.Velocity = function(point) {
    
      var p1 = point;
      var p2 = p1;
      var t1 = new Date().getTime();
      var t2 = t1;
      var marked = null;
    
      var calcVelocity = function(coord1, coord2) {
        return ((coord1 - coord2) / (t1 - t2)) * 1000;
      };
    
      return {
        velocityX: function() {
          if (!p1 || !p2) { return 0; }
          return Math.round(calcVelocity(p1.getX(), p2.getX()));
        },
    
        velocityY: function() {
          if (!p1 || !p2) { return 0; }
          return Math.round(calcVelocity(p1.getY(), p2.getY()));
        },
    
        velocity: function() {
          if (!p1 || !p2) { return 0; }
          var vx = calcVelocity(p1.getX(), p2.getX()),
              vy = calcVelocity(p1.getY(), p2.getY());
          return Math.round(Math.sqrt((vx * vx) + (vy * vy)));
        },
    
        setPoint: function(p) {
          p2 = p1;
          t2 = t1;
          p1 = p;
          t1 = new Date().getTime();
          marked = null;
        },
    
        getPoint: function() {
          return p1;
        },
    
        mark: function() {
          var now = new Date().getTime();
          if (marked && marked + 150 < now) {
            this.setPoint();
          }
          marked = marked || now;
        }
      };
    };
    
    if ($('.gesture-testing').length) {
      // Viewport 
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      //log('Viewport', w+'x'+h);
    
    
      //log('Touching', 'No');
      //log('Touch moving', '-');
      //log('Mouse down', 'No');
      //log('Mouse moving', '-');
      //log('Velocity', '0');
      //log('VelocityX', '0');
      //log('VelocityY', '0');
      //log('Update', '-');
      //log('Last gesture', '-');
      //log('Last gesture args', '-');
    
      new Speed.Mouse({
        selector: '.target',
        start: function() {
          //log('Mouse down', 'Yes');
        },
        end: function() {
          //log('Mouse down', 'No');
        },
        update: function() {
          ticker('Mouse moving', 3);
        }
      });
    
      new Speed.Touch({
        selector: '.target',
        start: function() {
          //log('Touching', 'Yes');
        },
        end: function() {
          //log('Touching', 'No');
        },
        update: function() {
          ticker('Touch moving', 3);
        }
      });
    
      new Speed.Updater({
        selector: '.target',
        update: function(e, velocity) {  
          var myVelocity = velocity.velocity() * 0.026458333333;
          log('Velocity', myVelocity + ' cm/s');
          //log('X: ', xValue);
          //log('VelocityX', velocity.velocityX()); 
          //log('VelocityY', velocity.velocityY());
    
          ticker('Update');
        }
      });
    
      var gestureTimer;
      var setGesture = function(gesture, args) {
        //log('Last gesture', gesture);
        //log('Last gesture args', args||'-');
    
        clearTimeout(gestureTimer);
        gestureTimer = setTimeout(function() {
          //log('Last gesture', '-');
          //log('Last gesture args', '-');
        }, 1000);
    
      };
    
      new Speed.Gesture({
        selector: '.target',
        touch: function() {
          setGesture('touch');
        },
        hold: function(el, factor) {
          setGesture('hold', factor);
        }, 
        move: function(el, direction, factor) {
          setGesture('move', direction + '.' + factor);
        }
      });
    }
  }, [])

  return (
    <>
    {width >= 700 && height >= 500 ? (
      <>
        <div class="target gesture-testing">
          <div class="info-wrapper">
            <div id = "begin-point"></div>
            <div id = "path"></div>
            <div id = "end-point"></div>
          </div>
        </div>
      </>

    ): (
      <>
        <p id = 'error-mesage'>Your device is too small! Use a tablet to use this website!</p>
        <img src={icon} alt="Icon Error" id = "icon-error"></img>
      </>
    )}
    </>
  );
}

export default MainPage;
