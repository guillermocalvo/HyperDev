/*
 turtle.js - a turtle library for canvas
 [The "BSD licence"]
 Copyright (c) 2008, John Snyders
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var jjs = window.jjs || {}; // my namespace
jjs.Turtle = (function ()
{

/**
 * @fileoverview
 * Object Turtle is a LOGO style turtle for drawing on a HTML canvas 2d context
 *
 * @name Turtle
 * @author John Snyders
 * @license BSD
 * @version 0.1
 */

/**
 * @class
 * Construct a Turtle object.
 * <p>The turtle starts off at the origin (0,0) heading 0 degrees which is east.
 * The initial pen color (style) is black and solid and the initial width is 2.
 * There are 360 degrees to a circle. The units for distance and pen width are
 * the same as for the 2d context.</p>
 *
 * <p>The turtle will use whatever context settings are in effect such as
 * lineCap, globalAlpha etc. except for penWidth and penStyle
 * which are maintained independently by the turtle.
 * lineJoin will have no effect because each linear motion of the turtle
 * is a seperate path.</p>
 *
 * <p>Any transformations on the canvas will confuse the clear method.</p>
 *
 * <p>All turtle methods return the turtle so that you can chain method calls.</p>
 * <h3>Example:<h3>
 * @example
 * <pre>
 * var t = new jjs.Turtle(canvas);
 * t.penDown().forward(10).right(90).forward(10).right(90).forward(10)
 *   .right(90).forward(10);
 * </pre>
 *
 * @param canvas a canvas element. The caller must make sure the canvas supports a 2d context.
 * @constructor
 */
function Turtle(canvas) 
{
  this.ctx = canvas.getContext('2d');
  this.canvasWidth = canvas.clientWidth;
  this.canvasHeight = canvas.clientHeight;
  /** current x position. OK to read use goto to set. */
  this.x = 0.0;
  /** current y position. OK to read use goto to set.  */
  this.y = 0.0;
  /** current heading. OK to read use heading to set. */ 
  this.h = 0.0;
  /** true when the pen is down, false otherwise */
  this.penIsDown = false;
  /** pen width. OK to read use width to set. */ 
  this.penWidth = 2;
  /** pen style. OK to read use style to set. */ 
  this.penStyle = 'black';
  /* implementation */
  this.stack = []; // to save and restore turtle state
}

/**
 * Sets up the normal turtle drawing world with 0,0 in the center
 * of the canvas and positive values of y going up.
 *
 * @param canvas a canvas element. The caller must make sure the canvas supports a 2d context.
 * @static
 */
Turtle.init = function(canvas)
{
  var ctx = canvas.getContext('2d');
  ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2); // center origin
  ctx.scale(1, -1); // reverse up and down
};

Turtle.prototype = {
  deg2rad: Math.PI / 180.0,

  /**
   * Move forward d units in the current direction. 
   * If the pen is down a line is drawn in the current style and width.
   * @param d the distance to move
   * @return this
   */
  forward: function(d) 
  {
    var x1 = this.x + (d * Math.cos(this.h));
    var y1 = this.y + (d * Math.sin(this.h));
    if (this.penIsDown)
    {
      this.ctx.lineWidth = this.penWidth;
      this.ctx.strokeStyle = this.penStyle;
      this.ctx.beginPath();
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(x1, y1);
      this.ctx.stroke();
    }
    this.x = x1;
    this.y = y1;
    return this;
  },

  /**
   * Move backward d units in the current direction. 
   * If the pen is down a line is drawn in the current style and width.
   * @param d the distance to move
   * @return this
   */
  back: function(d)
  {
    return this.forward(-d);
  },

  /**
   * Turn left a degrees. The current heading is updated. Right and left are determined
   * by facing in the forward direction given by the current heading.
   * @param a the angle to turn by
   * @return this
   */
  left: function(a)
  {
    this.h += a * this.deg2rad;
    return this;
  },

  /**
   * Turn right a degrees. The current heading is updated. Right and left are determined
   * by facing in the forward direction given by the current heading.
   * @param a the angle to turn by
   * @return this
   */
  right: function(a)
  {
    return this.left(-a);
  },

  /**
   * Pick the pen up. With the pen up moving forward or back leaves no line.
   * @return this
   */
  penUp: function()
  {
    this.penIsDown = false;
    return this;
  },

  /**
   * Put the pen down. With the pen down moving forward or back leaves a line.
   * @return this
   */
  penDown: function()
  {
    this.penIsDown = true;
    return this;
  },

  /**
   * Set the heading to a degrees. Zero degrees is east.
   * @param a the angle to turn by
   * @return this
   */
  heading: function(a)
  {
    this.h = a * this.deg2rad;
    return this;
  },

  /**
   * Move the turtle to given x, y coordinates without drawing a line
   * regardless of the pen setting.
   * @param x x position
   * @param y y position
   * @return this
   */
  moveTo: function(x, y)
  {
    this.x = x;
    this.y = y;
    return this;
  },

  /**
   * Move the turtle home. This is the same as goto(0,0), heading(0).
   * @return this
   */
  home: function()
  {
    this.moveTo(0,0);
    return this.heading(0);
  },

  /**
   * Clear the turtle canvas
   * @param color optional background color. If not specified the background will be transparent.
   * @return this
   */
  clear: function(color)
  {
    var x = 0;
    var y = 0;
    var prevColor;
    if (color)
    {
      prevColor = this.ctx.fillStyle;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, this.canvasWidth, this.canvasHeight);
      this.ctx.fillStyle = prevColor;
    }
    else
    {
      this.ctx.clearRect(x, y, this.canvasWidth, this.canvasHeight);
    }
    return this;
  },

  /**
   * Set the pen width. pw is any legal value for context lineWidth.
   * The lineWidth is not set until there is drawing to do.
   * @param pw the pen width
   * @return this
   */
  width: function(pw)
  {
    this.penWidth = pw;
    return this;
  },

  /**
   * Set the pen style. s is any legal value for context strokeStyle.
   * The strokeStyle is not set until there is drawing to do.
   * @param s a canvas style. 
   * @return this
   */
  style: function(s)
  {
    this.penStyle = s;
    return this;
  },

  /**
   * Save the current turtle state and context state on the stack.
   * This does a save on the context.
   * @return this
   */
  push: function()
  {
    this.stack.push({x: this.x, y: this.y, 
                     h: this.h, penIsDown: this.penIsDown, 
                     penWidth: this.penWidth, penStyle: this.penStyle });
    this.ctx.save();
    return this;
  },

  /**
   * Restore the current turtle state and context state from the stack.
   * This does a restore on the context.
   * @return this
   */
  pop: function()
  {
    var state = this.stack.pop();
    this.x = state.x;
    this.y = state.y;
    this.h = state.h;
    this.penIsDown = state.penIsDown;
    this.penWidth = state.penWidth;
    this.penStyle = state.penStyle;
    this.ctx.restore();
    return this;
  },

  /**
   * Format the turtle state as a string.
   */
  toString: function()
  {
    var out = "{x: " + this.x + ", y: " + this.y + ", pen: ";
    out += this.penIsDown ? "down" : "up";
    out += ", penWidth: " + this.penWidth;
    out += ", penStyle: " + this.penStyle;
    out += ", stack depth: " + this.stack.length;
    out += "}";
    return out;
  }
};
  return Turtle;
})();
