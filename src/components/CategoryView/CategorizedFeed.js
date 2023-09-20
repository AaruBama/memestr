import React from "react";
import HashtagTool, {HashTagToolProvider} from "../HashtagTool";

function CategorizedFeed(props) {
    const filters = props.filters
    // const { LoadMoreMedia } = useHashTagContext();

    return (
        <HashTagToolProvider filterTags={filters}>
            <HashtagTool />
        </HashTagToolProvider>
    );
}

export default CategorizedFeed;
