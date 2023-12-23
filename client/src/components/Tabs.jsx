import { useEffect, useState } from 'react';
import style from './tab.module.css';

export default function Tabs({ children:tabs }) {
    const [active, setActive] = useState(0);
    const [scrollPositions, setScrollPositions] = useState(Array(tabs.length).fill(0));

    const handleSelectTab = i => {
        setScrollPositions(current => current.map((pos, j) => j == active ? window.scrollY : pos));
        setActive(i);
    }

    useEffect(() => {
        window.scrollTo(0, scrollPositions[active]);
    }, [scrollPositions]);

    return (
        <main className={style.tabsContainer}>
            <ul className={style.tabList}>
            { tabs.map((tab, i) =>
                <li key={i}>
                    <h2 className={i === active ? style.activeTab : ""} onClick={() => handleSelectTab(i)}>{tab.props.title}</h2>
                </li>
            )}
            </ul>
            { tabs[active] }
        </main>
    )
}