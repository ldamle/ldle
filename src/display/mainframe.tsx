import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Layout, Menu, Button, Slider } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faHand, faCircle } from '@fortawesome/free-solid-svg-icons';
import { displayProps } from '../display';
import './bg/gradient.css';

const { Sider, Content } = Layout;

// Define props interface for MainFrame
interface MainFrameProps {
    children: ReactNode; // Accepts any JSX elements passed as children
}

const MainFrame: React.FC<MainFrameProps> = ({ children }) => {
    let setScale: React.Dispatch<React.SetStateAction<number>>;
    [displayProps.scale, setScale] = useState<number>(displayProps.scale);
    const [showSlider, setShowSlider] = useState(false); // State to toggle slider visibility
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the DOM content container

    const handleMenuClick = (key: string) => {
        // Placeholder for potential future menu actions
    };

    const handleZoomChange = (value: number) => {
        setScale(value*0.7/100);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.transform = `scale(${displayProps.scale})`;
            contentRef.current.style.transformOrigin = 'top left'; // Ensure scaling is relative to the top-left corner
        }
    }, [displayProps.scale]);

    const toggleSliderVisibility = () => {
        setShowSlider(!showSlider); // Toggle visibility of the slider
    };

    // Define Menu items to replace the deprecated "children"
    const menuItems = [
        { key: '1', icon: <FontAwesomeIcon icon={faArrowPointer} />, label: 'Pointer' },
        { key: '2', icon: <FontAwesomeIcon icon={faHand} />, label: 'Hand' },
        { key: '3', icon: <FontAwesomeIcon icon={faCircle} />, label: 'Circle' },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }} className="noizeBg">
            <Sider width={'110px'} style={{ background: 'transparent', padding: '20px' }}>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ background: 'transparent' }}
                    items={menuItems} // Use items instead of children
                    onClick={(e) => handleMenuClick(e.key)}
                />
                <div style={{ marginTop: '30px' }}>
                    <Button type="default" onClick={toggleSliderVisibility}>
                        Zoom
                    </Button>
                    {showSlider && (
                        <div style={{ marginTop: '20px', marginLeft: '20px', height: '100px' }}>
                            <Slider
                                vertical
                                min={15}
                                max={250}
                                step={1}
                                value={displayProps.scale/0.7*100}
                                onChange={handleZoomChange}
                                style={{ height: '100%' }}
                            />
                        </div>
                    )}
                </div>
            </Sider>
            <Layout style={{ background: 'transparent' }}>
                <Content
                    style={{
                        margin: '10px',
                        padding: '0px',
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        borderRadius: '7px',
                        position: 'relative',
                        background: 'transparent',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Add shadow
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            width: `calc(1000vw)`, // Set a fixed canvas width
                            height: `1000vh`, // Set a fixed canvas height
                            overflow: 'hidden',
                            background: '#fff',
                        }}
                        ref={contentRef}
                    >
                        {children} {/* Render children here */}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export { MainFrame };
