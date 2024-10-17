import {Element} from './display/element';
import {Connection} from './display/connection';
import {Elements} from './display/elements';
import {MainFrame} from './display/mainframe';
import {useState} from 'react';


type coords = {x:number,y:number}
const displayProps = {
    scale: 0.7
};

type displayPropsType = typeof displayProps;
export type {displayPropsType};
export {Element, Connection, Elements, MainFrame, displayProps};
