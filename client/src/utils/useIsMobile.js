import { useState, useEffect } from 'react';

export default function useIsMobile() {
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