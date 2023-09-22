export const Card = (props) => {
  let { kind0Content } = props;
  console.log("kind0", kind0Content);
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <img
        src={kind0Content.picture}
        className="profile1"
        style={{ margin: "10px" }}
        alt={kind0Content.display_name}
      ></img>
      <label style={{ color: "black", margin: "20px" }}>
        {kind0Content.display_name ||
          kind0Content.name ||
          kind0Content.username}
      </label>
      <input type="radio"></input>
    </div>
  );
};
