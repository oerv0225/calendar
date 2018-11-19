import React, { Component } from 'react';
import Calendar from './Calendar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
         <section>
             <article>
                 <Calendar />
             </article>
         </section>
      </div>
    );
  }
}

export default App;
