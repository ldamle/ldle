import React, {useEffect, useRef} from 'react';
import * as lle from 'ldamle.lle';
import * as d3 from 'd3';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import * as Display from '../display';

const measureFormulaWidth = (formula: string, fontSize: number) => {
    // Создаем временный скрытый элемент для измерения
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.fontSize = `${fontSize}px`;

    // Рендерим формулу в скрытый элемент
    tempDiv.innerHTML = formula;

    document.body.appendChild(tempDiv);

    // Измеряем ширину элемента
    const width = tempDiv.getBoundingClientRect().width;

    // Удаляем временный элемент
    document.body.removeChild(tempDiv);

    return width;
};

const dragHandler = (svg: d3.Selection<SVGSVGElement, unknown, any, any>) => {
    let initialX: number;
    let initialY: number;
    const drag = d3
        .drag<SVGSVGElement, unknown>()
        .on('start', function (event) {
            // Получаем текущие координаты элемента при старте перетаскивания
            const transform = d3.select(this).attr('transform');
            if (transform) {
                const translate = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (translate) {
                    initialX = parseFloat(translate[1]);
                    initialY = parseFloat(translate[2]);
                } else {
                    initialX = 0;
                    initialY = 0;
                }
            } else {
                initialX = 0;
                initialY = 0;
            }
            // Вычисляем смещение между точкой начала перетаскивания и текущими координатами
            initialX = Display.displayProps.scale * (event.x - initialX);
            initialY = Display.displayProps.scale * (event.y - initialY);
        })
        .on('drag', function (event) {
            d3.select(this).attr(
                'transform',
                `translate(${event.x - initialX}, ${event.y - initialY})`
            );
        })
        .on('end', function () {
            d3.select(this).classed('active', false);
        });
    drag(svg);
};

const renderNames = (str: string) => {
    if (str.length > 0) {
        if (str[0] === '$') {
            return katex.renderToString(str.slice(1), {
                throwOnError: false
            });
        } else if (str[0] === '%') {
            return str.slice(1);
        } else {
            return '<pre style="margin:0;padding:0;font-family:sans-serif">' + str + '</pre>';
        }
    }
    return '';
};

