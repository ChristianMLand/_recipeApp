import style from './tab.module.css';

export default function Tab({ children:contents, handlers }) {
    return (
        <div {...handlers} className={style.tabCard}>{contents}</div>
    );
}