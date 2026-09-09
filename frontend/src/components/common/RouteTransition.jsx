import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const firstRender = useRef(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
    }
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <>
      <AnimatePresence>
        {loading && <PageLoader key="route-loader" />}
      </AnimatePresence>
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.22 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default RouteTransition;
