import { useState, useEffect, useContext } from 'react';
import { AppContext } from '~/components';

export const useAuthContext = () => useContext(AppContext);

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

    const handleResize = () => {
        setIsMobile(window.innerWidth <= 500);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    return isMobile;
}

export const useDataFetcher = (service, dependencies = [], fallback = null) => {
    const [data, setData] = useState(fallback);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async signal => {
        setLoading(true);
        const { data, error } = await service(signal, ...dependencies);
        setData(data);
        setError(error);
        setLoading(false);
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, dependencies);

    return { data, error, loading };
};

export const useDataMutator = (service, fallback) => {
    const [data, setData] = useState(fallback);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const mutateData = async (...args) => {
        setLoading(true);
        try {
            setData(await service(...args));
            setError(null);
        } catch (err) {
            setError(err.response.data?.errors ?? err.response.data);
            setData(fallback);
            console.error("Error: ", err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, trigger: mutateData }
}

// eager=true fetches all data at once and then exposes what you need as you need it
// eager=false (the default) fetches data as you need it and exposes it as it loads
export const usePaginate = (service, initialLimit, total, eager = false) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [limit, setLimit] = useState(initialLimit);

    let offset = limit * currentPage;
    let totalPages = Math.ceil(total / limit);
    let realLimit = Math.min(total - offset, limit);

    const { data, loading, error } = useDataFetcher(
        service,
        eager ? [total] : [realLimit, offset]
    );

    const items = eager ? data?.slice(offset, offset + limit) : data;

    const goToPage = page => {
        setCurrentPage(Math.min(Math.max(0, page), totalPages - 1));
    };

    const updateLimit = amt => {
        totalPages = Math.ceil(total / amt);
        goToPage(Math.floor((offset + 1) / amt));
        setLimit(amt);
    };

    return {
        items,
        loading,
        currentPage,
        goToPage,
        limit,
        updateLimit,
        totalPages,
        error
    };
};