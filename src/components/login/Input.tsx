
function  Input({ type, name, placeHolder, value, onChange }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            className="outline-none border border-grey-400 rounded-[8px]  px-3 py-2
              focus:border-b-green-500 focus:border-b-2
              transition-all duration-300
            "
        />
    )
}

export default Input
