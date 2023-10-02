import React from "react";
import "./index.css";

function Spinner() {
    console.log("loading spinner");
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            {/*<div*/}
            {/*    className="m-12 inline-block h-8 w-8 text-white animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"*/}
            {/*    role="status">*/}
            {/*    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">*/}
            {/*        .*/}
            {/*    </span>*/}
            {/*</div>*/}
        </div>
    );
}

export default Spinner;
