From: "Saved by Windows Internet Explorer 8"
Subject: 
Date: Tue, 17 Jan 2012 19:17:13 +0430
MIME-Version: 1.0
Content-Type: text/html;
	charset="utf-8"
Content-Transfer-Encoding: quoted-printable
Content-Location: https://raw.github.com/rails/jquery-ujs/master/src/rails.js
X-MimeOLE: Produced By Microsoft MimeOLE V6.1.7600.16385

=EF=BB=BF<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML><HEAD>
<META content=3D"text/html; charset=3Dutf-8" http-equiv=3DContent-Type>
<META name=3DGENERATOR content=3D"MSHTML 8.00.7600.16385"></HEAD>
<BODY><PRE>(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =
=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=
=3D=3D=3D=3D
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a =
result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and =
allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to =
process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for =
non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow =
standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is =
detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file =
upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * =
=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=3D=
=3D=3D
 *
 * If any blank required inputs (required=3D"required") are detected in =
the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow =
standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler =
to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are =
blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to =
exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, =
elements){
 *       // Returning false in this handler tells rails.js to submit the =
form anyway.
 *       // The blank required inputs are passed to this function in =
`elements`.
 *       return ! confirm("Would you like to submit the form with =
missing info?");
 *     });
 */

  // Shorthand to make it a little easier to call public rails functions =
from within rails.js
  var rails;

  $.rails =3D rails =3D {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], =
