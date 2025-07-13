export const Input = ({
  type,
  name,
  placeholder,
  id,
  value,
}: {
  type: string;
  name: string;
  placeholder: string;
  id: string;
  value?: string;
}) => {
  return (
    <div className="w-full">
      <label
        className="block mb-2 text-sm font-bold text-gray-700"
        htmlFor="username"
      >
        {name}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        defaultValue={value}
        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};
