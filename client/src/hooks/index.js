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