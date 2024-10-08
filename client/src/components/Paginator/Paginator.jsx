import { useState, useEffect, useRef } from 'react';
import { usePaginate } from '~/hooks';
import style from './paginator.module.css';

export default function Paginator(props) {
    const {
        service,
        limitOptions,
        maxPageButtons,
        totalItems,
        ItemComponent,
        eager
    } = props;

    const {
        items,
        loading,
        currentPage,
        goToPage,
        limit,
        updateLimit,
        totalPages,
    } = usePaginate(service, limitOptions[0], totalItems, eager);

    const pageInput = useRef(null);
    const pageArrLen = Math.min(maxPageButtons, totalPages);

    const [pageArr, setPageArr] = useState(
        Array.from({ length: pageArrLen }, (_, i) => i)
    );

    useEffect(() => {
        const mid = Math.floor(pageArrLen / 2);
        if (pageArr[mid] === currentPage) return;

        const newPageArr = Array.from({ length: pageArrLen }, (_, i) => {
            if (currentPage <= mid) return i;
            if (totalPages - currentPage <= mid) return i + totalPages - pageArrLen;
            return i + currentPage - mid;
        });

        setPageArr(newPageArr);
    }, [currentPage, limit]);

    return (
        <div className={style.container}>
            <form className={style.form}>
                <label htmlFor="limit">Amount Per Page:</label>
                <select
                    id="limit"
                    value={limit}
                    onChange={e => updateLimit(+e.target.value)}
                >
                    {limitOptions.map(opt => <option key={opt}>{opt}</option>)}
                </select>
            </form>
            {(loading || !items) ?
                <h1 className={style.loading}>Loading...</h1>
                :
                <ul className={style.itemList}>
                    {items?.map((item, i) => <ItemComponent key={i} {...item} />)}
                </ul>
            }
            <ul className={style.pageNumberList}>
                <li>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    ><i className="fa-solid fa-chevron-left"></i></button>
                </li>
                {pageArr.map(page =>
                    <li key={page}>
                        <button
                            className={currentPage === page ? style.active : ""}
                            onClick={() => goToPage(page)}
                        >{page + 1}</button>
                    </li>
                )}
                <li>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                    ><i className="fa-solid fa-chevron-right"></i></button>
                </li>
            </ul>
        </div>
    )
}