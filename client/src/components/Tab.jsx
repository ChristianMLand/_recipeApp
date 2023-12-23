import style from './tab.module.css';

export default function Tab({ children:contents }) {
    return (
        <div className={style.tabCard}>{contents}</div>
    );
}