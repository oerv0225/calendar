import React, { Component } from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
 
class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        }
        let self = this;

        fetch('http://localhost:3001/get', {
            method: 'GET'
        }).then(function(response) {
              if (response.status >= 400) {
                  throw new Error('Bad response from server')
              }   
              return response.json();
          }).then(function(data) {
              console.log(data);
              self.setState({ events: data});
          }).catch(function(error) {
              console.log(error);
          }); 
    }
 
    updateCalendarEvent = (mode, new_event, calView) => {
        fetch('http://localhost:3001/' + mode, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'id': new_event.id,
                'resourceId': new_event.resourceId,
                'title': new_event.title,
                'start': new_event.start,
                'end': new_event.end,
            })
        }).then(function(response) {
              if (response.status >= 400) {
                  throw new Error('Bad response from server')
              }
              return response.json();
          }).then(function(data) {
              console.log(data);
              if (calView !== undefined) {
                  if (new_event.id === 0) {
                      new_event.id = data.id;
                      calView.calendar.renderEvent(new_event);
                  }
                  else {
                      if (mode === "save") {
                          calView.calendar.updateEvent(new_event);
                      }
                      else {
                          calView.calendar.removeEvents(new_event.id)
                      }
                  }
              }
          }).catch(function(error) {
              console.log(error);
          });
    }

    // add
    onEventSelect = (start, end, jsEvent, view, resource) => {
        const title = prompt('Enter the title for this event');
        if (title === null) {
            alert("Invalid title given");
            return;
        }

        const new_event = {
            id: 0,
            resourceId: '',
            title: title,
            start: start,
            end: end,
        };
        this.updateCalendarEvent('save', new_event, view);
    }

    // update/show details
    onEventClick = (calEvent, jsEvent, view) => {
        console.log('onEventClick');
        const title = prompt('Enter the title for this event', calEvent.title);
        if (title === null) {
            alert("Invalid title given");
            return;
        }

        calEvent.title = title;
        this.updateCalendarEvent('save', calEvent, view);
    }

    // update
    onEventDrop = (calEvent, delta, reverseFunc, jsEvent, ui, view) => {
        console.log('onEventDrop');
        const new_event = {
            id: calEvent.id,
            resourceId: calEvent.resourceId,
            title: calEvent.title,
            start: calEvent.start,
            end: calEvent.end,
        }
        this.updateCalendarEvent('save', new_event);
    }

    // update
    onEventResize = (calEvent, delta, reverseFunc, jsEvent, ui, view) => {
        console.log('onEventResize');
        const new_event = {
            id: calEvent.id,
            resourceId: calEvent.resourceId,
            title: calEvent.title,
            start: calEvent.start,
            end: calEvent.end,
        }
        this.updateCalendarEvent('save', new_event);
    }

    removeEvent = (calEvent, view) => event => {
        event.preventDefault();
        event.stopPropagation();

        console.log('removeEvent');
        const new_event = {
            id: calEvent.id,
            resourceId: calEvent.resourceId,
            title: calEvent.title,
            start: calEvent.start,
            end: calEvent.end,
        }
        this.updateCalendarEvent('remove', new_event, view);

        return false;
    }

    render() {
        const { events } = this.state;
        let self = this;

        return (
            <FullCalendar
                defaultView='agendaDay'
                id='myCalendar'
                header={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'agendaDay,agendaWeek,month'
                }}
                minTime='07:00:00'
                maxTime='20:00:00'
                navLinks={true}
                editable={true}
                selectable={true}
                eventLimit={true}
                events={events}	
                select={this.onEventSelect}
                eventClick={this.onEventClick}
                eventDrop={this.onEventDrop}
                eventResize={this.onEventResize}
                eventMouseover={function(calEvent, jsEvent, view) {
                    var node = document.createTextNode("clear");
                    var el = document.createElement('span');
                        el.setAttribute('id', 'myClose');
                        el.setAttribute('class', 'material-icons myClose');
                        el.appendChild(node);
                        el.addEventListener("click", self.removeEvent(calEvent, view));
                    this.appendChild(el);
                }}
                eventMouseout={function(calEvent, jsEvent, view) {
                    var el = document.getElementById('myClose');
                    el.parentNode.removeChild(el);
                }}
            />
        );
    }
}

export default Calendar;
