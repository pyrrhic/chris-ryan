import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

export default function ScrollToTop() {
    const location = useLocation();

    const [pathName, setPathName] = useState(location.pathname);

    useEffect(() => {
        const currentPathName = location.pathname;
        if (currentPathName !== pathName) {
            window.scrollTo(0, 0);
            setPathName(currentPathName);
        }
    }, [location]);
}