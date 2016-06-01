(function($) {
  "use strict";
  function extendSVG(element, properties){
    Object.keys(properties).forEach(function (name) {
      if ((name === 'stroke-opacity' || name === 'fill-opacity') && properties[name] === '1') { return; }
      
      element.setAttributeNS(null, name, properties[name]);
    });
    
    return element;
  }
  
  function createSVG(name, properties) {
    return extendSVG(document.createElementNS("http://www.w3.org/2000/svg", name), properties);
  }
  
  function distance(x1,y1,x2,y2) {
    var xd = x1 - x2;
    var yd = y1 - y2;
  
    // hail pythagoras
    var d = Math.sqrt(xd * xd + yd * yd);
    
    return d;
  }
  
  function calcBounding(targ){
    var bbox;
    try { bbox = targ.getBBox(); } catch(e) { }
    
    if (bbox) {
      if (!window.bbox) {
        window.main.appendChild(createSVG('rect', {
          stroke: '#0f0',
          'stroke-width': '2px',
          'stroke-dasharray': '3,3',
          'fill-opacity': 0,
          id: 'bbox',
        }));
      }
      extendSVG(window.bbox, {
        x: bbox.x,
        y: bbox.y,
        width: bbox.width,
        height: bbox.height,
      });
    }
  }
  
  function clearBounding() {
    if (window.bbox) {
      window.main.removeChild(window.bbox);
    }
  }
  
  // Our svg drawing tools :3
  var Tools = {
    polygon: {
      mousedown: function(e, relX, relY, el) {
        var sPoint = "" + relX + "," + relY;
        
        if(!el || el.tagName != 'polygon') {
          el = createSVG('polygon', {
            /* create 2 points so Tools.polygon.mousemove can edit the 2nd */
            points: sPoint + " " + sPoint,
            fill: window.fg.value,
            stroke: window.bg.value,
            'stroke-width': window.strokeWidth.value,
            'fill-opacity': window.fillOpacity.value,
            'stroke-opacity': window.strokeOpacity.value,
          });
          window.main.appendChild(el);
        } else {
          var points = el.getAttributeNS(null, 'points'),
              rg = points.split(' ');
          if (rg[rg.length - 2] === sPoint) {
            rg.pop();
            extendSVG(el, {
              points: rg.join(' '),
            });
            el = undefined;
          } else {
            extendSVG(el, {
              points: points + " " + sPoint,
            });
          }
        }
        $(document).trigger('editor:dirty');
        return el;
      },
      mousemove: function(e, relX, relY, el) {
        var sPoint = "" + relX + "," + relY;
        
        var points = el.getAttributeNS(null, 'points'),
            rg = points.split(' ');
        rg[rg.length - 1] = sPoint;
        extendSVG(el, {
         points: rg.join(' '),
        });
        
        return el;
      },
      mouseup: function(e, relX, relY, el) {
        return el;
      }
    },
    line: {
      mousedown: function(e, relX, relY) {
        var el = createSVG('line', {
          x1: relX,
          y1: relY,
          x2: relX,
          y2: relY,
          stroke: window.fg.value, // NOTE: lines use FG color!
          'stroke-opacity': window.fillOpacity.value, // NOTE: lines use FG opacity!
          'stroke-width': window.strokeWidth.value,
        });
        window.main.appendChild(el);
        $(document).trigger('editor:dirty');
        return el;
      },
      mousemove: function(e, relX, relY, el) {
        return extendSVG(el, {
          x2: relX,
          y2: relY,
        });
      }
    },
    rectangle: {
      mousedown: function(e, relX, relY) {
        var el = createSVG('rect', {
          'data-OriginX': relX,
          'data-OriginY': relY, // SVG can't support negative width or height
          x: relX,
          y: relY,
          width: 0,
          height: 0,
          fill: window.fg.value,
          stroke: window.bg.value,
          'stroke-width': window.strokeWidth.value,
          'fill-opacity': window.fillOpacity.value,
          'stroke-opacity': window.strokeOpacity.value,
        });
        window.main.appendChild(el);
        $(document).trigger('editor:dirty');
        return el;
      },
      mousemove: function(e, relX, relY, el) {
        // SVG can't support negative width or height; so calculate based on origin from `mousedown`
        var x = el.getAttributeNS(null, 'data-OriginX');
        var y = el.getAttributeNS(null, 'data-OriginY');
        
        var width = Math.abs(x - relX);
        var height = Math.abs(y - relY);
        
        return extendSVG(el, {
          x: Math.min(x, relX),
          y: Math.min(y, relY),
          width: width,
          height: height,
        });
      },
      mouseup: function(e, relX, relY, el) {
        // clean up data attributes
        el.removeAttributeNS(null, 'data-OriginX');
        el.removeAttributeNS(null, 'data-OriginY');
        return undefined;
      },
    },
    ellipse: {
      mousedown: function(e, relX, relY) {
        var el = createSVG('ellipse', {
          cx: relX,
          cy: relY,
          rx: 0,
          ry: 0,
          fill: window.fg.value,
          stroke: window.bg.value,
          'stroke-width': window.strokeWidth.value,
          'fill-opacity': window.fillOpacity.value,
          'stroke-opacity': window.strokeOpacity.value,
        });
        window.main.appendChild(el);
        $(document).trigger('editor:dirty');
        return el;
      },
      mousemove: function(e, relX, relY, el) {
        var x = el.getAttributeNS(null, "cx");
        var y = el.getAttributeNS(null, "cy");
        
        return extendSVG(el, {
          rx: Math.abs(x - relX),
          ry: Math.abs(y - relY)
        });
      }
    },
    circle: {
      mousedown: function(e, relX, relY) {
        var el = createSVG('circle', {
          cx: relX,
          cy: relY,
          r: 0,
          fill: window.fg.value,
          stroke: window.bg.value,
          'stroke-width': window.strokeWidth.value,
          'fill-opacity': window.fillOpacity.value,
          'stroke-opacity': window.strokeOpacity.value,
        });
        window.main.appendChild(el);
        $(document).trigger('editor:dirty');
        return el;
      },
      mousemove: function(e, relX, relY, el) {
        var x = el.getAttributeNS(null, "cx");
        var y = el.getAttributeNS(null, "cy");
  
        return extendSVG(el, {r: distance(x, y, relX, relY)});
      }
    },
    hand: (function() {
      var dx = 0.0, dy = 0.0; // offset from motion point
      var ox = 0.0, oy = 0.0; // origin of motion
      return {
        mousedown: function(e, relX, relY) {
          var targ = e.target;
          if (targ === window.main) return;
          ox = relX;
          oy = relY;
          calcBounding(targ);
          switch (targ.tagName) {
            case 'circle':
            case 'ellipse':
              dx = relX - parseFloat(targ.getAttributeNS(null, 'cx'), 10);
              dy = relY - parseFloat(targ.getAttributeNS(null, 'cy'), 10);
              break;
            case 'rect':
              dx = relX - parseFloat(targ.getAttributeNS(null, 'x'), 10);
              dy = relY - parseFloat(targ.getAttributeNS(null, 'y'), 10);
              break;
          }
          return targ;
        },
        mousemove: function(e, relX, relY, targ) {
          if (!window.bbox) { return; }
          
          switch (targ.tagName){
            case 'circle':
            case 'ellipse':
              targ = extendSVG(targ, {cx: relX - dx, cy: relY - dy});
              break;
            case 'rect':
              targ = extendSVG(targ, {x: relX - dx, y: relY - dy});
              break;
            case 'line':
            case 'polygon':
              // recalculate from origin
              dx = ox - relX;
              dy = oy - relY;
              
              ox = relX;
              oy = relY;
              
              if (targ.tagName === 'line'){
                targ = extendSVG(targ, {
                  x1: targ.getAttributeNS(null, 'x1') - dx,
                  y1: targ.getAttributeNS(null, 'y1') - dy,
                  x2: targ.getAttributeNS(null, 'x2') - dx,
                  y2: targ.getAttributeNS(null, 'y2') - dy,
                });
              }else if (targ.tagName === 'polygon'){
                var points = targ.getAttributeNS(null, 'points')
                  .split(' ')
                  .map(function(pt) {
                    var rg = pt.split(',');
                    var x = rg[0], y = rg[1];
                    return '' + (x - dx) + ',' + (y - dy);
                  })
                  .join(' ');
                targ = extendSVG(targ, {points: points});
              }
              break;
            default:
              console.warn('hand mousemove not implemented', targ.tagName);
              extendSVG(window.bbox, {stroke: 'red'});
              break;
          }
          calcBounding(targ);
          return targ;
        },
        mouseup: function(e, relX, relY) {
          clearBounding();
          $(document).trigger('editor:dirty');
        }
      };
    })(),
  };
  
  $(function() {
    var current, tool;
    
    function normalizeEvent(e) {
      e.preventDefault();
  
      switch (e.type) {
        case 'mousedown':
        case 'mouseup':
        case 'mousemove':
          if (e.which !== 1) {
            console.warn('non-primary mouse button'); return current;
          }
          break;
      }
      
      var handler = tool[e.type];
      if (!handler) { console.warn('unhandled', e.type); return undefined; }
      
      var parentOffset = $('#main').offset(); 
      
      var relX = e.pageX - parentOffset.left;
      var relY = e.pageY - parentOffset.top;
      
      return handler(e, relX, relY, current);
    }
    
    $(window.main)
      .on('mousedown', function(e) {
        current = normalizeEvent(e);
    });
    $(document)
      .on('mousemove mouseup', function (e){
        if (!current) return;
        current = normalizeEvent(e);
      });
    
    $('#controls input[type=radio]').change(function(e){
      var input = $(this);
      if (input.attr('name') == 'tool'){ 
        tool = Tools[input.attr('id')];
        console.log('activeTool', tool);
      }
    });
    $('#clear').click(function(e) {
      e.preventDefault();
      $('#main').html('');
      current = undefined;
      $(document).trigger('editor:dirty');
    });
  });
})(jQuery);