import React from "react";
import CategorizedFeed from "./CategorizedFeed";
function CategoryViewTool(props) {
    const type = props.type
    console.log("Type is ", type)

    function getFilters(type) {
        if (type === "nsfw") {
            return ["nsfw", "boobs", "tits", "ass", "naked"];
        }
        else {
            return ['memes', 'meme', 'funny', 'memestr'];
        }
    }

    return (
        <div>
            <CategorizedFeed filters={getFilters(type)} />
        </div>
    );
}

export default CategoryViewTool;
