import Posts from "../Posts";
import "./index.css";

function Feed(props) {
    return (
        <div className={"feed-container"}>
            {props.notes.map(note => {
                return <Posts note={note} />;
            })}
        </div>
    );
}

export default Feed;
