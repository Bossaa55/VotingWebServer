
export const Input = ({ type, name, placeholder, id, value } : { type: string; name: string; placeholder: string; id: string;  value?: string }) => {
    return(
        <div className="w-full">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {name}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                placeholder={placeholder}
                defaultValue={value}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    );
}