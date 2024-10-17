import * as lle from 'ldamle.lle';
import './App.css';
import * as Display from './display';

function App() {
    const g1 = new lle.Generator('g_1', 1);
    const g2 = new lle.Generator('g_2', 2);
    const g3 = new lle.Generator('g_3', 3);
    const g4 = new lle.Generator('g_4', 4);
    const e1 = new lle.Element('$e_1', ['A', 'B'], ['A', 'B', 'C'], []);
    const e2 = new lle.Element('$e_2', ['A', 'B', 'C'], ['A', 'B'], []);
    const e3 = new lle.Element('$e_3', ['A', 'B'], ['A', 'B'], []);
    const e4 = new lle.Element('$e_4', ['A', 'B', 'C', 'D'], ['A', 'B', 'C'], []);
    e1.in('A', g1.out());
    e1.in('B', g2.out());
    e2.in('A', e1.out('B'));
    e2.in('B', e1.out('C'));
    e2.in('C', g3.out());
    e3.in('A', e2.out('B'));
    e3.in('B', g4.out());
    e4.in('A', e1.out('A'));
    e4.in('B', e2.out('A'));
    e4.in('C', e3.out('A'));
    e4.in('D', e3.out('B'));

    const es1 = new lle.Element('$es_1', ['A', 'B', 'C', 'D'], ['A', 'B', 'C'], []);
    const es2 = new lle.Element('$es_2', ['A', 'B', 'C', 'D'], ['A', 'B', 'C'], []);
    es1.in('A', es2.out('B'));
    es2.in('A', es1.out('A'));

    return (
        <div className="App">
            <Display.MainFrame>
                {/* <Display.Elements elements={[g1, g2, g3, g4, e1, e2, e3, e4]} /> */}
                <Display.Elements elements={[g1, g2, e1]} />
            </Display.MainFrame>
        </div>
    );
}

export default App;
