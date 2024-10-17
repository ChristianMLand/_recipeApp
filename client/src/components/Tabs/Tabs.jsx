import { useEffect, useState, cloneElement } from 'react';
import { useSwipeable }from 'react-swipeable';
import style from './tab.module.css';

export default function Tabs({ topOffset=0, children:tabs }) {
    const [active, setActive] = useState(0);
    const [scrollPositions, setScrollPositions] = useState(Array(tabs.length).fill(0));

    const handlers = useSwipeable({
        onSwiped: ({ dir }) => {
            switch(dir) {
                case "Left":
                    active < tabs.length-1 && handleSelectTab(active + 1)
                    break;
                case "Right":
                    active > 0 && handleSelectTab(active - 1)
                    break;
            }
        }
    })

    const handleSelectTab = i => {
        setScrollPositions(current => current.map((pos, j) => j == active ? window.scrollY : pos));
        setActive(i);
    }

    useEffect(() => {
        window.scrollTo(0, scrollPositions[active]);
    }, [scrollPositions]);

    return (
        <div className={style.tabsContainer}>
            <ul className={style.tabList} style={{'--top-offset': topOffset+"px"}}>
            { tabs.map((tab, i) =>
                <li key={i}>
                    <h2 className={i === active ? style.activeTab : ""} onClick={() => handleSelectTab(i)}>{tab.props.title}</h2>
                </li>
            )}
            </ul>
            { cloneElement(tabs[active], { handlers, key: active }) }
        </div>
    )
}