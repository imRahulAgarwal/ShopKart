import React, { memo, useState } from "react";

const LazyImage = ({ src, alt, imgClasses }) => {
    const [imageLoading, setImageLoading] = useState(false);

    return (
        <>
            {!imageLoading && (
                <img className={`w-full object-cover ${imgClasses}`} />
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full object-cover ${imgClasses}`}
                style={{
                    opacity: imageLoading ? 1 : 0,
                    transition: "opacity 0.5s ease-in-out",
                }}
                onLoad={() => setImageLoading(true)}
            />
        </>
    );
};

export default memo(LazyImage);
