import React from 'react';
import * as lle from 'ldamle.lle';
import './App.css';
import * as Display from './display';

function App() {
    Display.useHook()
    const g1 = new lle.Generator('g1', 1);
    const g2 = new lle.Generator('g2', 2);
    const g3 = new lle.Generator('g3', 3);
    const g4 = new lle.Generator('g4', 4);
    const e1 = new lle.Element(
        '',
        ['A', 'B'],
        ['A', 'B', 'C'],
        []
    );
    const e2 = new lle.Element('E1', ['A', 'B', 'C'], ['A', 'B'], []);
    const e3 = new lle.Element('E1', ['A', 'B'], ['A', 'B'], []);
    const e4 = new lle.Element('E1', ['A', 'B', 'C', 'D'], ['A', 'B', 'C'], []);

    return (
        <div className="App">
            <Display.MainFrame>
            <Display.Element element={g1} />
            <Display.Element element={g2} />
            <Display.Element element={g3} />
            <Display.Element element={g4} />
            <Display.Element element={e1} />
            <Display.Element element={e2} />
            <Display.Element element={e3} />
            <Display.Element element={e4} />
            </Display.MainFrame>
        </div>
    );
}

export default App;
