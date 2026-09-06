
function  Input({ type, name, placeHolder, value, onChange, ...props }) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            {...props}
            className="
              outline-none border border-gray-200 rounded-[8px]  px-3 py-2
              focus:border-b-green-500 focus:border-b-2 focus:outline-none
              transition-all duration-100
              shadow-sm
            "
        />
    )
}

export default Input
