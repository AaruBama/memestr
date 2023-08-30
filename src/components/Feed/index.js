import Posts from "../Posts";
import "./index.css"



const containsJpgOrMp4Link = (text) => {
    const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
    return linkRegex.test(text);
};



const LoadMoreMedia = () => {
    //logic to load more posts with offset
}


function Feed(props) {
    return (
            <div className={"feed-container"}>
                {props.notes.filter((note) => { return containsJpgOrMp4Link(note.content) }).map((note) => {
                    //console.log("note", note);,

                    return <Posts note={note} />
                })}
                <button onClick={LoadMoreMedia}> Thats it for today! Take rest.</button>
            </div>
    );
}

export default Feed;