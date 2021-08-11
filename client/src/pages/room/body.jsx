function Body({ msgArr }) {
    return (
        <div>
            {msgArr.length > 0 && msgArr.map(item => <p key={item}>{item}</p>)}
        </div>
    )
}
export default Body