const Element: React.FC<{element: lle.Types.Interface.Element}> = ({element}) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (svgRef.current) {
            // Очистка SVG перед добавлением нового содержимого
            d3.select(svgRef.current).selectAll('*').remove();

            let inconn: string[] = [];
            if (element.style.display_in_connections && element.inArray) {
                inconn = element.inArray();
            }
            let inFconn = [];
            let outFconn = [];
            let name: string[] = [];
            if (element.style.display_name) {
                if (element.name) {
                    name = [element.name, ...element.style.adder_name_array];
                } else {
                    name = [...element.style.adder_name_array];
                }
            }
            let nameFcenter = [];
            let maxWidthConn = 0;
            let maxWidthName = 0;

            if (element.style.display_in_connections) {
                for (let i = 0; i < inconn.length; i++) {
                    inFconn.push(
                        renderNames(
                            element.style.preffix_name_in_connection +
                                inconn[i] +
                                element.style.suffix_name_in_connection
                        )
                    );
                    maxWidthConn = Math.max(
                        maxWidthConn,
                        measureFormulaWidth(inFconn[i], element.style.sizes.font.conn)
                    );
                }
            }
            if (element.style.display_out_connections) {
                for (let i = 0; i < element.out_connections.length; i++) {
                    outFconn.push(
                        renderNames(
                            element.style.preffix_name_out_connection +
                                element.out_connections[i].out.name +
                                element.style.suffix_name_out_connection
                        )
                    );
                    maxWidthConn = Math.max(
                        maxWidthConn,
                        measureFormulaWidth(outFconn[i], element.style.sizes.font.conn)
                    );
                }
            }
            for (let i = 0; i < name.length; i++) {
                nameFcenter.push(renderNames(name[i]));
                maxWidthName = Math.max(
                    maxWidthName,
                    measureFormulaWidth(nameFcenter[i], element.style.sizes.font.center)
                );
            }

            maxWidthConn = maxWidthConn - (maxWidthConn % 15) + 15;
            maxWidthName = maxWidthName - (maxWidthName % 15) + 15;
            let containerHeight = Math.max(
                name.length *
                    (element.style.sizes.font.center + element.style.sizes.MarginCenter.vb) +
                    element.style.sizes.MarginCenter.v,
                element.style.display_in_connections
                    ? inFconn.length *
                          (element.style.sizes.font.conn + element.style.sizes.MarginConn.v) +
                          2 * element.style.sizes.MarginConn.v
                    : 0,
                element.style.display_out_connections
                    ? outFconn.length *
                          (element.style.sizes.font.conn + element.style.sizes.MarginConn.v) +
                          2 * element.style.sizes.MarginConn.v
                    : 0
            );
            let connWidth = maxWidthConn + 2 * element.style.sizes.MarginConn.h;
            let centerWidth = maxWidthName + 2 * element.style.sizes.MarginCenter.h;
            let coontainerWidth =
                centerWidth +
                (element.style.display_out_connections ? connWidth : 0) +
                (element.style.display_in_connections ? connWidth : 0);

            const svg = d3
                .select(svgRef.current)
                .attr('width', coontainerWidth + element.style.sizes.strokeWidth)
                .attr('height', containerHeight + element.style.sizes.strokeWidth);

            svg.append('rect')
                .attr('x', element.style.sizes.strokeWidth / 2)
                .attr('y', element.style.sizes.strokeWidth / 2)
                .attr('width', coontainerWidth)
                .attr('height', containerHeight)
                .attr('fill', element.style.sizes.color.background)
                .attr('stroke', element.style.sizes.color.foreground)
                .attr('stroke-width', element.style.sizes.strokeWidth);
            if (element.style.display_in_connections && element.style.display_line_in_connections) {
                svg.append('rect')
                    .attr('x', element.style.sizes.strokeWidth / 2)
                    .attr('y', element.style.sizes.strokeWidth / 2)
                    .attr('width', connWidth)
                    .attr('height', containerHeight)
                    .attr('fill', element.style.sizes.color.background)
                    .attr('stroke', element.style.sizes.color.foreground)
                    .attr('stroke-width', element.style.sizes.strokeWidth);
            }
            if (
                element.style.display_out_connections &&
                element.style.display_line_out_connections
            ) {
                svg.append('rect')
                    .attr(
                        'x',
                        (element.style.display_in_connections ? connWidth : 0) +
                            centerWidth +
                            element.style.sizes.strokeWidth / 2
                    )
                    .attr('y', element.style.sizes.strokeWidth / 2)
                    .attr('width', connWidth)
                    .attr('height', containerHeight)
                    .attr('fill', element.style.sizes.color.background)
                    .attr('stroke', element.style.sizes.color.foreground)
                    .attr('stroke-width', element.style.sizes.strokeWidth);
            }

            const group = svg.append('g');
            dragHandler(svg);

            if (element.style.display_in_connections) {
                for (let i = 0; i < inFconn.length; i++) {
                    group
                        .append('foreignObject')
                        .attr('width', maxWidthConn)
                        .attr(
                            'height',
                            element.style.sizes.font.conn + element.style.sizes.MarginConn.v
                        )
                        .attr('x', element.style.sizes.MarginConn.h)
                        .attr(
                            'y',
                            (i + 1) * element.style.sizes.MarginConn.v +
                                i * element.style.sizes.font.conn
                        )

                        .style('font-size', `${element.style.sizes.font.conn}px`)
                        .append('xhtml:div')
                        .html(inFconn[i]);
                }
            }
            if (element.style.display_out_connections) {
                for (let i = 0; i < outFconn.length; i++) {
                    group
                        .append('foreignObject')
                        .attr('width', maxWidthConn)
                        .attr(
                            'height',
                            element.style.sizes.font.conn + element.style.sizes.MarginConn.v
                        )
                        .attr(
                            'x',
                            element.style.sizes.MarginConn.h +
                                (element.style.display_in_connections ? connWidth : 0) +
                                centerWidth
                        )
                        .attr(
                            'y',
                            (i + 1) * element.style.sizes.MarginConn.v +
                                i * element.style.sizes.font.conn
                        )
                        .style('font-size', `${element.style.sizes.font.conn}px`)
                        .append('xhtml:div')
                        .html(outFconn[i]);
                }
            }
            for (let i = 0; i < nameFcenter.length; i++) {
                group
                    .append('foreignObject')
                    .attr('width', maxWidthName)
                    .attr(
                        'height',
                        element.style.sizes.font.center +
                            (i === 0
                                ? element.style.sizes.MarginCenter.v
                                : element.style.sizes.MarginCenter.vb)
                    )
                    .attr(
                        'x',
                        element.style.sizes.MarginCenter.h +
                            (element.style.display_in_connections ? connWidth : 0)
                    )
                    .attr(
                        'y',
                        (i + 1) *
                            (i === 0
                                ? element.style.sizes.MarginCenter.v
                                : element.style.sizes.MarginCenter.vb) +
                            i * element.style.sizes.font.center
                    )
                    .style('font-size', `${element.style.sizes.font.center}px`)
                    .append('xhtml:div')
                    .html(nameFcenter[i]);
            }
        }
    }, []);

    return (
        <div className="elem.style.className">
            <svg ref={svgRef}></svg>
        </div>
    );
};
export {Element};