a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], =
textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=3Dsubmit], form =
input[type=3Dimage], form button[type=3Dsubmit], form =
button:not(button[type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], =
button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, =
button[data-disable-with]:disabled, =
textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: =
'input[name][required]:not([disabled]),textarea[name][required]:not([disa=
bled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote =
submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token =3D $('meta[name=3D"csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event =
result is false
    fire: function(obj, name, data) {
      var event =3D $.Event(name);
      obj.trigger(event, data);
      return event.result !=3D=3D false;
    },

    // Default confirm dialog, may be overridden with custom confirm =
dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in =
$.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data,
        crossDomain =3D element.data('cross-domain') || null,
        dataType =3D element.data('type') || ($.ajaxSettings &amp;&amp; =
$.ajaxSettings.dataType),
        options;

      if (rails.fire(element, 'ajax:before')) {

        if (element.is('form')) {
          method =3D element.attr('method');
          url =3D element.attr('action');
          data =3D element.serializeArray();
          // memoized value from clicked submit button
          var button =3D element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method =3D element.data('method');
          url =3D element.data('url');
          data =3D element.serialize();
          if (element.data('params')) data =3D data + "&amp;" + =
element.data('params');
        } else {
          method =3D element.data('method');
          url =3D element.attr('href');
          data =3D element.data('params') || null;
        }

        options =3D {
          type: method || 'GET', data: data, dataType: dataType, =
crossDomain: crossDomain,
          // stopping the "ajax:beforeSend" event will cancel the ajax =
request
          beforeSend: function(xhr, settings) {
            if (settings.dataType =3D=3D=3D undefined) {
              xhr.setRequestHeader('accept', '*/*;q=3D0.5, ' + =
settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, =
settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          }
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url =3D url; }

        return rails.ajax(options);
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // &lt;a href=3D"/users/5" data-method=3D"delete" rel=3D"nofollow" =
data-confirm=3D"Are you sure?"&gt;Delete&lt;/a&gt;
    handleMethod: function(link) {
      var href =3D link.attr('href'),
        method =3D link.data('method'),
        target =3D link.attr('target'),
        csrf_token =3D $('meta[name=3Dcsrf-token]').attr('content'),
        csrf_param =3D $('meta[name=3Dcsrf-param]').attr('content'),
        form =3D $('&lt;form method=3D"post" action=3D"' + href + =
'"&gt;&lt;/form&gt;'),
        metadata_input =3D '&lt;input name=3D"_method" value=3D"' + =
method + '" type=3D"hidden" /&gt;';

      if (csrf_param !=3D=3D undefined &amp;&amp; csrf_token !=3D=3D =
undefined) {
        metadata_input +=3D '&lt;input name=3D"' + csrf_param + '" =
value=3D"' + csrf_token + '" type=3D"hidden" /&gt;';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' =
attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element =3D $(this), method =3D element.is('button') ? =
'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' =
data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element =3D $(this), method =3D element.is('button') ? =
'html' : 'val';
        if (element.data('ujs:enable-with')) =
element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; =
`false` otherwise.
      Attaching a handler to the element's `confirm` event that returns =
a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that =
returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not =
the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message =3D element.data('confirm'),
          answer =3D false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer =3D rails.confirm(message);
        callback =3D rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer &amp;&amp; callback;
    },

    // Helper function which checks for blank inputs in a form that =
match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs =3D $(), input,
        selector =3D specifiedSelector || 'input,textarea';
      form.find(selector).each(function() {
        input =3D $(this);
        // Collect non-blank inputs if nonBlank option is true, =
otherwise, collect blank inputs
        if (nonBlank ? input.val() : !input.val()) {
          inputs =3D inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that =
match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true =
specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events =3D form.data('events'), continuePropagation =3D true;
      if (events !=3D=3D undefined &amp;&amp; events['submit'] !=3D=3D =
undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler =3D=3D=3D 'function') return =
continuePropagation =3D obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after =
storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled =
state
      element.html(element.data('disable-with')); // set to disabled =
state
      element.bind('click.railsDisable', function(e) { // prevent =
further clicking
        return rails.stopEverything(e)
      });
    },

    // restore element to its original state which was disabled by =
'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !=3D=3D undefined) {
        element.html(element.data('ujs:enable-with')); // set to old =
enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes =
hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( =
!options.crossDomain ) { rails.CSRFProtection(xhr); }});

  $(document).delegate(rails.linkDisableSelector, 'ajax:complete', =
function() {
      rails.enableElement($(this));
  });

  $(document).delegate(rails.linkClickSelector, 'click.rails', =
function(e) {
    var link =3D $(this), method =3D link.data('method'), data =3D =
link.data('params');
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

    if (link.data('remote') !=3D=3D undefined) {
      if ( (e.metaKey || e.ctrlKey) &amp;&amp; (!method || method =
=3D=3D=3D 'GET') &amp;&amp; !data ) { return true; }

      if (rails.handleRemote(link) =3D=3D=3D false) { =
rails.enableElement(link); }
      return false;

    } else if (link.data('method')) {
      rails.handleMethod(link);
      return false;
    }
  });

  $(document).delegate(rails.inputChangeSelector, 'change.rails', =
function(e) {
    var link =3D $(this);
    if (!rails.allowAction(link)) return rails.stopEverything(e);

    rails.handleRemote(link);
    return false;
  });

  $(document).delegate(rails.formSubmitSelector, 'submit.rails', =
function(e) {
    var form =3D $(this),
      remote =3D form.data('remote') !=3D=3D undefined,
      blankRequiredInputs =3D rails.blankInputs(form, =
rails.requiredInputSelector),
      nonBlankFileInputs =3D rails.nonBlankInputs(form, =
rails.fileInputSelector);

    if (!rails.allowAction(form)) return rails.stopEverything(e);

    // skip other logic when required values are missing or file upload =
is present
    if (blankRequiredInputs &amp;&amp; form.attr("novalidate") =3D=3D =
undefined &amp;&amp; rails.fire(form, 'ajax:aborted:required', =
[blankRequiredInputs])) {
      return rails.stopEverything(e);
    }

    if (remote) {
      if (nonBlankFileInputs) {
        return rails.fire(form, 'ajax:aborted:file', =
[nonBlankFileInputs]);
      }

      // If browser does not support submit bubbling, then this =
live-binding will be called before direct
      // bindings. Therefore, we should directly call any direct =
bindings before remotely submitting form.
      if (!$.support.submitBubbles &amp;&amp; $().jquery &lt; '1.7' =
&amp;&amp; rails.callFormSubmitBindings(form, e) =3D=3D=3D false) return =
rails.stopEverything(e);

      rails.handleRemote(form);
      return false;

    } else {
      // slight timeout so that the submit button gets properly =
serialized
      setTimeout(function(){ rails.disableFormElements(form); }, 13);
    }
  });

  $(document).delegate(rails.formInputClickSelector, 'click.rails', =
function(event) {
    var button =3D $(this);

    if (!rails.allowAction(button)) return rails.stopEverything(event);

    // register the pressed submit button
    var name =3D button.attr('name'),
      data =3D name ? {name:name, value:button.val()} : null;

    button.closest('form').data('ujs:submit-button', data);
  });

  $(document).delegate(rails.formSubmitSelector, =
'ajax:beforeSend.rails', function(event) {
    if (this =3D=3D event.target) rails.disableFormElements($(this));
  });

  $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', =
function(event) {
    if (this =3D=3D event.target) rails.enableFormElements($(this));
  });

})( jQuery );
</PRE></BODY></HTML>
