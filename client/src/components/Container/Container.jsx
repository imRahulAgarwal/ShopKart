import React from "react";

const Container = ({ classes = "", children }) => {
    return <div className={`container p-5 mx-auto ${classes}`}>{children}</div>;
};

export default Container;
